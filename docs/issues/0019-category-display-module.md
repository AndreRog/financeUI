# Category display module + monthLabel UTC fix

**Status:** closed · **PRD:** [0002](../../docs/prds/0002-frontend-guest-flow-category-display.md) · **Depends on:** [0018](0018-vitest-test-harness.md)

## Goal

Make `lib/categories.ts` the single source of truth for Category presentation — one module any screen imports for dot colours and display labels — and fix `lib/date.ts`'s `monthLabel` to handle period strings correctly. Neither change touches the guest screen's rendered output; they are pure library changes.

## What to build

**`src/styles/tokens.css` — rename `--cat-*` tokens to match the 11 backend System Categories** (ADR 0002). The handoff names (`--cat-groceries`, `--cat-dining`, `--cat-bills`, `--cat-leisure`) were provisional placeholders; the backend seed (issue 0003) is now done and is the canonical set:

| Old token | New token | Backend Category |
|---|---|---|
| `--cat-groceries` | `--cat-food` | `FOOD & DINING` |
| `--cat-bills` | `--cat-subscriptions` | `SUBSCRIPTIONS` |
| `--cat-dining` | `--cat-travel` | `TRAVEL` |
| `--cat-leisure` | `--cat-entertainment` | `ENTERTAINMENT` |
| `--cat-shopping` | _(removed)_ | no backend category |
| `--cat-education` | _(removed)_ | no backend category |
| `--cat-fees` | _(removed)_ | no backend category |

Tokens that stay unchanged: `--cat-housing`, `--cat-transport`, `--cat-health`, `--cat-other`, `--cat-savings`.

**`src/lib/categories.ts` — rewrite as a deep, pure module.** Public interface:

```ts
// Canonical registry keyed on the 11 ALL-CAPS backend Category names.
// normaliseLabel folds any input form to the display label.
export function normaliseLabel(raw: string): string  // "FOOD & DINING" → "Food & Dining"
export function catColor(label: string): string      // accepts ALL-CAPS or display form
export function isKnown(label: string): boolean
```

The registry is a `Map` keyed by an uppercased, normalised string. Each entry carries `{ display: string, color: string }`. `catColor` and `isKnown` normalise before lookup so `catColor('FOOD & DINING')` and `catColor('Food & Dining')` return the same value. Unknown labels fall back to `var(--cat-other)`.

The 11 entries and their colour vars:

| ALL-CAPS name | Display label | Colour var |
|---|---|---|
| `HOUSING` | Housing | `var(--cat-housing)` |
| `FOOD & DINING` | Food & Dining | `var(--cat-food)` |
| `TRANSPORT` | Transport | `var(--cat-transport)` |
| `HEALTH` | Health | `var(--cat-health)` |
| `SUBSCRIPTIONS` | Subscriptions | `var(--cat-subscriptions)` |
| `TRAVEL` | Travel | `var(--cat-travel)` |
| `ENTERTAINMENT` | Entertainment | `var(--cat-entertainment)` |
| `MISCELLANEOUS` | Miscellaneous | `var(--cat-other)` |
| `INCOME` | Income | `var(--income)` |
| `SAVINGS & INVESTMENTS` | Savings & Investments | `var(--cat-savings)` |
| `TRANSFERS` | Transfers | `var(--excluded)` |

The old `CAT_COLOR` record export is deleted.

**`src/lib/date.ts` — replace `monthLabel` with a UTC period-string implementation:**

```ts
export function monthLabel(period: string, withYear = false): string {
  const [y, m] = period.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: withYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, 1)))
}
```

The old `Date | string` overload is dropped. Period strings are always `"YYYY-MM"` from the API. The `Date` path was buggy for any UTC+ timezone (off-by-one month) and produced `Invalid Date` for bare `"YYYY-MM"` strings.

## Acceptance criteria

- [ ] `tokens.css` contains `--cat-food`, `--cat-subscriptions`, `--cat-travel`, `--cat-entertainment`; no longer contains `--cat-groceries`, `--cat-dining`, `--cat-bills`, `--cat-leisure`, `--cat-shopping`, `--cat-education`, `--cat-fees`.
- [ ] `catColor('FOOD & DINING')` and `catColor('Food & Dining')` return the same CSS var.
- [ ] `catColor` of an unmapped label returns `var(--cat-other)`.
- [ ] `normaliseLabel('FOOD & DINING')` → `'Food & Dining'`; ampersand preserved; idempotent on already-display labels.
- [ ] `isKnown` returns true for all 11 known Categories, false for anything else.
- [ ] `monthLabel('2026-05')` → `'May 2026'` with `withYear = true`; `'May'` with default.
- [ ] `monthLabel` does not drift to the wrong month in any UTC+ timezone (tested by constructing the date in UTC).
- [ ] All assertions above are covered by Vitest unit tests with no mocks.
- [ ] `npm run build` passes (no type errors, no broken imports).

## Blocked by

- [0018](0018-vitest-test-harness.md) — needs the test runner to ship the unit tests
