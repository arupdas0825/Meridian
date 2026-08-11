# Meridian — Memory.md
Living project memory for whichever agent (Antigravity or otherwise) is building Meridian across sessions. Read this file first, every session, before writing code. Append to it — don't rewrite history.

## How to use this file
1. At the start of a session: read this whole file + `Phases.md` to find the current phase.
2. At the end of a session (or after finishing a meaningful chunk): append a dated entry under "Session Log" — what was built, what decisions were made, what's left.
3. If a decision in `Architecture.md`/`Rules.md`/`Design.md` changes mid-build, record the change here **and** update the source doc — this file is the changelog, the other docs are the current source of truth.

## Project Identity
- **Name:** Meridian (modules: TaskForge, LedgerWise, Atlas)
- **Owner:** Arup Das
- **Language:** JavaScript/JSX only — no TypeScript, ever, in this repo
- **Base stack:** Next.js 15 App Router, React 19, Tailwind, Firebase (single project), Zustand, TanStack Query, Dexie

## Source Repos (reference only — do not edit these)
- TaskForge: Next.js 15 / React 19 / Zustand / TanStack Query / Firebase / Radix UI / Serwist PWA. Domain: tasks, projects, labels, analytics, calendar.
- LedgerWise: Vite / React 18 / Dexie / Firebase / Context API. Domain: income, expenses, budget engine, monthly rollover/summary. Palette: teal/coral, Poppins+Inter.

## Key Decisions (do not re-litigate without a strong reason — log it here if you do)
1. Single Next.js codebase for all three modules, not micro-frontends/iframes. (Architecture.md §1)
2. One Firebase project, Firestore namespaced by module path prefix (`taskforge/`, `ledgerwise/`, `atlas/`). (Architecture.md §4)
3. Two-number travel money model — `availableTravelFunds` vs `verifiedTravelSavings` — manual edits never touch the verified number. This is the single most important rule in the whole project. (Architecture.md §5, Rules.md §4)
4. Each module keeps its own visual identity; only the shell and truly generic primitives are shared. (Design.md, Rules.md §2)
5. Meridian starts from a clean Firebase project — no live migration of real TaskForge/LedgerWise data as a side effect of building the app. (Rules.md §13)
6. **Auth changed from Firebase Auth to custom phone + OTP**, lazy-gated: browsing needs no login, only write actions trigger login; first login forces onboarding. Firestore is kept as the DB but is server-only (Admin SDK), never touched by a client auth session. OTP provider: 2Factor.in by default, swappable. (Architecture.md §6, Rules.md §9)

## Open Questions (carried from PRD.md §10 — resolve and log here when answered)
- Typography: keep Poppins/Inter scoped to LedgerWise only, or unify at shell level? → **unresolved**
- Does Atlas eligibility count unallocated LedgerWise budget surplus, or only explicitly-designated savings? → **unresolved**
- Pin exact static EUR/INR rate + date for `currencyService` v1 → **unresolved**

## Session Log
> Append new entries below this line, most recent last. Format: `### YYYY-MM-DD — <short title>` then bullets of what changed.

### 2026-08-11 — Phase 0 to Phase 13 Foundation & Porting
- Repo initialized: yes (Next.js 15 App Router, JavaScript/JSX only, Tailwind CSS, Radix primitives, Zustand, Dexie, Firebase, Serwist).
- Phase reached: Phase 13 (Unified Dashboard & 3-Module Working Frontend Scaffold).
- Core Infrastructure Built:
  - `.env.example`, `tailwind.config.js`, `src/app/globals.css`.
  - `src/shared/lib/firebase.js` & `src/shared/lib/firestore.js` (namespaced Firestore adapter with guest/offline fallbacks).
  - `src/shared/lib/db.js` (Dexie IndexedDB `MeridianDB` schema for `lw_expenses`, `lw_budgetCache`, `atlas_walletTx`, `atlas_tripExpenses`).
  - `src/shared/services/travelEligibilityService.js` (strictly enforcing the Two-Number Money Model: manual wallet balance edits never alter `verifiedTravelSavings`).
  - `src/shared/services/currencyService.js` (INR/EUR static exchange rates & Intl formatting).
  - `src/data/europeDestinations.js` (20 European seed destinations with duration-tiered budgets & tier metadata).
  - Global Shell: `Sidebar.jsx`, `MobileNav.jsx`, `Breadcrumb.jsx`, `ModuleSwitcher.jsx`, and `DashboardLayout.jsx`.
- Modules Integrated:
  - TaskForge: Tasks page with creation, priority tagging, filtering, status toggling, and deletion.
  - LedgerWise: Expense logger with category selection, monthly spending calculations, and rollover structure.
  - Atlas: Europe Explorer grid displaying 20 destinations with locked/unlocked visual states, savings progress bars, and duration-based trip budget calculations.
  - Unified Dashboard: 3 summary cards for TaskForge, LedgerWise, and Atlas.
- Decisions made this session: Followed strict JS/JSX only constraint and two-number travel eligibility engine rule.
- Known issues / TODO for next session: Expand remaining sub-routes per module & test live server.

