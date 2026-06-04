/**
 * Category → dot colour. The first six are verbatim from handoff/components.jsx;
 * the rest use the added --cat-* tokens (see tokens.css — names provisional until
 * the backend seed set lands, PRD 0001 / issue 0007). Lookups fall back to
 * --cat-other so an unmapped category still renders a dot.
 */
export const CAT_COLOR: Record<string, string> = {
  Groceries: 'var(--cat-groceries)',
  Transport: 'var(--cat-transport)',
  Dining: 'var(--cat-dining)',
  'Bills & utilities': 'var(--cat-bills)',
  Shopping: 'var(--cat-shopping)',
  Income: 'var(--income)',
  // + added categories (provisional)
  Housing: 'var(--cat-housing)',
  Health: 'var(--cat-health)',
  Leisure: 'var(--cat-leisure)',
  Education: 'var(--cat-education)',
  'Fees & charges': 'var(--cat-fees)',
  Savings: 'var(--cat-savings)',
  Other: 'var(--cat-other)',
}

export function catColor(label: string): string {
  return CAT_COLOR[label] ?? 'var(--cat-other)'
}
