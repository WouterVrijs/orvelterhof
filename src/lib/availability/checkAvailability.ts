/**
 * Core availability checking logic.
 *
 * Pure functions — no I/O, no side effects.
 * These can be used server-side or in tests without any infrastructure.
 */

import type { Booking, AvailabilityResult } from "./types";
import { BLOCKING_STATUSES } from "./types";

// ── Date validation ─────────────────────────────────────────────

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Check if a string is a valid ISO date that parses to a real date. */
export function isValidISODate(s: string): boolean {
  if (!ISO_DATE_RE.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

// ── Input validation ────────────────────────────────────────────

/**
 * Validate the raw inputs for an availability check.
 * Returns an AvailabilityResult with status "invalid_request" if invalid,
 * or null if inputs are valid.
 */
export function validateAvailabilityInput(
  arrivalDate: unknown,
  departureDate: unknown,
): AvailabilityResult | null {
  if (
    typeof arrivalDate !== "string" ||
    typeof departureDate !== "string"
  ) {
    return {
      status: "invalid_request",
      reason: "Aankomst- en vertrekdatum zijn verplicht.",
    };
  }

  if (!isValidISODate(arrivalDate)) {
    return {
      status: "invalid_request",
      reason: "Aankomstdatum is geen geldige datum.",
    };
  }

  if (!isValidISODate(departureDate)) {
    return {
      status: "invalid_request",
      reason: "Vertrekdatum is geen geldige datum.",
    };
  }

  if (arrivalDate >= departureDate) {
    return {
      status: "invalid_request",
      reason: "Vertrekdatum moet na aankomstdatum liggen.",
    };
  }

  return null; // valid
}

// ── Overlap logic ───────────────────────────────────────────────

/**
 * Check if two date ranges overlap.
 *
 * Both ranges are half-open intervals: [start, end).
 * This means a range "occupies" the nights from start up to (but not
 * including) end. Two ranges overlap if and only if:
 *
 *   rangeA.start < rangeB.end  AND  rangeA.end > rangeB.start
 *
 * Boundary rule: if rangeA.start === rangeB.end, there is NO overlap.
 * This allows back-to-back bookings where one guest checks out and
 * another checks in on the same day.
 */
export function hasOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  return startA < endB && endA > startB;
}

// ── Main check ──────────────────────────────────────────────────

/**
 * Check whether a requested period is available given a list of
 * existing bookings.
 *
 * Only bookings with a blocking status ("confirmed", "reserved",
 * "blocked") are considered conflicts. Cancelled or expired bookings
 * are ignored.
 *
 * @param arrivalDate   - ISO date string, check-in day
 * @param departureDate - ISO date string, check-out day
 * @param bookings      - all bookings that might conflict
 */
export function checkAvailability(
  arrivalDate: string,
  departureDate: string,
  bookings: Booking[],
): AvailabilityResult {
  // 1. Validate input
  const validationError = validateAvailabilityInput(arrivalDate, departureDate);
  if (validationError) return validationError;

  // 2. Find conflicts
  const blockingSet = new Set<string>(BLOCKING_STATUSES);
  const conflictIds: string[] = [];

  for (const booking of bookings) {
    // Skip non-blocking statuses
    if (!blockingSet.has(booking.status)) continue;

    // Check overlap
    if (hasOverlap(arrivalDate, departureDate, booking.startDate, booking.endDate)) {
      conflictIds.push(booking.id);
    }
  }

  // 3. Return result
  if (conflictIds.length > 0) {
    return {
      status: "unavailable",
      reason: "De gekozen periode is niet beschikbaar. Er is overlap met een bestaande reservering.",
      conflictIds,
    };
  }

  return { status: "available" };
}
