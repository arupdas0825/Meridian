# Meridian — Plan Smart. Save More. Explore Europe.

**Meridian** is a unified full-stack web application (installable PWA) that merges **TaskForge** (productivity) and **LedgerWise** (personal finance) with a brand-new travel module called **Atlas**.

> *"Based on what I've saved, which European trip can I actually afford, and when?"*

---

## 🌟 Modules

1. **TaskForge (Productivity)**
   - Tasks, projects, labels, priority levels, status filtering, analytics, and calendar integration.
   - Preserves original look, feel, and features.

2. **LedgerWise (Personal Finance)**
   - Income/expense logging, category management, monthly budget engine, and confirmed rollover monthly summaries.
   - Preserves original teal/coral identity, multi-theme support, and Dexie offline capabilities.

3. **Atlas (Europe Travel Explorer)**
   - 20 seed European destinations with duration-tiered budgets (1, 3, and 6 months) and minimum required savings.
   - **Two-Number Money Model:** Destination unlocks are strictly driven by `verifiedTravelSavings` derived from confirmed LedgerWise monthly summaries. Manually adding/removing money from the travel wallet never alters unlock state.
   - Locked destinations feature a dark overlay with progress bars; unlocked destinations enable travel goal creation and trip expense tracking.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 App Router (React 19)
- **Language:** JavaScript / JSX only (Zero TypeScript)
- **Styling:** Tailwind CSS, CSS variables per module theme
- **Primitives:** Radix UI, lucide-react icons, Framer Motion
- **State Management:** Zustand, TanStack Query
- **Offline Cache:** Dexie (IndexedDB `MeridianDB`)
- **Backend & Auth:** Firebase Auth (shared identity) + Firestore (namespaced paths)
- **PWA:** Serwist

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/arupdas0825/Meridian.git
cd Meridian
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and add your Firebase credentials:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router routes
│   ├── (dashboard)/
│   │   ├── dashboard/    # Unified dashboard overview
│   │   ├── taskforge/    # TaskForge productivity routes
│   │   ├── ledgerwise/   # LedgerWise finance routes
│   │   ├── atlas/        # Atlas travel explorer routes
│   │   ├── profile/
│   │   └── settings/
│   └── auth/             # Shared sign-in
├── shared/
│   ├── layout/           # Sidebar, MobileNav, Breadcrumb, ModuleSwitcher
│   ├── lib/              # Firebase, Firestore adapter, Dexie DB, utils
│   ├── services/         # travelEligibilityService, currencyService
│   └── ui/               # Shared UI kit (Button, Card, Input, Badge, etc.)
└── data/                 # Europe 20 seed destinations
```

---

## 📄 License
MIT &copy; 2026 Arup Das
