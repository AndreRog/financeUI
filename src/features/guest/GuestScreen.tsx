import { useRef, useState, type DragEvent } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/Button'
import { useThemeMode } from '@/theme/ThemeModeProvider'
import { fmt, fmtSigned } from '@/lib/money'
import { type GuestReview, type GuestMonthlyReview } from '@/services/guest.service'
import { useGuestFlow } from './useGuestFlow'

const BANK_NAMES: Record<string, string> = {
  CAIXAGERALDEPOSITOS: 'Caixa Geral de Depósitos',
  SANTANDER: 'Santander',
}

const CAT_TOKEN: Record<string, string> = {
  HOUSING: '--cat-housing',
  'FOOD & DINING': '--cat-groceries',
  TRANSPORT: '--cat-transport',
  SUBSCRIPTIONS: '--cat-dining',
  HEALTH: '--cat-health',
  TRAVEL: '--cat-leisure',
  ENTERTAINMENT: '--cat-leisure',
  'SAVINGS & INVESTMENTS': '--cat-savings',
  INCOME: '--income',
  MISCELLANEOUS: '--cat-other',
}

function bankName(key: string): string {
  return BANK_NAMES[key] ?? key
}

function catColor(name: string): string {
  return `var(${CAT_TOKEN[name.toUpperCase()] ?? '--cat-other'})`
}

/** "FOOD & DINING" → "Food & Dining" (system names are upper-case). */
function prettyCat(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map((w) => (w === '&' ? '&' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

function monthLabel(period: string, withYear = false): string {
  const [y, m] = period.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, 1))
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: withYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(date)
}

const pctFmt = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
function fmtPct(share: number): string {
  return pctFmt.format(share * 100) + ' %'
}

export function GuestScreen() {
  const { phase, fileName, review, currentMonth, selectedPeriod, errorIsUnsupported, start, selectPeriod, reset } =
    useGuestFlow()

  return (
    <div className="gl-page">
      <TopBar />
      <main className="gl-main">
        {phase === 'landing' && <Landing onFile={start} />}
        {phase === 'parsing' && <Parsing fileName={fileName} />}
        {phase === 'review' && review && currentMonth && (
          <Review
            review={review}
            month={currentMonth}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={selectPeriod}
            onStartOver={reset}
          />
        )}
        {phase === 'error' && (
          <ErrorState fileName={fileName} unsupported={errorIsUnsupported} onStartOver={reset} />
        )}
      </main>
      {phase !== 'review' && <Footer />}
    </div>
  )
}

/* ------------------------------------------------------------------ chrome */

function TopBar() {
  const { mode, toggle } = useThemeMode()
  const navigate = useNavigate()
  return (
    <header className="gl-top">
      <div className="gl-brand">
        <span className="gl-brand-mark">
          <Icon name="trending-up" size={16} strokeWidth={2.4} />
        </span>
        <span className="gl-brand-name">MoneyMind</span>
      </div>
      <div className="gl-top-actions">
        <button className="gl-login" onClick={() => navigate('/login')}>
          Log in
        </button>
        <button
          className="gl-toggle"
          onClick={toggle}
          aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="gl-foot">
      <span>© 2026 MoneyMind</span>
      <div className="gl-foot-links">
        <span>Privacy</span>
        <span>How it works</span>
        <span>Contact</span>
      </div>
    </footer>
  )
}

function SecurityNote() {
  return (
    <div className="gl-secure">
      <Icon name="lock" size={15} />
      <span>Processed securely and never saved.</span>
    </div>
  )
}

function SupportedBanks() {
  const banks = [
    { short: 'CGD', name: 'Caixa Geral de Depósitos' },
    { short: 'SAN', name: 'Santander' },
  ]
  return (
    <div className="gl-banks center">
      <span className="gl-banks-label">Works with</span>
      {banks.map((b) => (
        <span key={b.short} className="gl-bank">
          <span className="gl-account-badge">{b.short}</span>
          {b.name}
        </span>
      ))}
      <span className="gl-more">more banks soon</span>
    </div>
  )
}

/* ------------------------------------------------------------------ landing */

function Landing({ onFile }: { onFile: (file: File) => void }) {
  return (
    <div className="gl-wrap narrow gl-center">
      <div className="gl-eyebrow">No signup · free</div>
      <h1 className="gl-hero-title">See where your money goes</h1>
      <p className="gl-hero-sub">
        Upload a bank statement and get a clear monthly review in seconds. No account, no waiting.
      </p>
      <Dropzone onFile={onFile} />
      <SecurityNote />
      <SupportedBanks />
    </div>
  )
}

function Dropzone({ onFile }: { onFile: (file: File) => void }) {
  const [hot, setHot] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setHot(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  async function useSample() {
    const res = await fetch('/sample-statement.csv')
    const blob = await res.blob()
    onFile(new File([blob], 'extrato-cgd-exemplo.csv', { type: 'text/csv' }))
  }

  return (
    <div
      className={'gl-drop' + (hot ? ' hot' : '')}
      onDragOver={(e) => {
        e.preventDefault()
        setHot(true)
      }}
      onDragLeave={() => setHot(false)}
      onDrop={onDrop}
    >
      <span className="gl-drop-ico">
        <Icon name="upload" size={26} />
      </span>
      <div className="gl-drop-title">Drop your bank statement here</div>
      <div className="gl-drop-hint">CSV exported from your bank · up to 12 months</div>
      <div className="gl-drop-actions">
        <Button icon="file-text" onClick={() => inputRef.current?.click()}>
          Choose a CSV file
        </Button>
        <span className="gl-or">or</span>
        <Button variant="ghost" icon="sparkle" onClick={useSample}>
          Use a sample file
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ parsing */

function Parsing({ fileName }: { fileName: string }) {
  return (
    <div className="gl-wrap narrow gl-center">
      <div className="gl-eyebrow">Reading your statement</div>
      <h1 className="gl-hero-title">One moment</h1>
      <div className="gl-parse">
        <span className="gl-parse-file">
          <Icon name="file-text" size={16} />
          {fileName}
        </span>
        <div className="gl-parse-title">Building your review…</div>
        <div className="gl-steps">
          <div className="gl-step active">
            <span className="gl-step-dot">
              <span className="gl-spin" />
            </span>
            Reading transactions
          </div>
          <div className="gl-step todo">
            <span className="gl-step-dot" />
            Sorting into categories
          </div>
        </div>
        <div className="gl-bar-track">
          <div className="gl-bar-fill" style={{ width: '62%' }} />
        </div>
      </div>
      <SecurityNote />
    </div>
  )
}

/* ------------------------------------------------------------------ review */

interface ReviewProps {
  review: GuestReview
  month: GuestMonthlyReview
  selectedPeriod: string
  onSelectPeriod: (period: string) => void
  onStartOver: () => void
}

function Review({ review, month, selectedPeriod, onSelectPeriod, onStartOver }: ReviewProps) {
  const navigate = useNavigate()
  // Period chips read oldest → newest (months come newest-first from the API).
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
              <span className="gl-cat-name">{prettyCat(c.name)}</span>
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

/* ------------------------------------------------------------------ error */

interface ErrorProps {
  fileName: string
  unsupported: boolean
  onStartOver: () => void
}

function ErrorState({ fileName, unsupported, onStartOver }: ErrorProps) {
  return (
    <div className="gl-wrap narrow gl-center">
      <div className="gl-error">
        <span className="gl-error-ico">
          <Icon name="alert" size={26} />
        </span>
        <div className="gl-error-title">
          {unsupported ? "This bank isn't supported yet" : 'We could not read this file'}
        </div>
        <p className="gl-error-text">
          We couldn&apos;t read{' '}
          <span className="gl-error-bank">
            <Icon name="file-text" size={14} />
            {fileName || 'your file'}
          </span>
          . Today MoneyMind reads Caixa Geral de Depósitos and Santander — more are on the way.
        </p>
        <div className="gl-request">
          <input className="gl-input" type="email" placeholder="you@email.pt" />
          <Button icon="mail">Request it</Button>
        </div>
        <div className="gl-error-foot">
          We&apos;ll email you the moment more banks are ready. Your file was not saved.
        </div>
        <div style={{ marginTop: 'var(--space-2)' }}>
          <Button variant="ghost" onClick={onStartOver}>
            Try another file
          </Button>
        </div>
      </div>
      <SupportedBanks />
    </div>
  )
}
