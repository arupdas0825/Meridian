# Meridian — Product Requirements Document (PRD)

**Project name:** Meridian
**Tagline:** *Plan Smart. Save More. Explore Europe.*
**Sub-brands (modules):** TaskForge (productivity) · LedgerWise (finance) · Atlas (travel)
**Owner:** Arup Das
**Status:** v1.0 — pre-build
**Type:** Unified full-stack web app (installable PWA), merges two existing private repos (TaskForge, LedgerWise) with a new travel module (Atlas)

> Naming note: "Meridian" is the umbrella brand — a line running north–south used to plan a journey, which is exactly what the app does across tasks, money, and travel. TaskForge and LedgerWise keep their existing identities as modules inside Meridian (same pattern the original repos already use). The new travel module is called **Atlas** instead of "PocketVoyage" — shorter, English, and fits the map/exploration theme without colliding with the platform name.

---

## 1. Problem Statement
People manage their to-dos, their money, and their travel dreams in three disconnected places. Nothing tells them the truth that actually matters: *"Based on what I've saved, which trip can I actually afford, and when?"* Meridian closes that loop — tasks stay productivity-focused, finances stay rigorous, and a new eligibility engine turns real, verified savings into an honest map of unlockable European destinations.

## 2. Goal
Ship one production-quality platform, under one login, where:
- TaskForge keeps doing what it already does well (tasks, projects, labels, analytics) — untouched in spirit.
- LedgerWise keeps doing what it already does well (income/expense tracking, monthly budget engine, offline-first logging) — untouched in spirit.
- Atlas is a brand-new module that reads *verified* financial data from LedgerWise and turns it into a savings-gated European travel planner — without ever letting a manually-typed number fake its way into an unlock.

## 3. Target Users
Primary: Arup himself (portfolio/CV project, real daily use). Secondary (design target): students and early-career professionals in or planning a move to Europe who track money and want a tangible, honest "when can I actually go" answer instead of a generic travel wishlist app.

## 4. What Already Exists (from repo analysis)

| | TaskForge | LedgerWise |
|---|---|---|
| Stack | Next.js 15 (App Router), React 19 | Vite, React 18 |
| State | Zustand + TanStack Query | React Context + Dexie (IndexedDB) |
| Auth/DB | Firebase Auth + Firestore + Cloud Functions | Firebase Auth + Firestore + Storage |
| Styling | Tailwind, shadcn-style HSL tokens, Radix UI, Framer Motion | Tailwind, custom teal/coral tokens, Poppins + Inter |
| Offline | Serwist service worker (PWA) | vite-plugin-pwa + Dexie offline queue |
| Core domain | Tasks, Projects, Labels, Analytics, Calendar | Expenses, Budget engine, Monthly check-in/rollover, Month-end summary |
| Charts | Recharts | Recharts |
| Icons | lucide-react | lucide-react |

Both already share Firebase, Recharts, and lucide-react — that overlap is the seam Meridian is built along (see `Architecture.md`).

## 5. Core Product Idea — Three Modules, One Platform
1. **TaskForge** — productivity: tasks, projects, labels, deadlines, analytics.
2. **LedgerWise** — finance: income, expenses, budget, monthly rollover, financial analytics.
3. **Atlas** — travel: Europe destination explorer, savings-gated unlock system, travel goals, travel wallet, travel expense tracking.

Rule that shapes the whole product: **modules must feel integrated, never merged.** A user always knows which module they're in.

## 6. Feature List (MVP scope)

**Global**
- One login (Firebase Auth) shared across all three modules
- Unified dashboard with three clearly separated cards (Productivity / Finance / Travel), each linking into its module
- Global sidebar (desktop) + bottom nav (mobile) with a module switcher
- Breadcrumb pattern: `Meridian / TaskForge / Tasks`

**TaskForge (ported, preserved)**
- Tasks (create/edit/delete/complete), Projects, Labels, quick-add, filters
- Analytics dashboard, Calendar view

**LedgerWise (ported, preserved)**
- Income/expense logging, category budgets, monthly check-in, month-end summary, offline logging with sync

**Atlas (new)**
- Europe Explorer: grid of 20 seed destinations (country, city, flag, image, daily/trip cost, duration tiers, minimum savings)
- Duration tiers per destination: 1 / 3 / 6 months, each with its own budget
- Two-tier money model: **Available Travel Funds** (freely editable) vs **Verified Travel Savings** (derived only from LedgerWise data + confirmed rollovers) — only the latter drives unlocks
- Locked destination cards: blurred, lock icon, progress bar, "save ₹X more" — still browsable, never hidden
- Unlocked destination flow: create a travel goal, pick duration, track budget vs spend
- Travel wallet: manual add/remove funds, full transaction/audit history
- Travel expense tracker with categories (Flights, Hotels, Food, Transport, Shopping, Attractions, Emergency, Other)
- Optional, non-blocking bridge to TaskForge: "Suggested tasks" for an active travel goal (e.g. *Check passport*, *Research flights*) — TaskForge works fully without Atlas and vice versa

## 7. Non-Goals (out of scope for MVP)
- Real payment/bank integrations or live bank-linked balances
- Live currency exchange-rate API (static, clearly-labeled demo rates for v1)
- Native mobile app (PWA only)
- Multi-user/team features, sharing, or social features
- Claiming any destination price is a live/real-time travel price — all costs are labeled "Estimated Budget"

## 8. Success Criteria
- A user can go from login → see all three module summaries on one dashboard in under 5 seconds of orientation
- Existing TaskForge and LedgerWise functionality works identically post-merge (regression-free)
- Manually editing the travel wallet balance **cannot** unlock a destination — verified by test cases
- Full flow works end-to-end with realistic seed/mock data before any backend hardening
- App is fully responsive from 375px to 1920px with zero horizontal overflow

## 9. Constraints & Preferences (binding)
- **Language: JavaScript / JSX only.** No TypeScript, no `.ts`/`.tsx` files, anywhere in the codebase.
- **No Firebase Auth.** Login is custom phone number + OTP. Firestore (one project) is still used as the database, but only accessed server-side via the Admin SDK — never a client Firebase Auth session. See `Architecture.md` §6.
- **Lazy auth gate.** The whole app is browsable without logging in. A user is only asked to log in (phone + OTP) at the moment they try to do something that writes data. First-ever login is immediately followed by a required onboarding form; after that, full access.
- Do not delete or fork the original TaskForge/LedgerWise repos — Meridian is a new repository that ports and adapts their code.
- Full detail on technical decisions lives in `Architecture.md`; hard rules live in `Rules.md`; build order lives in `Phases.md`; visual system lives in `Design.md`; long-term project memory lives in `Memory.md`.

## 10. Open Questions (confirm later, not blocking MVP)
- Keep both module identities exactly as-is visually, or unify typography (Poppins/Inter vs system font stack) at the shell level only?
- Should Atlas eligibility include a % of *unallocated* LedgerWise budget surplus, or savings-designated funds only?
- Static EUR/INR rate — pin a specific value and date in `currencyService`, revisit later.
