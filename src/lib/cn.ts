import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names, resolving Tailwind conflicts (shadcn convention).
 * shadcn's components.json `utils` alias points here (`@/lib/cn`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
