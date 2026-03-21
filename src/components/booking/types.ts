/**
 * Core types for the booking module.
 */

// ── Data types (from backend / mock) ──────────────────────────

export interface DayStatus {
  date: string; // "2026-06-01"
  status: "available" | "booked" | "arrival" | "departure" | "discount";
  price?: number; // base price per night
}

export interface SelectedRange {
  checkIn: string | null;
  checkOut: string | null;
}

// ── UI types ──────────────────────────────────────────────────

export type SelectionPhase = "selectCheckIn" | "selectCheckOut" | "complete";

/**
 * Resolved render status for a single calendar day.
 *
 * This is the single source of truth that CalendarDay uses to decide
 * its visual appearance. It is computed centrally in useBookingState
 * so that presentation logic never has to re-derive selectability.
 */
export type DayRenderStatus =
  | "available"       // can be selected
  | "discount"        // available with discount — visually highlighted
  | "occupied"        // booked by another guest — not selectable
  | "past"            // before today — not selectable
  | "outside_horizon" // beyond the booking horizon — not selectable
  | "no_data"         // no availability data for this date
  | "blocked_for_checkout"; // available in general, but unreachable as checkout from the current check-in
