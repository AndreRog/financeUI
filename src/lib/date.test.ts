import { describe, it, expect } from 'vitest'
import { monthLabel } from './date'

describe('monthLabel', () => {
  it('returns month name only by default', () => {
    expect(monthLabel('2026-05')).toBe('May')
  })

  it('returns month and year when withYear is true', () => {
    expect(monthLabel('2026-05', true)).toBe('May 2026')
  })

  it('handles January correctly (month 1)', () => {
    expect(monthLabel('2026-01', true)).toBe('January 2026')
  })

  it('handles December correctly (month 12)', () => {
    expect(monthLabel('2025-12', true)).toBe('December 2025')
  })

  it('does not drift to the wrong month (UTC construction)', () => {
    // In any UTC+ timezone a naive `new Date("2026-05")` or `new Date(Date.UTC(…)-offset)`
    // would roll back to April. The UTC path must stay on May.
    for (const period of ['2026-01', '2026-06', '2026-12']) {
      const [, m] = period.split('-').map(Number)
      const label = monthLabel(period, true)
      // The month name must match what we expect from Date.UTC
      const expected = new Intl.DateTimeFormat('en-GB', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(2026, m - 1, 1)))
      expect(label).toBe(expected)
    }
  })
})
