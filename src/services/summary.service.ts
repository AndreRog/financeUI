import { useQuery } from '@tanstack/react-query'

/**
 * Period summary — the shape the new reporting/summary engine will return
 * (PRD 0001, backend issue 0011). Encodes the domain rules:
 *   • income / expense / savings are driven by Category Type, not amount sign
 *   • savings = income − expense
 *   • EXCLUDED categories never appear here (filtered out before summarising)
 *
 * Until the backend lands, `usePeriodSummary` returns mock data so the
 * dashboard and /styleguide have something real-shaped to render.
 */
export interface CategoryBreakdown {
  /** Top-level Category name (its Subcategories roll up into this). */
  name: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  /** Share of the period's total expense (0–1), for bars/labels. */
  share: number
}

export interface PeriodSummary {
  /** ISO-ish period key, e.g. "2026-05". */
  period: string
  income: number
  expense: number
  /** income − expense. */
  savings: number
  /** Expense categories, largest first. EXCLUDED is never present. */
  categories: CategoryBreakdown[]
}

export interface PeriodSummaryQuery {
  period: string
  /** Bank Account uuid, or "all" for the combined view. */
  bankAccount?: string
}

const MOCK: PeriodSummary = {
  period: '2026-05',
  income: 2480.0,
  expense: 1736.42,
  savings: 743.58,
  categories: [
    { name: 'Housing', type: 'EXPENSE', amount: 720.0, share: 0.415 },
    { name: 'Groceries', type: 'EXPENSE', amount: 384.21, share: 0.221 },
    { name: 'Bills & utilities', type: 'EXPENSE', amount: 213.4, share: 0.123 },
    { name: 'Transport', type: 'EXPENSE', amount: 154.8, share: 0.089 },
    { name: 'Dining', type: 'EXPENSE', amount: 138.61, share: 0.08 },
    { name: 'Shopping', type: 'EXPENSE', amount: 125.4, share: 0.072 },
  ],
}

/** Simulates network latency so loading states are exercisable. */
function fetchPeriodSummaryMock(query: PeriodSummaryQuery): Promise<PeriodSummary> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ ...MOCK, period: query.period }), 350),
  )
}

/**
 * Example TanStack Query hook. When backend issue 0011 lands, swap the
 * queryFn for a real `apiFetch<PeriodSummary>(...)` call — the component
 * contract stays the same.
 */
export function usePeriodSummary(query: PeriodSummaryQuery) {
  return useQuery({
    queryKey: ['period-summary', query.period, query.bankAccount ?? 'all'],
    queryFn: () => fetchPeriodSummaryMock(query),
  })
}
