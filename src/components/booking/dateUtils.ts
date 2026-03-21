/**
 * Pure date utility functions for the booking module.
 *
 * All functions work with ISO date strings ("YYYY-MM-DD") to avoid
 * timezone issues. No Date objects leak out of this module.
 */

/** Parse an ISO string into a local-midnight Date. */
export function toDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Format a Date as ISO string. */
export function formatISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Today as ISO string (cached per call — safe within a single render). */
export function todayISO(): string {
  return formatISO(new Date());
}

/** Number of calendar days between two ISO dates (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86_400_000);
}

/** Inclusive array of ISO date strings from start to end. */
export function dateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = toDate(start);
  const last = toDate(end);
  while (current <= last) {
    dates.push(formatISO(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** Add N months to a Date, returning a new ISO string. */
export function addMonths(base: Date, n: number): string {
  const d = new Date(base);
  d.setMonth(d.getMonth() + n);
  return formatISO(d);
}

/**
 * Number of stay nights for a check-in / check-out pair.
 *
 * Business rule: check-in day is the first overnight stay,
 * check-out day is the departure day (no overnight).
 * Nights = calendar-day difference between the two dates.
 *
 * Returns 0 when either date is missing or checkout <= checkin.
 */
export function getNightCount(
  checkIn: string | null | undefined,
  checkOut: string | null | undefined,
): number {
  if (!checkIn || !checkOut) return 0;
  const n = daysBetween(checkIn, checkOut);
  return n > 0 ? n : 0;
}

/**
 * Human-readable Dutch label for a night count.
 *
 * Examples: "1 nacht", "3 nachten", "" (when 0).
 */
export function formatNightCountLabel(nights: number): string {
  if (nights <= 0) return "";
  return nights === 1 ? "1 nacht" : `${nights} nachten`;
}

/** Format for display (e.g. "za 14 mrt. 2026"). */
export function formatDisplayDate(dateStr: string | null): string {
  if (!dateStr) return "\u2014";
  const d = toDate(dateStr);
  return d.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
