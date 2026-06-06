import { useNavigate } from 'react-router'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/Button'
import { fmt, fmtSigned } from '@/lib/money'
import { catColor, normaliseLabel } from '@/lib/categories'
import { monthLabel } from '@/lib/date'
import { type GuestReview, type GuestMonthlyReview } from '@/services/guest.service'

const BANK_NAMES: Record<string, string> = {
  CAIXAGERALDEPOSITOS: 'Caixa Geral de Depósitos',
  SANTANDER: 'Santander',
}

function bankName(key: string): string {
  return BANK_NAMES[key] ?? key
}

const pctFmt = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
function fmtPct(share: number): string {
  return pctFmt.format(share * 100) + ' %'
}

function SummaryCards({ month }: { month: GuestMonthlyReview }) {
  return (
    <div className="gl-summary-grid">
      <div className="gl-card">
        <div className="gl-card-head">
          <span className="gl-card-label">Income</span>
          <span className="gl-card-ico ico-income">
            <Icon name="arrow-down" size={18} />
          </span>
        </div>
        <div className="gl-card-value tnum" style={{ color: 'var(--income)' }}>
          {fmtSigned(month.income)}
        </div>
        <div className="gl-card-sub">Salary &amp; deposits</div>
      </div>
      <div className="gl-card">
        <div className="gl-card-head">
          <span className="gl-card-label">Expense</span>
          <span className="gl-card-ico ico-expense">
            <Icon name="arrow-up" size={18} />
          </span>
        </div>
        <div className="gl-card-value tnum">{fmt(month.expense)}</div>
        <div className="gl-card-sub">across {month.categories.length} categories</div>
      </div>
      <div className="gl-card">
        <div className="gl-card-head">
          <span className="gl-card-label">Savings</span>
          <span className="gl-card-ico ico-savings">
            <Icon name="piggy" size={18} />
          </span>
        </div>
        <div className="gl-card-value tnum" style={{ color: 'var(--savings)' }}>
          {fmtSigned(month.savings)}
        </div>
        <div className="gl-card-sub">income − expense</div>
      </div>
    </div>
  )
}

function CategoryBreakdown({ month }: { month: GuestMonthlyReview }) {
  const top = month.categories[0]?.share ?? 1
  return (
    <>
      <div className="gl-section-label">
        Top spending
        <span className="gl-muted">
          {month.categories.length} categories · {fmt(month.expense)}
        </span>
      </div>
      <div className="gl-breakdown">
        {month.categories.map((c) => (
          <div key={c.name} className="gl-cat">
            <div className="gl-cat-head">
              <span className="gl-cat-dot" style={{ background: catColor(c.name) }} />
              <span className="gl-cat-name">{normaliseLabel(c.name)}</span>
              <span className="gl-cat-pct tnum">{fmtPct(c.share)}</span>
            </div>
            <span className="gl-cat-amt tnum">{fmt(c.amount)}</span>
            <div className="gl-cat-track">
              <div
                className="gl-cat-fill"
                style={{ width: (top ? (c.share / top) * 100 : 0) + '%', background: catColor(c.name) }}
              />
            </div>
          </div>
        ))}
        {month.excludedCount > 0 && (
          <div className="gl-excluded-note">
            <span className="gl-cat-dot" />
            {month.excludedCount} transfer{month.excludedCount === 1 ? '' : 's'} between your own
            accounts excluded from every total.
          </div>
        )}
      </div>
    </>
  )
}

export interface GuestReviewProps {
  review: GuestReview
  month: GuestMonthlyReview
  selectedPeriod: string
  onSelectPeriod: (period: string) => void
  onStartOver: () => void
}

export function GuestReviewScreen({ review, month, selectedPeriod, onSelectPeriod, onStartOver }: GuestReviewProps) {
  const navigate = useNavigate()
  const periods = [...review.months].map((m) => m.period).reverse()

  return (
    <div className="gl-wrap">
      <div className="gl-review-head">
        <div>
          <div className="gl-eyebrow">Your review · nothing saved</div>
          <div className="gl-review-title">{monthLabel(month.period, true)}</div>
          <div className="gl-review-sub">
            {bankName(review.detectedBank)} · {month.transactionCount} transactions
          </div>
        </div>
        {periods.length > 1 && (
          <div className="gl-period">
            {periods.map((p) => (
              <button
                key={p}
                className={'gl-period-chip' + (p === selectedPeriod ? ' on' : '')}
                onClick={() => onSelectPeriod(p)}
              >
                {monthLabel(p)}
              </button>
            ))}
          </div>
        )}
      </div>

      <SummaryCards month={month} />
      <CategoryBreakdown month={month} />

      <div className="gl-cta">
        <span className="gl-cta-ico">
          <Icon name="shield-check" size={24} />
        </span>
        <div className="gl-cta-body">
          <div className="gl-cta-title">Keep this review</div>
          <div className="gl-cta-text">
            This file was read on the fly and not saved. Create a free account to keep it, import
            more months, and track every account in one place.
          </div>
        </div>
        <div className="gl-cta-actions">
          <Button variant="secondary" onClick={onStartOver}>
            Start over
          </Button>
          <Button onClick={() => navigate('/register')}>
            Create an account
            <Icon name="arrow-right" size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
