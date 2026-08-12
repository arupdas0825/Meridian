# Meridian — Design System
**v2.0 · "The Meridian Line" identity**
Plan Smart. Save More. Explore Europe.

---

## 0. Design Thesis

Meridian is named after a line drawn north–south to plot a journey. That's the whole brief in one image — so the identity is built around **one signature device, used everywhere**: a thin, luminous gradient line that behaves like a real meridian. It marks *where you are* (active nav state), *how far you've come* (progress/unlock bars), and *where modules connect* (the seam between TaskForge, LedgerWise and Atlas on the dashboard).

Everything else in this system is deliberately quiet so that line — and your data — stays the most interesting thing on screen.

**Signature element:** *The Meridian Line* — a 2px gradient thread (indigo → gold → teal, one hue per module) that:
- runs down the sidebar and **physically slides/stretches** to the active item (liquid, not a snap)
- becomes the fill of every progress/eligibility bar in Atlas
- becomes the breadcrumb underline
- appears as a soft radial glow anchor behind the module switcher and the app icon

**What changes from the current shell:** the shadcn-default blue/white shell (`221 83% 53%` primary, generic HSL grays) is retired. TaskForge, LedgerWise and Atlas keep their **module accent colors** exactly as `Design.md v1` defined them — that decision is preserved — but the neutral shell around them (background, chrome, typography, glass) is replaced with a distinct, cohesive "cartographer" system described below, so the shell itself stops looking like an unstyled template and starts looking like Meridian.

---

## 1. Color System

### 1.1 Shell neutrals — Light ("Daylight Chart")
A warm, slightly desaturated paper tone — not the generic AI-default cream (`#F4F1EA`) and not clinical white.

| Token | Hex | Use |
|---|---|---|
| `--surface-0` | `#FAF8F4` | App background |
| `--surface-1` | `#FFFFFF` | Cards, sheets |
| `--surface-2` | `#F1EEE6` | Sunken wells, inputs |
| `--ink-900` | `#1B1B22` | Primary text |
| `--ink-600` | `#4C4C58` | Secondary text |
| `--ink-400` | `#8A8A96` | Placeholder/disabled |
| `--line` | `#E4E0D6` | Hairline borders |

### 1.2 Shell neutrals — Dark ("Night Chart")
A deep ink-navy, not pure black — evokes a nautical chart read by lamplight.

| Token | Hex | Use |
|---|---|---|
| `--surface-0` | `#0B0E14` | App background |
| `--surface-1` | `#12161F` | Cards, sheets |
| `--surface-2` | `#1A2030` | Sunken wells, inputs |
| `--ink-900` | `#F3F2ED` | Primary text |
| `--ink-600` | `#A9ADBB` | Secondary text |
| `--ink-400` | `#5C6274` | Placeholder/disabled |
| `--line` | `#232A3B` | Hairline borders |

### 1.3 The Meridian Gradient (shell accent — used sparingly, signature only)
```
--meridian-gradient: linear-gradient(90deg, #4C5FD7 0%, #C9A24B 50%, #0FB6A6 100%);
```
Used only for: active nav indicator, breadcrumb underline, module-switcher glow, focus ring on primary CTAs, PWA splash mark. Never as a full background — it's a *line*, not a wash.

### 1.4 Module accents (unchanged identity, carried forward)

| Module | Primary | Accent | Notes |
|---|---|---|---|
| TaskForge | `#4C5FD7` (indigo, replaces flat shadcn blue) | `#7C8AF0` | Radix + Framer Motion untouched |
| LedgerWise | `#0F766E` light / `#2DD4BF` dark (teal) | `#F97066` (coral) | Poppins/Inter scoped to `/ledgerwise/*` — kept per v1 |
| Atlas | `#1E2A4A` (navy) | `#C9A24B` (gold) | Unlock states, compass motifs |

### 1.5 Semantic (platform-wide, unchanged from v1 — do not fork per module)
`--success: #22C55E` · `--warning: #F5A524` · `--destructive: #E5484D`

---

## 2. Typography

| Role | Face | Where | Why |
|---|---|---|---|
| Display / shell headings | **Fraunces** (variable, opsz 72–144) | Dashboard hero, module landing titles, onboarding, Atlas destination names | A warm humanist serif with cartographic, old-atlas character — the one deliberate personality choice. Used large, at low weight-count (2 weights only). |
| UI body & chrome | **Inter** | Sidebar, buttons, forms, TaskForge body, all data-dense screens | Neutral, high-legibility workhorse — already partly in use, extend it shell-wide for consistency. |
| Numerals / ledger data | **JetBrains Mono** | Money amounts, savings progress, budget figures, coordinates/dates in Atlas | Tabular figures so amounts align in tables; reinforces the "ledger/map coordinates" feel for the two most numbers-heavy modules. |
| LedgerWise headings (module-scoped only) | Poppins | `/ledgerwise/*` headings only | Preserved from v1 to keep LedgerWise's original identity intact, per PRD open question — resolved as: **unify shell, keep module identity**. |

**Scale (shell):** `text-xs 12` `sm 14` `base 16` `lg 18` `xl 20` `2xl 24` `3xl 30` `4xl 38` `5xl 48` (Fraunces only from `2xl` up). Line-height 1.15 for display, 1.55 for body.

---

## 3. Liquid Glassmorphism — Navbar & Nav Buttons

This is the app-chrome signature. Applied to: desktop top bar, mobile bottom nav, module switcher, floating action buttons. **Not** applied to content cards (those stay solid — glass is reserved for navigation chrome so it keeps meaning).

### 3.1 Glass surface recipe
```css
.glass-nav {
  background: color-mix(in srgb, var(--surface-1) 55%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid color-mix(in srgb, var(--ink-900) 8%, transparent);
  box-shadow:
    0 1px 0 0 color-mix(in srgb, white 25%, transparent) inset,
    0 8px 30px -12px rgba(0,0,0,0.25);
}
```

### 3.2 Liquid indicator (the moving "pill")
A single blurred, gradient-filled pill sits *behind* nav buttons and morphs — stretches while traveling, then settles — to the active button. Implemented as one absolutely-positioned element whose `left`/`width` is animated with Framer Motion `layoutId`, spring physics (`stiffness: 380, damping: 30`), so it "chases" clicks with organic overshoot rather than a linear slide.

```css
.liquid-indicator {
  position: absolute;
  inset: 4px;
  border-radius: 999px;
  background: var(--meridian-gradient);
  opacity: 0.16;
  filter: blur(6px);
}
.liquid-indicator::after {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
  backdrop-filter: blur(10px);
}
```

### 3.3 Nav button hover — specular sweep
On hover, a light diagonal highlight sweeps once across the button (`::before`, `background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,.35) 50%, transparent 60%)`, animated `background-position` 0→100% over 700ms, `ease-out`, one-shot per hover). Respect `prefers-reduced-motion` → sweep disabled, opacity fade only.

---

## 4. Elevation, Radius, Spacing

- Radius scale: `--radius-sm 10px` `--radius-md 14px` `--radius-lg 20px` `--radius-full 999px` — rounder than v1's `0.5rem` base; matches the "liquid" language.
- Elevation: 3 levels only — `e1` (cards, `0 1px 2px rgba(0,0,0,.06)`), `e2` (popovers/dropdowns), `e3` (modals + glass nav). No arbitrary one-off shadows.
- Spacing: 4px base grid, content max-width `1320px`, page gutters `24px` mobile / `40px` desktop.

---

## 5. Component Specs

**Sidebar (desktop):** solid `--surface-1`, not glass (glass = floating chrome only). Meridian Line runs down its left edge as a 2px gradient rail; the active item's icon sits on the liquid indicator pill described in §3.2.

**Bottom nav (mobile):** `.glass-nav`, floating with `16px` inset from screen edges (not edge-to-edge) and rounded `--radius-lg`, so it visually reads as one object — a compass — resting over content, reinforcing the "liquid glass over your journey" metaphor.

**Module switcher:** a segmented control with the meridian gradient as a soft glow (`filter: blur(24px); opacity:.35`) positioned behind whichever module is selected.

**Cards:** solid surfaces, `e1`, `1px` hairline border, `--radius-md`. On hover: `translateY(-2px)` + shadow steps to `e2`, `180ms ease-out` — no glass, no color shift.

**Destination cards (Atlas):**
- *Locked:* image desaturated (`grayscale(60%) brightness(.55)`), `backdrop-filter: blur(3px)` scrim, centered lock glyph, and the **progress bar is the Meridian Line itself** — gold-filled up to current %, unfilled portion a dim gold-25% track.
- *Unlock reveal:* on crossing threshold, the scrim animates out (`400ms`), the lock glyph morphs into a small burst of 6–8 particles along the meridian gradient (CSS-only, `translate` + `opacity`, ~600ms, respects reduced-motion by cutting straight to the "Unlocked" pill).
- *Unlocked:* full color, green pill top-right, gold hairline border replaces the scrim.

**Buttons:** primary = module accent solid, `--radius-sm`, `active:scale-[0.97]` press feedback (120ms). Shell-level primary CTAs (not module-scoped, e.g. "Get Started") use the meridian gradient as a 1.5px animated border (`background-clip` trick) rather than a filled gradient background — keeps the gradient feeling earned/rare.

**Inputs:** `--surface-2` fill, focus ring = 2px meridian-gradient-colored ring (single interpolated color per module context, not literally animated) + 2px offset.

**Toasts / empty states:** copy bank unchanged from v1 (§7–8 there) — carry forward verbatim; only the container gets `.glass-nav`-style surface at `e3`.

---

## 6. Motion System

| Moment | Treatment | Duration / Easing |
|---|---|---|
| Module/route transition | Content fades + shifts 8px along the meridian axis (horizontal on desktop, vertical on mobile) | 220ms `cubic-bezier(.4,0,.2,1)` |
| Liquid nav indicator | Framer Motion `layoutId` spring chase | spring(380, 30) |
| Card hover | Lift + shadow step | 180ms ease-out |
| Button press | Scale 0.97 | 120ms |
| Destination unlock | Scrim fade + particle burst | 400–600ms, one-shot |
| Task complete | Strike-through wipe left→right, row collapses after | 260ms |
| Money counters | Odometer-style digit roll (JetBrains Mono) on value change | 500ms per digit stagger 40ms |
| Skeleton loading | Shimmer sweep, meridian-gradient tinted at 8% opacity | 1.4s loop |

Global rule: everything above degrades gracefully — with `prefers-reduced-motion: reduce`, all transforms/springs are replaced by opacity-only crossfades ≤150ms, particle bursts are removed outright.

---

## 7. PWA Design

- **App icon:** the Meridian Line as a monogram — a single gold-to-teal-to-indigo curved line tracing a lowercase "m" silhouette on the ink-navy (`#1E2A4A`) square, maskable-safe padding (10% safe zone). Provide 512×512 source, auto-generate the standard PWA size set + maskable variant.
- **Splash screen:** `--surface-0` (theme-matched light/dark) background, icon centered, the meridian gradient line drawn in as a thin animated stroke under the wordmark on first paint only (CSS `stroke-dashoffset` draw-in, ~900ms) — this is the one "wow" moment budgeted for load time.
- **Theme-color meta:** light `#FAF8F4`, dark `#0B0E14` — swapped via `matchMedia` + the app's own theme toggle, so the OS status bar always matches shell surface, not module color.
- **Install prompt:** custom in-app banner (not the raw browser prompt) styled as `.glass-nav`, copy: *"Install Meridian — plan, spend and travel, even offline."*
- **Offline indicator:** slim 3px meridian-gradient bar pinned under the top nav when offline (LedgerWise's Dexie queue and TaskForge's cached state both surface through this single shell-level indicator, not per-module banners) — copy: *"Offline — changes will sync when you're back."*

---

## 8. Responsive & Accessibility

Carries forward `Design.md v1` §9 (breakpoint test matrix 1920→375px, 4/3/2/1-column destination grid, `ResponsiveContainer` for all charts) unchanged.

Additions:
- Visible focus rings everywhere (2px, meridian-tinted), never `outline: none` without replacement.
- Minimum contrast: body text 4.5:1 against its surface in both themes (verified against the hex pairs in §1.1/1.2).
- All glass surfaces carry a solid-color fallback (`@supports not (backdrop-filter)`) so low-power devices never render invisible chrome.
- `prefers-reduced-motion` handled centrally in one hook/utility, not per-component ad hoc.

---

## 9. Do / Don't

**Do:** keep the meridian line rare and purposeful · keep module accent colors distinct · keep glass to navigation chrome only · keep Fraunces large and infrequent.
**Don't:** gradient-fill full backgrounds · add a 4th typeface · apply glass to content cards · let locked-state Atlas cards feel punitive (they must stay browsable and inviting, not just dimmed-and-blocked).
