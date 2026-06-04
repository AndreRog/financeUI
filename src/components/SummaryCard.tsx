import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'

type IcoIntent = 'income' | 'expense' | 'primary'

interface SummaryCardProps {
  label: string
  value: ReactNode
  icoName?: IconName
  /** Tints the icon badge: income / expense / primary. */
  icoIntent?: IcoIntent
  /** Delta text, e.g. "12,4 %". The ONLY place income/expense colour appears. */
  delta?: string
  deltaDir?: 'up' | 'down'
  sub?: ReactNode
  /** Larger treatment for the lead (e.g. total balance) card. */
  lead?: boolean
  className?: string
}

/**
 * KPI summary card, ported from handoff/components.jsx.
 * Rule: the value uses --text-primary (expenses are NOT red); only the
 * delta indicator is coloured by direction.
 */
export function SummaryCard({
  label,
  value,
  icoName,
  icoIntent,
  delta,
  deltaDir = 'up',
  sub,
  lead,
  className,
}: SummaryCardProps) {
  return (
    <div className={cn('mm-summary', lead ? 'lead' : 'compact', className)}>
      <div className="mm-summary-head">
        <span className="mm-summary-label">{label}</span>
        {icoName && (
          <span className={cn('mm-summary-ico', icoIntent)}>
            <Icon name={icoName} size={18} />
          </span>
        )}
      </div>
      <div className="mm-summary-value tnum">{value}</div>
      {delta && (
        <div className={cn('mm-summary-delta', deltaDir)}>
          <Icon
            name={deltaDir === 'down' ? 'arrow-down-right' : 'arrow-up-right'}
            size={14}
            strokeWidth={2.4}
          />
          <span className="tnum">{delta}</span>
        </div>
      )}
      {sub && <div className="mm-summary-sub">{sub}</div>}
    </div>
  )
}
