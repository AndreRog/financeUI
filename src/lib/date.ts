/**
 * Date helpers. The design system labels recent days relatively
 * ("Today · 31 May", "Yesterday · 30 May") and older ones absolutely
 * ("28 May"). Day/month in English short form per the handoff samples.
 */

const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

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

/** "May" / "May 2026" from a period string "YYYY-MM". Uses UTC to avoid off-by-one in UTC+ zones. */
export function monthLabel(period: string, withYear = false): string {
  const [y, m] = period.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: withYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, 1)))
}

/** "31 May" — bare day + month. */
export function shortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return dayMonth.format(d);
}
