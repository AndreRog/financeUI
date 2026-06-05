import type { ButtonHTMLAttributes } from 'react'
import { catColor, isKnown } from '@/lib/categories'
import { cn } from '@/lib/cn'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  active?: boolean
}

/**
 * Category filter chip, ported from handoff/components.jsx. Shows an 8px
 * coloured dot when the label maps to a known category.
 */
export function Chip({ label, active, className, ...rest }: ChipProps) {
  const known = isKnown(label)
  return (
    <button className={cn('mm-chip', active && 'active', className)} {...rest}>
      {known && <span className="mm-chip-dot" style={{ background: catColor(label) }} />}
      {label}
    </button>
  )
}
