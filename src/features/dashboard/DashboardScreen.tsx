import { PagePlaceholder } from '@/components/PagePlaceholder'
import { SummaryCard } from '@/components/SummaryCard'
import { usePeriodSummary } from '@/services/summary.service'
import { fmt } from '@/lib/money'

/**
 * Placeholder dashboard. Wired to the mock `usePeriodSummary` hook so the
 * service → hook → KPI-card path is real before Claude Design's screen lands.
 */
export function DashboardScreen() {
  const { data, isLoading } = usePeriodSummary({ period: '2026-05' })

  return (
    <PagePlaceholder
      title="Dashboard"
      intent="Period summary: income, expense and savings, with the spending breakdown by category — per bank account or all combined."
    >
      {isLoading || !data ? (
        <p className="mm-sm text-tertiary">Loading summary…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            lead
            label="Savings"
            value={fmt(data.savings)}
            icoName="wallet"
            icoIntent="primary"
            delta="12,4 %"
            deltaDir="up"
            sub="income − expense"
          />
          <SummaryCard
            label="Money in"
            value={fmt(data.income)}
            icoName="arrow-up"
            icoIntent="income"
          />
          <SummaryCard
            label="Money out"
            value={fmt(data.expense)}
            icoName="arrow-down"
            icoIntent="expense"
          />
        </div>
      )}
    </PagePlaceholder>
  )
}
