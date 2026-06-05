type CategoryEntry = { display: string; color: string }

const REGISTRY = new Map<string, CategoryEntry>([
  ['HOUSING',              { display: 'Housing',              color: 'var(--cat-housing)' }],
  ['FOOD & DINING',        { display: 'Food & Dining',        color: 'var(--cat-food)' }],
  ['TRANSPORT',            { display: 'Transport',            color: 'var(--cat-transport)' }],
  ['HEALTH',               { display: 'Health',               color: 'var(--cat-health)' }],
  ['SUBSCRIPTIONS',        { display: 'Subscriptions',        color: 'var(--cat-subscriptions)' }],
  ['TRAVEL',               { display: 'Travel',               color: 'var(--cat-travel)' }],
  ['ENTERTAINMENT',        { display: 'Entertainment',        color: 'var(--cat-entertainment)' }],
  ['MISCELLANEOUS',        { display: 'Miscellaneous',        color: 'var(--cat-other)' }],
  ['INCOME',               { display: 'Income',               color: 'var(--income)' }],
  ['SAVINGS & INVESTMENTS',{ display: 'Savings & Investments',color: 'var(--cat-savings)' }],
  ['TRANSFERS',            { display: 'Transfers',            color: 'var(--excluded)' }],
])

function key(raw: string): string {
  return raw.trim().toUpperCase()
}

/** "FOOD & DINING" → "Food & Dining". Idempotent on already-display labels. */
export function normaliseLabel(raw: string): string {
  return REGISTRY.get(key(raw))?.display ?? raw
}

/** CSS colour var for the given category. Accepts ALL-CAPS or display form. */
export function catColor(label: string): string {
  return REGISTRY.get(key(label))?.color ?? 'var(--cat-other)'
}

/** True for all 11 known backend Category names (either form). */
export function isKnown(label: string): boolean {
  return REGISTRY.has(key(label))
}
