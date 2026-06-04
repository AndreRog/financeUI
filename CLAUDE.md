# CLAUDE.md — financeSPA

Guidance for Claude Code working in the MoneyMind frontend (`financeSPA/`).

## What this is

A greenfield rebuild of the MoneyMind SPA on the Claude Design handoff (`/handoff`). The app is
a **skeleton that receives generated screens**: Claude Design (Track 1) emits React/TSX screens
that use the design-system CSS variables and `.mm-*` classes; this app (Track 2) provides the
token bridge, the `.mm-*` stylesheet, the ported primitives, and the routing/shell so those
screens drop into `src/features/<name>/` with minimal change. See
`../docs/design/spa-architecture.md` and `../docs/design/README.md`.

## Stack (locked — see spa-architecture.md for rationale)

| Concern | Choice |
|---|---|
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`, `@theme` over the handoff tokens) |
| Components | **shadcn/ui** (Radix primitives, owned in `src/components/ui/`) |
| Charts | **Recharts** (themed off the same CSS vars) |
| Routing | **React Router v7** (`react-router`) |
| Server state | **TanStack Query v5** |
| Theme | `data-theme="light\|dark"` on `<html>` via `ThemeModeProvider` |
| Icons | Inline Lucide (`Icon` + the handoff path set; `lucide-react` for chrome) |

No MUI, no Chart.js, no Emotion. Keycloak is removed until auth lands (issue 0005).

## Commands

```bash
npm run dev      # Vite dev server on http://localhost:3000
npm run build    # tsc + vite build (type-check + production bundle)
npm run lint     # ESLint (max-warnings 0)
npm run preview  # preview the production build
```

## Layout

```
src/
  app/        main.tsx (providers), router.tsx, AppShell.tsx, AuthBoundary.tsx
  styles/     tokens.css (handoff tokens + added), moneymind.css (.mm-*), globals.css (Tailwind + bridge)
  theme/      ThemeModeProvider.tsx + useThemeMode()
  components/ ported primitives (Icon, Button, Chip, SummaryCard, TxnRow, PagePlaceholder)
              ui/ — shadcn primitives (Select, Dialog, Popover, DropdownMenu, Tabs)
  features/   guest, auth, dashboard, trend, comparison, transactions, accounts, categories,
              styleguide — one screen folder each (placeholders until Claude Design fills them)
  services/   typed DTOs + fetch wrappers + TanStack Query hooks (the carried-over pattern)
  lib/        money.ts (fmt/fmtSigned), date.ts, categories.ts (CAT_COLOR), cn.ts
```

Provider order (`app/main.tsx`): `ThemeModeProvider` → `QueryClientProvider` → `BrowserRouter` →
router. The `AuthBoundary` lives inside the router so public routes (`/guest`, `/login`,
`/register`) work before auth exists. Visit `/styleguide` (dev-only) to see tokens + components in
both themes.

## The design system — rules to code by

The single source of truth is `src/styles/tokens.css` (a verbatim copy of
`handoff/colors_and_type.css` plus a few added tokens, each flagged). **Do not redefine colour,
type, spacing, or radii** — reference the tokens.

- **Theming:** `data-theme` on `<html>`; both themes are fully defined in tokens.css. Tailwind
  utilities (`bg-surface`, `text-secondary`, `rounded-lg`, …) resolve to the tokens via the
  `@theme inline` bridge in `globals.css`. The `dark:` variant is bound to `[data-theme="dark"]`.
- **`.mm-*` classes** (`src/styles/moneymind.css`) are the component look — `.mm-btn*`, `.mm-chip*`,
  `.mm-summary*`, `.mm-txn*`, `.mm-card`. Generated screens use these; the ported components render
  them. Keep them faithful to the handoff anatomy.
- **Money:** always pt-PT (`1.234,56 €`) via `fmt`/`fmtSigned` from `@/lib/money` (Unicode minus
  `−`), and always add the `.tnum` class (tabular numerals). Never render a money value without it.
- **Expense amounts are NOT red** in lists/cards (they use `--text-primary`). Only KPI trend
  **deltas** use `--income` / `--expense` colour.
- **Income vs expense is decided by Category Type** (INCOME/EXPENSE/EXCLUDED), not the amount sign.
  EXCLUDED transactions never appear in any total or breakdown. Savings = income − expense.
- **Copy:** sentence case everywhere (eyebrow/overline labels are the only ALL CAPS). No emoji.
  Second person implied. pt-PT sample data (Continente, EDP Comercial, Salário — Acme Lda.).
- **Visual restraint:** flat backgrounds, borders define structure, **two elevation steps**
  (`--shadow-sm` resting, `--shadow-md` raised/hover). Focus = 3px teal glow
  (`box-shadow: 0 0 0 3px var(--focus-ring)`), never a hard outline. Gentle 0.14–0.3s transitions,
  no bounces. No gradients (except the logo), no photography, no textures.

## Services & data

`src/services/` keeps the established pattern (typed DTO + `fetch` wrapper + a TanStack Query
hook). The existing functions target the **old** single-user backend and are rewritten against the
new multi-user backend as issues 0004–0013 land. Until then, screens use mock hooks — e.g.
`usePeriodSummary` (`summary.service.ts`) returns a mock `PeriodSummary` shaped like the future
reporting engine. Swap the `queryFn` for a real `apiFetch` call when the endpoint exists; the
component contract stays the same.

`VITE_API_URL` (`.env`) is the backend base URL (default `http://localhost:9000`).

## Integrating a Claude Design screen

1. Drop the generated TSX into `src/features/<name>/`, replacing the placeholder.
2. Swap its mock data for a TanStack Query hook over `src/services/`.
3. Reconcile any class names to the owned `.mm-*` classes / ported components.
