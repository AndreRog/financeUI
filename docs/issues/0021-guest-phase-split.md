# Split GuestScreen into phase components

**Status:** open · **PRD:** [0002](../../docs/prds/0002-frontend-guest-flow-category-display.md) · **Depends on:** [0019](0019-category-display-module.md), [0020](0020-guest-flow-state-machine.md)

## Goal

Break the 500-line `GuestScreen.tsx` monolith into one file per visual phase plus a thin orchestrator, so a change to one phase touches one file and the screen's overall shape is obvious at a glance.

## What to build

Split `src/features/guest/GuestScreen.tsx` into the following files. No new behaviour — this is a structural change only.

**Phase components** (each receives only the props it needs):

- `GuestLanding.tsx` — the drag-and-drop upload zone and hero copy. Receives `onFile: (file: File) => void`. Renders `Dropzone`, `SecurityNote`, `SupportedBanks`.
- `GuestParsing.tsx` — the animated "one moment" loading state. Receives `fileName: string`.
- `GuestReview.tsx` — the monthly review: summary cards, category breakdown, period chips, CTA. Receives `review`, `month`, `selectedPeriod`, `onSelectPeriod`, `onStartOver`. Imports `catColor` and `normaliseLabel` from `lib/categories.ts` (deleting the guest screen's private `CAT_TOKEN`, `catColor`, `prettyCat`). Imports `monthLabel` from `lib/date.ts` (deleting the guest screen's private `monthLabel`).
- `GuestError.tsx` — the error state for unsupported or unreadable files. Receives `fileName`, `unsupported`, `onStartOver`.

**Shared chrome** (extracted once, imported by the phases that need them):

- `GuestTopBar.tsx` — brand mark + login button + theme toggle.
- `GuestFooter.tsx` — copyright and links.
- `GuestSecurityNote.tsx` — lock icon + "processed securely" copy.
- `GuestSupportedBanks.tsx` — "Works with CGD / Santander" row.

**Thin orchestrator** — `GuestScreen.tsx` shrinks to ~50 lines: renders `GuestTopBar`, switches on `useGuestFlow().phase` to mount the right phase component, conditionally renders `GuestFooter`. No local state; all state comes from `useGuestFlow`.

All files live under `src/features/guest/`.

## Acceptance criteria

- [ ] `GuestScreen.tsx` contains no local `useState` calls — all state is from `useGuestFlow`.
- [ ] `GuestScreen.tsx` is ≤ 60 lines (excluding imports).
- [ ] Each phase is in its own `.tsx` file under `src/features/guest/`.
- [ ] `GuestScreen.tsx` no longer contains `CAT_TOKEN`, the private `catColor`, `prettyCat`, or the private `monthLabel`.
- [ ] `GuestReview` imports `catColor` and `normaliseLabel` from `@/lib/categories` and `monthLabel` from `@/lib/date`.
- [ ] The guest screen at `/guest` looks and behaves exactly as before — all four phases render correctly, period chips switch months, "Start over" and "Try another file" reset the flow.
- [ ] `npm run build` passes with no type errors.
- [ ] `npm test` stays green (no test regressions from the structural move).

## Blocked by

- [0019](0019-category-display-module.md) — `GuestReview` imports `catColor`/`normaliseLabel`/`monthLabel` from the deepened lib; must exist before this split compiles
- [0020](0020-guest-flow-state-machine.md) — `GuestScreen.tsx` orchestrator uses `useGuestFlow`; must exist before this slice ships
