/**
 * Date helpers. The design system labels recent days relatively
 * ("Today · 31 May", "Yesterday · 30 May") and older ones absolutely
 * ("28 May"). Day/month in English short form per the handoff samples.
 */

const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** "Today · 31 May" / "Yesterday · 30 May" / "28 May". */
export function relativeDayLabel(date: Date | string, now: Date = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000);
  const dm = dayMonth.format(d);
  if (diffDays === 0) return `Today · ${dm}`;
  if (diffDays === 1) return `Yesterday · ${dm}`;
  return dm;
}

/** "May 2026" — used for period pickers and trend axes. */
export function monthLabel(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return monthYear.format(d);
}

/** "31 May" — bare day + month. */
export function shortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return dayMonth.format(d);
}
