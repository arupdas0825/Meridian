# Meridian — Design.md

## 1. Principle
Three modules, three recognizable palettes, one shared shell. A user should be able to tell which module they're in with peripheral vision alone, from color and type alone — even before reading the breadcrumb.

## 2. Shell (shared across all modules)
- **Font stack:** system font stack (`-apple-system, "Segoe UI", Roboto...`) for UI chrome (sidebar, breadcrumb, buttons) — carried from TaskForge, keeps the shell neutral so module palettes read clearly against it.
- **Radius:** `--radius: 0.5rem` base (TaskForge's shadcn scale: `lg/md/sm` derived from it) used shell-wide.
- **Shared primitives** (`shared/ui/`): Button, Card, Dialog, Input, Select, Tabs, Skeleton, Badge, Toast — one implementation, themed per-module via CSS variable scoping (see §5), not per-module component forks.
- **Layout:** desktop persistent sidebar with module switcher at top; mobile bottom nav with 4 tabs (Dashboard / TaskForge / LedgerWise / Atlas) + a "more" overflow for Profile/Settings.
- **Breadcrumb:** `Meridian / <Module> / <Section>`, always visible under the top bar.

## 3. TaskForge module theme (preserved from source)
- Neutral shadcn-style HSL tokens: light background `0 0% 100%`, primary `221 83% 53%` (blue), dark mode `0 0% 3.6%` background.
- Radix UI components, Framer Motion for task-card reorder/complete micro-interactions.
- Keep existing task card, filter bar, and quick-add exactly as they are today — this module should look untouched to anyone who used the original TaskForge.

## 4. LedgerWise module theme (preserved from source)
- Palette: teal primary (`rgb(15 118 110)` light / `rgb(45 212 191)` on the existing `black-teal` dark variant), coral accent (`rgb(249 112 102)`), warm neutral surface (`rgb(250 250 249)`).
- Typography: Poppins (headings) + Inter (body) — scoped to `/ledgerwise/*` routes only via a `font-heading`/`font-body` utility class boundary, so it doesn't leak into the shell or other modules.
- Keep its existing multi-theme system (`data-theme="black-teal"` etc.) as a module-level setting.

## 5. Atlas module theme (new)
European travel-planning identity — distinct from both, but disciplined (no gradient soup).
- **Primary:** deep indigo/navy `#1E2A4A` (evokes an old-world map/atlas cover) with a warm gold accent `#C9A24B` (compass, wax-seal, well-traveled brass) for CTAs and unlock states.
- **Locked-state treatment:** desaturate + 40% dark overlay + backdrop-blur on the destination image, centered lock glyph, gold progress bar underneath.
- **Unlocked-state treatment:** full-color image, small green "Unlocked" pill (`#22C55E`, shared success color — same token as LedgerWise's `--color-success` for consistency at the semantic level even though the module palettes differ).
- **Typography:** shell's system font stack, no separate travel font — the palette alone carries the identity, keeping perceived load light and avoiding a third font family.
- **Imagery:** flat country flag emoji/icon + a single representative destination image per card (no photo carousels in v1 — performance over decoration, per `Rules.md` §10).

## 6. Cross-module shared semantics
Even though palettes differ, these meanings stay color-consistent everywhere: **success/positive = green, warning = amber, destructive/negative = red (`0 84.2% 60.2%` HSL, TaskForge's existing destructive token, reused platform-wide).**

## 7. Empty-state copy bank
- Tasks: *"No Tasks — You're all caught up."*
- Transactions: *"No Transactions — Your financial activity will appear here."*
- Travel goal: *"No Travel Goal Yet — Start saving toward your first European adventure."*
- Travel expenses: *"No Travel Expenses — Your trip expenses will appear here."*

## 8. Toast copy bank
- *"Travel goal created successfully."*
- *"Destination unlocked!"*
- *"You need ₹{amount} more to unlock {destination}."*
- *"Travel expense added."*
- *"Task completed."*
- *"Savings updated."*

## 9. Responsive rules
- Sidebar collapses to icon-only at `1024px`, to bottom nav at `768px` and below.
- Destination grid: 4 columns ≥1440px, 3 columns ≥1024px, 2 columns ≥768px, 1 column below.
- Charts (Recharts) always wrapped in a `ResponsiveContainer`; never a fixed pixel width.
- Test matrix: 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375px, per `Rules.md` §9.

## 10. Motion
- Framer Motion reserved for: route/module transitions, modal open/close, destination lock→unlock reveal, task complete strike-through.
- Everything else (hover, focus, button press) is a plain CSS transition (`transition-colors`, `transition-transform`), not JS-driven.
