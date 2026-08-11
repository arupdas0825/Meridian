# Meridian — Architecture.md

## 1. High-Level Decision
Both source repos are React + Firebase, but on different build tools (Next.js 15 vs Vite) and different React majors (19 vs 18). Running three separate deployed apps behind a link-shell would satisfy "integrated" only shallowly (shared nav, nothing else) and would force three logins/three Firebase projects to reconcile.

**Decision: Meridian is a single Next.js 15 (App Router) codebase, React 19, JavaScript/JSX only.** TaskForge's stack becomes the base (it's already Next.js + React 19). LedgerWise's Vite/React 18 code is **ported, not iframed**: its components, hooks, and business logic (especially `budgetEngine.js`) are rewritten as Next.js client components under `/ledgerwise`. Dexie (IndexedDB) still works fine client-side in Next.js, so LedgerWise's offline-first pattern is preserved as-is.

Reasoning: one router, one auth session, one deploy, one design-token system — while each module keeps its own component tree, store, and services so nothing is "merged," only "hosted together."

## 2. Tech Stack

| Layer | Choice | Source |
|---|---|---|
| Framework | Next.js 15, App Router | from TaskForge |
| UI runtime | React 19 | from TaskForge |
| Language | **JavaScript / JSX only** | user requirement — overrides original TS examples |
| Styling | Tailwind CSS 3, CSS variables per module theme | merged from both |
| Component primitives | Radix UI + shared `ui/` kit (Button, Card, Dialog, Input, Select, Tabs) | from TaskForge, extended for LedgerWise's Button/Card/Input |
| Global state | Zustand (per-module stores: `task-store`, `project-store`, `finance-store`, `travel-store`, `auth-store`) | from TaskForge, extended |
| Server/cache state | TanStack Query | from TaskForge, adopted for LedgerWise data too |
| Offline cache | Dexie (IndexedDB) — namespaced per module (`MeridianDB` with `expenses`, `travelWallet`, `travelExpenses` tables) | from LedgerWise, extended |
| Auth | Custom phone + OTP (own API routes, JWT session in httpOnly cookie) — **no Firebase Auth** | replaces both repos' Firebase Auth |
| DB | Firestore, accessed **only server-side** via Firebase Admin SDK + service account | merged into **one** Firebase project (Firestore + Storage only, Auth unused) |
| OTP delivery | 2Factor.in (default, swappable interface) | new |
| Session | `jose` (JWT sign/verify) | new |
| Animation | Framer Motion (sparingly — see `Rules.md` §performance) | from TaskForge |
| Charts | Recharts | shared by both already |
| Icons | lucide-react | shared by both already |
| Notifications | Sonner (toasts) | from TaskForge |
| PWA | Serwist (Next-native service worker) | from TaskForge; LedgerWise's offline-sync *logic* is preserved, its vite-plugin-pwa config is dropped |
| Validation | Zod | from TaskForge, extended to LedgerWise/Atlas forms |

## 3. Module Boundaries
```
src/
├── app/                          # Next.js App Router — routes only, thin pages
│   ├── (dashboard)/
│   │   ├── dashboard/page.jsx            # global unified dashboard
│   │   ├── taskforge/...                 # TaskForge routes
│   │   ├── ledgerwise/...                # LedgerWise routes
│   │   ├── atlas/...                     # Atlas routes
│   │   ├── profile/page.jsx
│   │   └── settings/page.jsx
│   └── auth/page.jsx
├── modules/
│   ├── taskforge/       # components, hooks, services, stores — ported from TaskForge repo
│   ├── ledgerwise/      # components, hooks, services, stores — ported from LedgerWise repo
│   └── atlas/           # new: components, hooks, services, stores
├── shared/
│   ├── ui/              # Button, Card, Dialog, Input, Select, Tabs, Skeleton, Toast
│   ├── layout/          # Sidebar, MobileNav, Breadcrumb, ModuleSwitcher
│   ├── lib/              # firebase config, cn(), query-client
│   └── services/
│       ├── currencyService.js
│       └── travelEligibilityService.js
```
**Rule:** a component inside `modules/taskforge` must never import from `modules/ledgerwise` directly, and vice versa. Cross-module data only flows through `shared/services/*` adapters (see §5) or through Firestore itself.

## 4. Data Architecture (Firestore, one project, namespaced, server-access only)
`userId` below is `phoneHash` — SHA-256 of the verified E.164 phone number, never the raw number.
```
users/{phoneHash}                               # onboarded flag, name, module profile fields

taskforge/{phoneHash}/tasks/{taskId}
taskforge/{phoneHash}/projects/{projectId}
taskforge/{phoneHash}/labels/{labelId}

ledgerwise/{phoneHash}/expenses/{expenseId}
ledgerwise/{phoneHash}/budgets/{yyyyMm}
ledgerwise/{phoneHash}/monthlySummaries/{yyyyMm}

atlas/{phoneHash}/wallet                         # single doc: availableFunds, verifiedSavings
atlas/{phoneHash}/walletTransactions/{txId}
atlas/{phoneHash}/goals/{goalId}
atlas/{phoneHash}/tripExpenses/{expenseId}
```
**No Firestore security rules do access control here** — there is no client Firebase Auth session for rules to check against. Every read/write goes through a Next.js Route Handler or Server Action that (a) verifies the `meridian_session` JWT, (b) derives `phoneHash` from the verified session — never from client input — and only then calls the Admin SDK. Firestore rules are set to deny-all client access as a defense-in-depth backstop (the client never talks to Firestore directly at all).

### Core data models (JS objects, JSDoc — no TS interfaces)
```js
/**
 * @typedef {Object} TravelDestination
 * @property {string} id
 * @property {string} country
 * @property {string} city
 * @property {string} flagEmoji
 * @property {string} image
 * @property {number} estimatedDailyCostEUR
 * @property {{oneMonth:number, threeMonth:number, sixMonth:number}} budgetByDuration
 * @property {number} minimumSavingsINR
 * @property {"easy"|"moderate"|"advanced"} tier
 */

/**
 * @typedef {Object} TravelGoal
 * @property {string} id
 * @property {string} destinationId
 * @property {1|3|6} durationMonths
 * @property {number} targetAmount
 * @property {number} currentAmount
 * @property {"locked"|"unlocked"|"active"|"completed"} status
 */

/**
 * @typedef {Object} TravelWallet
 * @property {number} availableTravelFunds     // freely editable
 * @property {number} verifiedTravelSavings     // derived only — never hand-edited
 * @property {string} lastVerifiedAt
 */
```

## 5. The Eligibility Engine (core of Atlas)
Two numbers, never conflated:

- **Available Travel Funds** — changes via LedgerWise savings transfers, manual add/remove, and trip expenses. Purely a spending wallet.
- **Verified Travel Savings** — computed **only** by `travelEligibilityService.recalculateVerifiedSavings()`, which reads confirmed LedgerWise monthly summaries (closed months only, not the in-progress month) and any explicit "transfer to travel savings" actions that themselves originate from a verified LedgerWise balance. Manual wallet edits never touch this number.

```
LedgerWise verified monthly summaries
        │
        ▼
travelEligibilityService.recalculateVerifiedSavings()
        │
        ▼
Verified Travel Savings ──► checkTravelEligibility(destination) ──► unlock status
        ▲
        │ (does NOT feed this line)
Manual add/remove funds ──► Available Travel Funds only
```
```js
// shared/services/travelEligibilityService.js
export function checkTravelEligibility(verifiedSavings, requiredSavings) {
  return {
    unlocked: verifiedSavings >= requiredSavings,
    remaining: Math.max(0, requiredSavings - verifiedSavings),
    percentage: Math.min(100, Math.round((verifiedSavings / requiredSavings) * 100)),
  };
}
```
All financial/unlock logic lives in `shared/services/*`, never inline in a component (see `Rules.md`).

## 6. Auth — Phone + OTP, Lazy Gate (no Firebase Auth)
Firebase Auth is **not used**. Firestore stays as the database, but it is only ever touched **server-side** (Next.js Route Handlers / Server Actions using the Firebase **Admin SDK** with a service account) — there is no Firebase client SDK auth session, so Firestore security rules are irrelevant; access control lives entirely in the server-side session check.

**Identity:** phone number is the user's identity. `users/{phoneHash}` (SHA-256 of the E.164 number, so raw phone numbers never become document IDs or leak into client bundles/logs).

**Lazy gate model** (this is the key UX rule):
1. **Browsing is always open.** Dashboard, TaskForge, LedgerWise, Atlas explorer, destination cards, everything — viewable with zero login, using either empty state or read-only/demo data.
2. **Any write action is gated.** The moment the user tries to create/edit/delete anything (add task, log expense, create travel goal, edit profile, add wallet funds, etc.), a `useAuthGate()` hook intercepts the action, opens `AuthModal`, and re-runs the original action automatically after successful login — the user never loses what they were doing.
3. **First successful OTP verify → Onboarding.** If `users/{phoneHash}` doesn't exist yet (or `onboarded !== true`), the app routes to `/onboarding` (a form, not skippable) before the gated action completes: name, module-relevant basics (e.g. LedgerWise's Student/Salaried profile type), preferences. On submit, `users/{phoneHash}.onboarded = true` and the original gated action fires.
4. **Returning users** with a valid session cookie skip both OTP and onboarding entirely — full access immediately.

**Session:** short-lived signed JWT (`jose`) in an `httpOnly`, `Secure`, `SameSite=Lax` cookie (`meridian_session`), verified on every server action/route handler that touches Firestore. No session = read-only Server Components can still render (using server-side Admin SDK reads with no user scoping, or public/demo collections), but no mutation route runs without a valid, verified session.

**OTP delivery:** provider-agnostic `otpService` — default provider **2Factor.in** (India-focused, generous free tier, single REST call for send + verify) behind a swappable interface so MSG91 or Twilio Verify can be dropped in later without touching call sites.

```
Browse (no auth)
      │
      ▼ user attempts a write action
useAuthGate() → AuthModal (phone → OTP)
      │
      ▼ OTP verified
users/{phoneHash} exists & onboarded?
      │                    │
     no                   yes
      ▼                    ▼
 /onboarding form    session cookie set
      │                    │
      └────────► full access, original action replays
```

## 7. Routing
```
/                       → marketing/landing
/auth                   → sign in
/dashboard              → unified dashboard

/taskforge              /ledgerwise             /atlas
/taskforge/tasks        /ledgerwise/income      /atlas/explore
/taskforge/projects     /ledgerwise/expenses    /atlas/goals
/taskforge/labels       /ledgerwise/budget      /atlas/budget
/taskforge/analytics    /ledgerwise/summary     /atlas/expenses
/taskforge/calendar                             /atlas/wallet

/profile
/settings
```

## 8. Currency
`shared/services/currencyService.js` exports `convert(amountINR, "EUR")` etc., backed by a single `EXCHANGE_RATES` constant clearly commented as a static v1 placeholder, ready to swap for a live API call later without touching call sites.

## 9. Migration Safety
Neither original repo's Firestore data is touched by this project directly — Meridian starts from a fresh `meridian` Firebase project (or a new namespaced prefix in an existing one, decided at setup time) and ports *code*, not live data. See `Rules.md` §12.
