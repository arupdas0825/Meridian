# Meridian — Rules.md
Hard constraints. If a task conflicts with one of these, stop and flag it — do not silently override.

## 1. Language
- JavaScript and JSX only. No `.ts`, `.tsx`, no TypeScript syntax, no TS-only tooling. Data shapes are documented with JSDoc `@typedef`, not `interface`.

## 2. Never mix module UI without reason
- Do not use LedgerWise's `Button`/`Card`/`Input` inside TaskForge screens or vice versa. Shared primitives live in `shared/ui/` and both modules migrate onto them **only** for truly generic pieces (buttons, modals, inputs, cards, chart containers, nav shell) — never for anything domain-specific (a task card is not a transaction card, ever).

## 3. Never merge business logic across modules
- Task logic stays in `modules/taskforge/services`. Finance logic stays in `modules/ledgerwise/services`. Travel logic stays in `modules/atlas/services`. Cross-module reads go through an explicit adapter function, not a shared store or direct import of another module's internals.

## 4. The eligibility rule is non-negotiable
- Manually adding or removing money from the Atlas travel wallet **must never** change `verifiedTravelSavings` or unlock a destination. Only `travelEligibilityService.recalculateVerifiedSavings()` may write that field, and it may only read from confirmed/closed LedgerWise data. Any PR or generated code that lets a manual balance edit flip a destination's lock state is a bug, full stop.

## 5. Don't hide, don't fake
- Locked destinations stay visible (blurred + lock overlay + progress), never removed from the list.
- No screen may imply a cost is a live/real market price. Every cost figure is labeled "Estimated Budget" or "Planning Estimate."
- No mock API may be presented as if it were a live integration.

## 6. Don't destroy existing functionality
Before touching a ported component:
1. Understand why it exists in the source repo.
2. Check everywhere it's used.
3. Check its dependencies (hooks, services, stores it touches).
4. Preserve its existing behavior.
5. Refactor only when there's a concrete reason (shared primitive, routing change, etc.), not by default.

## 7. Business logic never lives in components
- All calculations (budget math, eligibility, currency conversion, streaks/analytics) live in `services/` or `utils/`, imported into components — never written inline inside JSX/handlers.

## 8. Security
- Never commit real API keys, Firebase credentials, or secrets. All config via environment variables (`NEXT_PUBLIC_*` for anything client-exposed). Always ship `.env.example`, never `.env`.

## 9. Auth gate discipline
- No page is ever login-walled just for viewing. Only mutations (create/update/delete, wallet edits, goal creation, onboarding-required settings) go through `useAuthGate()`.
- Never derive `phoneHash`/user identity from anything the client sends directly (body params, headers you didn't set yourself). Always derive it server-side from the verified `meridian_session` JWT.
- Raw phone numbers are never stored as a document ID and never logged. Only the hashed form persists; the raw number only ever exists transiently during OTP send/verify.
- Onboarding is not skippable on first login — a gated action must not complete until `users/{phoneHash}.onboarded === true`.
- OTP endpoints must be rate-limited per phone number and per IP — no unlimited OTP send loop.

## 10. Responsiveness
- Every screen must be checked at 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375px. No horizontal scroll, no clipped text, no broken sidebar/chart layout at any of these.

## 11. Performance over decoration
- Framer Motion / animation is allowed but must never block interaction or hurt perceived performance. Prefer CSS transitions for simple hover/press states; reserve Framer Motion for meaningful transitions (route change, modal open, card reveal).

## 12. States are mandatory, not optional
Every data-driven screen needs: loading (skeleton), empty (see `Design.md` copy bank), and error state, plus toast confirmation on every create/update/delete action.

## 13. Data safety
- Meridian never reads from or writes to the original TaskForge/LedgerWise repos' live Firebase projects. It starts from a clean Firebase project. If real data migration is ever wanted, it's a deliberate, separate, reviewed script — never an implicit side effect of running the app.

## 14. Dependency independence
- TaskForge must run with zero knowledge of Atlas or LedgerWise existing.
- LedgerWise must run with zero knowledge of Atlas or TaskForge existing.
- Atlas is the only module allowed to depend on another (it reads LedgerWise data through the eligibility service adapter) — and even then, only through that one service, never by importing LedgerWise components/hooks directly.

## 15. Code quality baseline
- Component-based, one responsibility per component, no giant (300+ line) page components — extract subcomponents/hooks. Meaningful names, no `data2`/`temp`/`foo`. Proper error boundaries per module route group.
