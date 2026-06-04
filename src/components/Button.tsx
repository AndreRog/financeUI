import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Optional leading icon from the MoneyMind icon set. */
  icon?: IconName
  block?: boolean
}

/**
 * Ported from handoff/components.jsx. Renders the .mm-btn classes
 * (defined in moneymind.css) — focus is the 3px teal glow, never an outline.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'mm-btn',
        `mm-btn-${variant}`,
        size === 'sm' && 'mm-btn-sm',
        size === 'lg' && 'mm-btn-lg',
        block && 'mm-btn-block',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
    </button>
  )
}
