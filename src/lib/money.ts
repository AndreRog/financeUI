/**
 * pt-PT EUR formatting — the one hard rule of the design system.
 *
 *   1.234,56 €   (period thousands, comma decimal, space + trailing €)
 *
 * Always pair the output with the `.tnum` class (tabular numerals) so
 * decimals align. Ported verbatim from handoff/components.jsx.
 */
const mmEur = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Absolute value, formatted: `fmt(-1234.56)` → `"1.234,56 €"`. */
export function fmt(n: number): string {
  return mmEur.format(Math.abs(n)) + ' €';
}

/**
 * Signed, using the Unicode minus (U+2212 `−`), not a hyphen.
 * `fmtSigned(-1234.56)` → `"− 1.234,56 €"`, `fmtSigned(10)` → `"+ 10,00 €"`.
 */
export function fmtSigned(n: number): string {
  return (n < 0 ? '− ' : '+ ') + fmt(n);
}
