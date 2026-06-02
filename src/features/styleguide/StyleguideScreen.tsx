import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { SummaryCard } from '@/components/SummaryCard'
import { TxnRow } from '@/components/TxnRow'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fmt } from '@/lib/money'
import type { ThemeMode } from '@/theme/ThemeModeProvider'
import './styleguide.css'

const CHART_DATA = [
  { month: 'Jan', income: 2480, expense: 1736 },
  { month: 'Feb', income: 2480, expense: 1820 },
  { month: 'Mar', income: 2510, expense: 1640 },
  { month: 'Apr', income: 2480, expense: 1980 },
  { month: 'May', income: 2620, expense: 1736 },
  { month: 'Jun', income: 2480, expense: 1550 },
]

const SWATCHES = [
  ['--bg', 'bg'],
  ['--surface', 'surface'],
  ['--surface-2', 'surface-2'],
  ['--primary', 'primary'],
  ['--income', 'income'],
  ['--expense', 'expense'],
  ['--border', 'border'],
] as const

const CATS = ['Groceries', 'Transport', 'Dining', 'Bills & utilities', 'Shopping', 'Housing'] as const

function TrendChart() {
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={CHART_DATA} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-tertiary)" tickLine={false} fontSize={12} />
          <YAxis stroke="var(--text-tertiary)" tickLine={false} fontSize={12} />
          <Tooltip
            cursor={{ fill: 'var(--surface-2)' }}
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-primary)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="income" name="Money in" fill="var(--income)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Money out" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function Gallery() {
  return (
    <div className="flex flex-col gap-6">
      {/* Type scale */}
      <section className="flex flex-col gap-1">
        <span className="mm-eyebrow">Type</span>
        <p className="mm-display">Display 40</p>
        <p className="mm-h1">Heading 1</p>
        <p className="mm-h2">Heading 2</p>
        <p className="mm-h3">Heading 3</p>
        <p className="mm-body">Body — the default reading size.</p>
        <p className="mm-sm text-secondary">Small — metadata and captions.</p>
        <p className="tnum mm-body">{fmt(1234.56)}</p>
      </section>

      {/* Swatches */}
      <section className="flex flex-wrap gap-3">
        {SWATCHES.map(([token, label]) => (
          <div key={token} className="flex items-center gap-2">
            <span
              className="inline-block size-8 rounded-md"
              style={{ background: `var(${token})`, border: '1px solid var(--border)' }}
            />
            <span className="mm-sm text-secondary">{label}</span>
          </div>
        ))}
      </section>

      {/* Buttons */}
      <section className="flex flex-wrap items-center gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button size="sm" icon="plus">
          Small
        </Button>
        <Button size="lg" icon="wallet">
          Large
        </Button>
      </section>

      {/* Chips */}
      <section className="flex flex-wrap gap-2">
        {CATS.map((c, i) => (
          <Chip key={c} label={c} active={i === 0} />
        ))}
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          lead
          label="Savings"
          value={fmt(743.58)}
          icoName="wallet"
          icoIntent="primary"
          delta="12,4 %"
          deltaDir="up"
          sub="income − expense"
        />
        <SummaryCard label="Money in" value={fmt(2480)} icoName="arrow-up" icoIntent="income" />
        <SummaryCard
          label="Money out"
          value={fmt(1736.42)}
          icoName="arrow-down"
          icoIntent="expense"
          delta="4,1 %"
          deltaDir="down"
        />
      </section>

      {/* Transaction rows */}
      <section className="mm-card flex flex-col gap-1 p-2">
        <TxnRow
          txn={{
            merchant: 'Continente',
            category: 'Groceries',
            amount: -54.21,
            time: 'Today · 31 May',
            init: 'CO',
            acc: { short: 'CGD', last4: '4821' },
          }}
        />
        <TxnRow
          income
          txn={{
            merchant: 'Salário — Acme Lda.',
            category: 'Income',
            amount: 2480,
            time: 'Yesterday · 30 May',
            acc: { short: 'CGD', last4: '4821' },
          }}
        />
        <TxnRow
          txn={{
            merchant: 'EDP Comercial',
            category: 'Bills & utilities',
            amount: -73.4,
            time: '28 May',
            init: 'ED',
            acc: { short: 'BCP', last4: '0034' },
          }}
        />
      </section>

      {/* shadcn Select (grouped — the subcategory picker) */}
      <section className="max-w-xs">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Reassign subcategory" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Housing</SelectLabel>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Food</SelectLabel>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="dining">Dining out</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>

      {/* Recharts */}
      <section className="mm-card">
        <TrendChart />
      </section>
    </div>
  )
}

function Panel({ mode }: { mode: ThemeMode }) {
  return (
    <div className="sg-panel flex-1 rounded-lg border border-border p-5" data-theme={mode}>
      <p className="mm-eyebrow mb-4">{mode}</p>
      <Gallery />
    </div>
  )
}

/**
 * Dev-only styleguide. Renders the tokens + ported components + a Recharts
 * sample in BOTH themes side by side, so the look is confirmed before real
 * Claude Design screens arrive.
 */
export function StyleguideScreen() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <header className="mb-6 flex flex-col gap-1">
        <span className="mm-eyebrow">MoneyMind</span>
        <h1 className="mm-h1">Styleguide</h1>
        <p className="mm-body text-secondary">
          Design tokens and the ported MoneyMind primitives, in light and dark.
        </p>
      </header>
      <div className="flex flex-col gap-6 lg:flex-row">
        <Panel mode="light" />
        <Panel mode="dark" />
      </div>
    </div>
  )
}
