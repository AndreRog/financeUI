# Extract `useGuestFlow` state-machine hook

**Status:** closed · **PRD:** [0002](../../docs/prds/0002-frontend-guest-flow-category-display.md) · **Depends on:** [0018](0018-vitest-test-harness.md), [0019](0019-category-display-module.md)

## Goal

Pull the guest phase-transition logic out of `GuestScreen.tsx` and into a testable `useGuestFlow` hook, so the entire `landing → parsing → review → error` state machine can be verified without mounting the screen.

## What to build

Create `src/features/guest/useGuestFlow.ts`. The hook owns the `Phase` type, all state, and all transitions. It drives `useGuestImport` internally and exposes a stable interface to the orchestrator:

```ts
type Phase = 'landing' | 'parsing' | 'review' | 'error'

function useGuestFlow(): {
  phase: Phase
  fileName: string
  review: GuestReview | null
  currentMonth: GuestMonthlyReview | null   // derived: review.months.find(m => m.period === selectedPeriod) ?? first
  selectedPeriod: string
  errorIsUnsupported: boolean
  start(file: File): void        // sets fileName + phase=parsing, fires the mutation
  selectPeriod(period: string): void
  reset(): void                  // → landing, clears state, calls mutation.reset()
}
```

Transition rules (preserved exactly from the current inline callbacks):

- `start(file)` — sets `fileName`, moves to `parsing`, calls `guestImport.mutate(file, …)`.
- `onSuccess(data)` — stores `review`, seeds `selectedPeriod` from `data.months[0]?.period`, moves to `review`.
- `onError(err)` — sets `errorIsUnsupported = err instanceof UnsupportedBankError`, moves to `error`.
- `selectPeriod(p)` — updates `selectedPeriod`; `currentMonth` is derived, so it updates automatically.
- `reset()` — clears all state back to initial values, calls `guestImport.reset()`, moves to `landing`.

`GuestScreen.tsx` is updated to call `useGuestFlow()` instead of managing its own state. No visual change.

## Acceptance criteria

- [ ] `useGuestFlow` is in its own file under `src/features/guest/`.
- [ ] `GuestScreen.tsx` no longer owns `phase`, `fileName`, `review`, `selectedPeriod`, or `errorIsUnsupported` state directly.
- [ ] `start(file)` → `phase === 'parsing'`, then `phase === 'review'` on mutation success with `selectedPeriod` seeded from the first month and `currentMonth` derived correctly.
- [ ] Mutation rejects with `UnsupportedBankError` → `phase === 'error'`, `errorIsUnsupported === true`.
- [ ] Mutation rejects with a generic `Error` → `phase === 'error'`, `errorIsUnsupported === false`.
- [ ] `selectPeriod(p)` causes `currentMonth` to reflect the matching month from `review.months`.
- [ ] `reset()` → `phase === 'landing'`, all state cleared, `mutation.reset()` called.
- [ ] All transitions above are covered by `renderHook(useGuestFlow)` tests with `useGuestImport` mocked at its module boundary.
- [ ] The guest screen's rendered output and CSS classes are unchanged (no visual regression).
- [ ] `npm run build` passes.

## Blocked by

- [0018](0018-vitest-test-harness.md) — needs the test runner for the hook tests
- [0019](0019-category-display-module.md) — hook imports `catColor`/`normaliseLabel` from the deepened module; 0019 must ship first to avoid a broken import
