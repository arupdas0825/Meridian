# Meridian — Phases.md
Sequential build plan. Do not skip ahead to Atlas UI before Phase 1–2 analysis is actually reflected in the ported code — the whole point of Meridian is fidelity to the two source apps.

## Phase 0 — Repo & Environment Setup
- Init new Next.js 15 (App Router, JS only — `create-next-app` with `--js` flag) repo named `meridian`.
- Install shared deps: firebase, zustand, @tanstack/react-query, tailwindcss, radix-ui packages, framer-motion, recharts, lucide-react, sonner, dexie, dexie-react-hooks, zod, class-variance-authority, clsx, tailwind-merge, tailwindcss-animate.
- Set up `.env.example` with `NEXT_PUBLIC_FIREBASE_*` keys.
- Create one Firebase project (Auth + Firestore + Storage + Functions).

## Phase 1 — Analyze TaskForge
- Re-read every file under `modules/taskforge` target list: stores (`task-store`, `project-store`), hooks (`useTasks`, `useProjects`, `useLabels`, `useAnalytics`, `useAuth`), services (`tasks.js`, `projects.js`, `labels.js`, `analytics.js`), UI kit, dashboard components, sidebar/nav.
- Document what each piece does before porting it.

## Phase 2 — Analyze LedgerWise
- Re-read `budgetEngine.js` (this is the most important file — it's the finance brain), `db.js` (Dexie schema), expense/onboarding features, hooks (`useExpenses`, `useMonthRollover`, `useOfflineSync`), theme system (`ThemeContext`, multi-theme CSS vars).
- Document the monthly rollover / month-end summary flow precisely before touching it.

## Phase 3 — Global Architecture & Design System
- Scaffold `shared/ui`, `shared/layout`, `shared/lib`, `shared/services`.
- Build the merged Tailwind config (§ see `Design.md` for token merge strategy).
- Build `shared/lib/firebase.js` (single config), `shared/lib/query-client.js`.

## Phase 4 — Global Shell
- App shell: Sidebar (desktop) + bottom nav (mobile), ModuleSwitcher, Breadcrumb, top-level `layout.jsx`, auth gate.
- Route groups for `taskforge/`, `ledgerwise/`, `atlas/`, `profile/`, `settings/`.

## Phase 5 — TaskForge Integration
- Port stores, hooks, services, and components 1:1 into `modules/taskforge`, adjusting only import paths and the shared `ui/` primitives where genuinely reusable.
- Verify: create/edit/delete task, filters, categories, quick-add, analytics dashboard, calendar — all working against the new Firestore path (`taskforge/{userId}/...`).

## Phase 6 — LedgerWise Integration
- Port `budgetEngine.js` and Dexie schema (rename DB to `MeridianDB`, keep table shapes, add `expenses` table under a `module: "ledgerwise"` partition or separate table name to avoid collision with Atlas's own Dexie tables).
- Port income/expense logging, monthly check-in, month-end summary, offline sync queue.
- Verify against `ledgerwise/{userId}/...` Firestore paths.

## Phase 7 — Atlas Module Shell
- Build routes: `/atlas`, `/atlas/explore`, `/atlas/goals`, `/atlas/budget`, `/atlas/expenses`, `/atlas/wallet`.
- Build the travel-specific visual identity (see `Design.md`).

## Phase 8 — Europe Explorer + Seed Data
- Build `data/europeDestinations.js` — 20 destinations per the PRD list, each with `TravelDestination` shape, duration-tiered budgets, minimum savings.
- Build destination card component with locked/unlocked visual states.

## Phase 9 — Eligibility Engine
- Implement `shared/services/travelEligibilityService.js` exactly per `Architecture.md` §5.
- Implement `shared/services/currencyService.js`.
- Unit-style manual test: manually add ₹50,000 to wallet → confirm no destination unlock changes; close a LedgerWise month with real savings → confirm `verifiedTravelSavings` updates and eligible destinations unlock.

## Phase 10 — Lock/Unlock System + Destination Detail
- Wire explorer grid to the eligibility engine.
- Build locked-state card (blur, lock icon, progress, "save ₹X more") and unlocked-state detail (create goal, pick duration, budget breakdown).

## Phase 11 — Travel Goals, Wallet, Expense Tracking
- Goal creation flow (destination + duration → target amount from `budgetByDuration`).
- Travel wallet: add/remove funds with transaction history (audit list).
- Trip expense tracker (categories from PRD §6), budget vs spent vs remaining.
- Toasts for every create/update/delete.

## Phase 12 — Optional TaskForge Bridge
- "Suggested tasks" panel on an active travel goal, writing into TaskForge's task store as normal tasks tagged with a travel-goal reference — purely additive, TaskForge itself stays unaware of Atlas's existence structurally.

## Phase 13 — Unified Dashboard
- Build the three-card dashboard (Productivity / Finance / Travel) pulling live summary data from each module's store/service.

## Phase 14 — Responsive Pass
- Test all screens at the 8 breakpoints from `Rules.md` §9. Fix overflow, sidebar collapse, chart reflow, mobile nav.

## Phase 15 — States, Errors, Empty States, Notifications
- Add skeletons, empty states (copy bank in `Design.md`), error boundaries per route group, Sonner toasts for all mutations.

## Phase 16 — PWA
- Configure Serwist for the unified app (manifest, icons, offline fallback page), replacing TaskForge's and LedgerWise's separate PWA configs with one.

## Phase 17 — Documentation
- Finalize `README.md` (setup, env vars, module overview) and confirm this doc set (`PRD.md`, `Architecture.md`, `Rules.md`, `Phases.md`, `Design.md`, `Memory.md`) is accurate to what was actually built.

## Phase 18 — QA Pass
- Full regression pass on TaskForge and LedgerWise flows (must behave identically to source repos).
- Full Atlas flow: browse → locked card → save via LedgerWise → unlock → create goal → track trip expenses.
- Confirm the exploit case from Rule 4 is impossible.

**Milestone definition:** Phase 13 complete with realistic seed data = first shippable milestone, even before Phase 16–18 hardening. Do not stop at a landing page — the milestone is a working app across all three modules.
