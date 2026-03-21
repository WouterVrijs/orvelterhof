/**
 * Central booking configuration.
 *
 * All business rules that affect date selection, validation, and display
 * are defined here so they can be changed in one place.
 *
 * When a backend is connected, some of these values may come from an API
 * response instead. The config shape stays the same — only the source changes.
 */

export const bookingConfig = {
  /** Minimum number of nights per booking. */
  minNights: 2,

  /** Maximum number of nights per booking (0 = unlimited). */
  maxNights: 0,

  /** How many months into the future the calendar shows / allows booking. */
  horizonMonths: 12,

  /** Maximum number of guests. */
  maxGuests: 36,

  /** Minimum number of guests. */
  minGuests: 2,

  // ── Prijzen per nacht ─────────────────────────────────────

  /** Prijs per nacht op vrijdag en zaterdag. */
  weekendPricePerNight: 650,

  /** Prijs per nacht op ma-do en zo. */
  midweekPricePerNight: 625,

  // ── Bijkomende kosten ──────────────────────────────────────

  /** Eindschoonmaak — vast bedrag per boeking. */
  cleaningFee: 425,

  /** Bedlinnen (incl. opmaken) — per persoon, eenmalig. */
  linenPerPerson: 14.5,

  /** Energie — per persoon per nacht. */
  energyPerPersonPerNight: 3.95,

  /** Gemeentelijke heffingen — per persoon per nacht. */
  taxPerPersonPerNight: 2.95,
} as const;

export type BookingConfig = typeof bookingConfig;
