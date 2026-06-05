import { describe, it, expect } from 'vitest'
import { normaliseLabel, catColor, isKnown } from './categories'

describe('normaliseLabel', () => {
  it('converts ALL-CAPS name to display label', () => {
    expect(normaliseLabel('FOOD & DINING')).toBe('Food & Dining')
  })

  it('is idempotent on already-display labels', () => {
    expect(normaliseLabel('Food & Dining')).toBe('Food & Dining')
  })

  it('preserves ampersand', () => {
    expect(normaliseLabel('SAVINGS & INVESTMENTS')).toBe('Savings & Investments')
  })

  it('returns input unchanged for unknown labels', () => {
    expect(normaliseLabel('Unknown Category')).toBe('Unknown Category')
  })

  it('handles all 11 known categories', () => {
    const cases: [string, string][] = [
      ['HOUSING', 'Housing'],
      ['FOOD & DINING', 'Food & Dining'],
      ['TRANSPORT', 'Transport'],
      ['HEALTH', 'Health'],
      ['SUBSCRIPTIONS', 'Subscriptions'],
      ['TRAVEL', 'Travel'],
      ['ENTERTAINMENT', 'Entertainment'],
      ['MISCELLANEOUS', 'Miscellaneous'],
      ['INCOME', 'Income'],
      ['SAVINGS & INVESTMENTS', 'Savings & Investments'],
      ['TRANSFERS', 'Transfers'],
    ]
    for (const [input, expected] of cases) {
      expect(normaliseLabel(input)).toBe(expected)
    }
  })
})

describe('catColor', () => {
  it('returns the same CSS var for ALL-CAPS and display form', () => {
    expect(catColor('FOOD & DINING')).toBe(catColor('Food & Dining'))
  })

  it('returns var(--cat-food) for FOOD & DINING', () => {
    expect(catColor('FOOD & DINING')).toBe('var(--cat-food)')
  })

  it('returns var(--cat-other) for an unmapped label', () => {
    expect(catColor('UNKNOWN')).toBe('var(--cat-other)')
    expect(catColor('whatever')).toBe('var(--cat-other)')
  })

  it('returns var(--income) for INCOME', () => {
    expect(catColor('INCOME')).toBe('var(--income)')
  })

  it('returns var(--excluded) for TRANSFERS', () => {
    expect(catColor('TRANSFERS')).toBe('var(--excluded)')
  })

  it('returns var(--cat-savings) for SAVINGS & INVESTMENTS', () => {
    expect(catColor('SAVINGS & INVESTMENTS')).toBe('var(--cat-savings)')
  })
})

describe('isKnown', () => {
  it('returns true for all 11 known categories (ALL-CAPS)', () => {
    const known = [
      'HOUSING', 'FOOD & DINING', 'TRANSPORT', 'HEALTH', 'SUBSCRIPTIONS',
      'TRAVEL', 'ENTERTAINMENT', 'MISCELLANEOUS', 'INCOME',
      'SAVINGS & INVESTMENTS', 'TRANSFERS',
    ]
    for (const label of known) {
      expect(isKnown(label)).toBe(true)
    }
  })

  it('returns true for display-form labels', () => {
    expect(isKnown('Housing')).toBe(true)
    expect(isKnown('Food & Dining')).toBe(true)
    expect(isKnown('Savings & Investments')).toBe(true)
  })

  it('returns false for unknown labels', () => {
    expect(isKnown('Groceries')).toBe(false)
    expect(isKnown('Leisure')).toBe(false)
    expect(isKnown('')).toBe(false)
  })
})
