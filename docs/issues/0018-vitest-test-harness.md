# Vitest test harness for financeSPA

**Status:** open · **PRD:** [0002](../../docs/prds/0002-frontend-guest-flow-category-display.md) · **Depends on:** —

## Goal

Wire a test runner into financeSPA so the Category display module (0019) and the guest flow state machine (0020) can have tests at all. The runner must be reachable via `npm test` and produce a green exit on an empty suite.

## Scope

- Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` as dev dependencies.
- Add a `vitest.config.ts` (or inline in `vite.config.ts`) that sets `environment: 'jsdom'` and includes the jest-dom matchers via `setupFilesAfterEach`.
- Add `"test": "vitest run"` to `package.json` scripts.
- No test files in this slice — just the harness wired and returning exit 0 on `npm test`.

## Acceptance criteria

- [ ] `npm test` runs to completion with exit 0 on a clean checkout.
- [ ] `npm run build` still passes (no type errors introduced by the new deps).
- [ ] `vitest` is listed as a dev dependency in `package.json`.
- [ ] `@testing-library/react` and `jsdom` are available so 0020 can call `renderHook`.

## Blocked by

None — can start immediately.
