import { Icon } from './Icon'
import { fmtSigned } from '@/lib/money'
import { catColor } from '@/lib/categories'
import { cn } from '@/lib/cn'

export interface Txn {
  merchant: string
  category: string
  amount: number
  /** Pre-formatted time/date label, e.g. "Today · 31 May" or "14:32". */
  time: string
  /** Two-char avatar initials, used when the row is not income. */
  init?: string
  /** Account badge, e.g. { short: "CGD", last4: "4821" }. */
  acc?: { short: string; last4: string }
}

interface TxnRowProps {
  txn: Txn
  /**
   * Whether to treat the row as income (green amount + up arrow avatar).
   * MoneyMind decides this from Category Type, not the amount sign — so
   * callers should pass it explicitly. Falls back to the handoff behaviour
   * (amount > 0) when omitted.
   */
  income?: boolean
  onClick?: () => void
}

/**
 * Transaction row, ported from handoff/components.jsx.
 * Expense amounts are NOT red — only income amounts get a colour.
 */
export function TxnRow({ txn, income, onClick }: TxnRowProps) {
  const isIncome = income ?? txn.amount > 0
  return (
    <div className="mm-txn" onClick={onClick}>
      <div className="mm-txn-avatar">
        {isIncome ? (
          <Icon name="arrow-up" size={20} style={{ color: 'var(--income)' }} />
        ) : (
          txn.init
        )}
      </div>
      <div className="mm-txn-meta">
        <div className="mm-txn-merchant">{txn.merchant}</div>
        <div className="mm-txn-subline">
          <span className="mm-txn-pchip">
            <span className="mm-txn-pchip-dot" style={{ background: catColor(txn.category) }} />
            {txn.category}
          </span>
          {txn.acc && (
            <span className="mm-txn-acct">
              {txn.acc.short} ·••• {txn.acc.last4}
            </span>
          )}
        </div>
      </div>
      <div className="mm-txn-right">
        <div className={cn('mm-txn-amt tnum', isIncome && 'income')}>{fmtSigned(txn.amount)}</div>
        <div className="mm-txn-when tnum">{txn.time}</div>
      </div>
    </div>
  )
}
