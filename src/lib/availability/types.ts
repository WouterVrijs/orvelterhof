/**
 * Domain types for the availability checking system.
 *
 * These types model bookings and blocked periods at the reservation level
 * (not day-by-day). They are the canonical data model for server-side
 * availability decisions.
 */

// ── Booking statuses ────────────────────────────────────────────

/**
 * Statuses that block availability — a new booking cannot overlap
 * with any reservation that has one of these statuses.
 */
export type BlockingStatus = "confirmed" | "reserved" | "blocked";

/**
 * Non-blocking statuses — these do NOT prevent new bookings.
 */
export type NonBlockingStatus = "cancelled" | "expired";

export type BookingStatus = BlockingStatus | NonBlockingStatus;

/** All statuses that count as "occupied" for overlap checking. */
export const BLOCKING_STATUSES: readonly BlockingStatus[] = [
  "confirmed",
  "reserved",
  "blocked",
] as const;

// ── Booking model ───────────────────────────────────────────────

/**
 * A single booking or blocked period.
 *
 * Date semantics:
 * - startDate: the check-in day (first overnight stay)
 * - endDate:   the check-out day (departure, no overnight)
 * - A booking occupies the nights [startDate, endDate).
 *   That is: a booking from "2026-06-01" to "2026-06-04" covers
 *   the nights of June 1, 2, and 3 (3 nights).
 *
 * Boundary rule:
 * - A new booking MAY start on the endDate of an existing booking.
 *   (Guest A checks out in the morning, Guest B checks in that afternoon.)
 */
export interface Booking {
  id: string;
  startDate: string; // ISO "YYYY-MM-DD"
  endDate: string;   // ISO "YYYY-MM-DD"
  status: BookingStatus;
  /** Optional label for admin/debugging. */
  label?: string;
}

// ── Availability check result ───────────────────────────────────

export type AvailabilityStatus =
  | "available"
  | "unavailable"
  | "invalid_request"
  | "error";

export interface AvailabilityResult {
  status: AvailabilityStatus;
  /** Human-readable reason (Dutch), present when not available. */
  reason?: string;
  /**
   * Conflicting booking IDs, if any.
   * Only used server-side for logging/debugging — never exposed to the frontend.
   */
  conflictIds?: string[];
}

// ── Frontend status machine ─────────────────────────────────────

/**
 * Status of the availability check as seen by the frontend.
 * This drives the UI state.
 */
export type AvailabilityCheckStatus =
  | "idle"        // no check performed yet
  | "checking"    // check in progress
  | "available"   // period is available
  | "unavailable" // period conflicts with existing bookings
  | "invalid"     // request was invalid (bad dates, etc.)
  | "error";      // network or server error
