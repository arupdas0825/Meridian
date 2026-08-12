<div align="center">

# Meridian

**Plan Smart. Save More. Explore Europe.**

A single login. Three modules. One honest answer: *based on what I've actually saved, which trip can I afford — and when?*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8)](#-pwa--offline)
[![Status](https://img.shields.io/badge/status-in%20development-orange)]()

[Overview](#-overview) · [Modules](#-modules) · [Tech Stack](#%EF%B8%8F-tech-stack) · [Design System](#-design-system) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Roadmap](#-roadmap) · [License](#-license)

</div>

---

## 🌍 Overview

People manage their to-dos, their money, and their travel dreams in three disconnected places — and none of those places can answer the question that actually matters. **Meridian** closes that loop.

It merges two existing projects — **TaskForge** (productivity) and **LedgerWise** (personal finance) — with a brand-new travel module, **Atlas**, under one login and one design system. TaskForge and LedgerWise keep doing exactly what they already do well; Atlas reads *verified* financial data from LedgerWise and turns it into a savings-gated European travel planner, so a locked destination is never a marketing dark pattern — it's just the truth, with a clear path to unlocking it.

> **Note:** TaskForge and LedgerWise originate from Arup's own **private** repositories. Their code has been ported into Meridian (not forked publicly) — see [Origin & Credits](#-origin--credits) below.

> Named after the meridian line — drawn north to south to plot a journey. That's the whole product in one image.

---

## 🧩 Modules

### TaskForge — Productivity
Tasks, projects, labels, priority levels, status filters, an analytics dashboard, and a calendar view. Ported and preserved, look and feel untouched.

### LedgerWise — Personal Finance
Income/expense logging, category budgets, a monthly budget engine, confirmed rollover month-end summaries, and offline-first logging that syncs when you're back online. Keeps its original teal/coral identity and multi-theme support.

### Atlas — Europe Travel Explorer
20 seed European destinations, each with duration-tiered budgets (1 / 3 / 6 months) and a minimum required savings figure.

- **Two-number money model:** *Available Travel Funds* (freely editable) vs. **Verified Travel Savings** (derived only from confirmed LedgerWise monthly summaries). Only the latter unlocks a destination — manually topping up the travel wallet can never fake an unlock.
- Locked destinations stay browsable: dimmed, with a progress bar showing exactly how much more is needed.
- Unlocked destinations support travel goal creation, a travel wallet with full transaction history, and trip expense tracking across categories (Flights, Hotels, Food, Transport, Shopping, Attractions, Emergency, Other).
- Optional bridge to TaskForge: suggested tasks for an active travel goal (e.g. *Check passport*, *Research flights*) — neither module requires the other.

---

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | JavaScript / JSX only — no TypeScript |
| Styling | Tailwind CSS, CSS-variable design tokens per module theme |
| Components | Radix UI primitives + a shared `shared/ui/` kit |
| Motion | Framer Motion |
| Global state | Zustand (per-module stores) |
| Server/cache state | TanStack Query |
| Offline cache | Dexie (IndexedDB) — `MeridianDB` |
| Auth | Custom phone number + OTP, JWT session (no client-side Firebase Auth) |
| Database | Firestore, one project, accessed **server-side only** via the Firebase Admin SDK |
| Charts | Recharts, always inside `ResponsiveContainer` |
| Icons | lucide-react |
| Notifications | Sonner |
| PWA | Serwist (Next-native service worker) |
| Validation | Zod |

Full technical decisions live in [`plans/Architecture.md`](./plans/Architecture.md); hard rules in [`plans/Rules.md`](./plans/Rules.md); build order in [`plans/Phases.md`](./plans/Phases.md).

---

## 🎨 Design System

Meridian's visual identity is built around one signature device — **the Meridian Line**: a thin gradient thread that marks active navigation, unlock progress, and the seam between modules, so the three modules feel integrated without ever feeling merged.

- Two hand-tuned themes: **Daylight Chart** (light) and **Night Chart** (dark) — warm paper and deep ink-navy, not generic template defaults.
- Liquid glassmorphism applied deliberately to navigation chrome only (sidebar, bottom nav, module switcher) — content stays solid and calm.
- Type system: Fraunces (display), Inter (UI/body), JetBrains Mono (tabular figures for money and progress).
- Full rationale, tokens, component specs, and motion catalog: [`design.md`](./design.md).
- Implementation is driven by [`master-prompt-antigravity.md`](./master-prompt-antigravity.md), the AI-coding-agent prompt used to apply the design system to this codebase.

Each module (TaskForge, LedgerWise, Atlas) keeps its own accent color and identity — only the shared shell changes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Firebase project (Firestore + Storage enabled; Auth is not used)
- An OTP delivery provider (2Factor.in by default — swappable)

### 1. Clone & install
```bash
git clone https://github.com/arupdas0825/Meridian.git
cd Meridian
npm install
```

### 2. Environment setup
```bash
cp .env.example .env.local
```
Fill in your Firebase Admin SDK service-account credentials, JWT secret, and OTP provider key.

### 3. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Build & lint
```bash
npm run build
npm run lint
```

---

## 📂 Project Structure

```
src/
├── app/                        # Next.js App Router — routes only, thin pages
│   ├── (dashboard)/
│   │   ├── dashboard/          # unified dashboard overview
│   │   ├── taskforge/          # TaskForge productivity routes
│   │   ├── ledgerwise/         # LedgerWise finance routes
│   │   ├── atlas/              # Atlas travel explorer routes
│   │   ├── profile/
│   │   └── settings/
│   └── auth/                   # phone + OTP sign-in
├── modules/
│   ├── taskforge/              # components, hooks, services, stores
│   ├── ledgerwise/             # components, hooks, services, stores
│   └── atlas/                  # components, hooks, services, stores
├── shared/
│   ├── ui/                     # Button, Card, Dialog, Input, Select, Tabs, MeridianLine...
│   ├── layout/                 # Sidebar, MobileNav, Breadcrumb, ModuleSwitcher
│   ├── lib/                    # firebase, db, utils
│   └── services/                # currencyService, travelEligibilityService
└── data/                       # Europe 20 seed destinations

plans/                          # PRD, Architecture, Rules, Phases, Design, Memory
design.md                       # visual design system (tokens, motion, PWA spec)
master-prompt-antigravity.md    # AI coding-agent implementation prompt
```

**Module boundary rule:** a component inside `modules/taskforge` never imports directly from `modules/ledgerwise`, or vice versa. Cross-module data only flows through `shared/services/*` adapters or Firestore itself.

---

## 📱 PWA & Offline

Meridian installs as a standalone app on desktop and mobile. LedgerWise's expense logging and TaskForge's cached state both work offline and sync automatically once you're back online, surfaced through a single shell-level offline indicator rather than per-module banners.

---

## 🗺️ Roadmap

- [ ] Phase 1–2: shared shell + design token rollout
- [ ] Phase 3: TaskForge + LedgerWise port completion
- [ ] Phase 4: Atlas eligibility engine + destination explorer
- [ ] Phase 5: PWA polish, offline QA, responsive audit
- [ ] Phase 6: Public beta

See [`plans/Phases.md`](./plans/Phases.md) for the full build order.

---

## 🔒 Origin & Credits

Meridian ports and adapts code from two of Arup's earlier projects:

- **TaskForge** — productivity module (tasks, projects, labels, analytics, calendar). Source repository is **private**.
- **LedgerWise** — personal finance module (expenses, budgets, monthly rollover). Source repository is **private**.

Both are owned by [Arup Das](https://github.com/arupdas0825) and are not publicly available; only their ported, adapted form lives in this repository. Meridian does not fork or mirror either original repo — see `plans/Architecture.md` §1 for how the port was done.

---

## 🤝 Contributing

This is currently a solo portfolio project, but issues and suggestions are welcome. If you'd like to contribute:
1. Fork the repo and create a feature branch.
2. Follow the constraints in `plans/Rules.md` (JavaScript/JSX only, module boundary rule, no client-side Firebase Auth).
3. Open a PR describing what changed and why — see `pr-description.md` for the template used for the design-system PR.

---

## 📄 License

Released under the [MIT License](./LICENSE) © 2026 Arup Das.
