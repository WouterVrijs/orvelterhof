/**
 * Availability service — abstraction layer between UI and data source.
 *
 * Currently backed by mock data. When a real backend is connected,
 * replace the implementation of `fetchAvailability` and `validateRange`
 * without changing any UI code.
 */

import type { DayStatus, SelectedRange } from "./types";
import { dateRange } from "./dateUtils";

// ── Types ──────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  /** Human-readable reason when invalid. */
  reason?: string;
}

// ── Service ────────────────────────────────────────────────────

/**
 * Validate a selected range against the availability data.
 *
 * This is the "final validation" that runs before the user proceeds
 * to the next step. It re-checks the full range against the source
 * data to guard against race conditions or stale UI state.
 *
 * When a backend exists, this should make a server call instead of
 * checking the local statusMap.
 */
export function validateRange(
  selection: SelectedRange,
  statusMap: Map<string, DayStatus>,
  minNights: number,
): ValidationResult {
  if (!selection.checkIn || !selection.checkOut) {
    return { valid: false, reason: "Selecteer een aankomst- en vertrekdatum." };
  }

  // Check minimum nights
  const dates = dateRange(selection.checkIn, selection.checkOut);
  const nights = dates.length - 1;
  if (nights < minNights) {
    return {
      valid: false,
      reason: `Minimaal ${minNights} nachten vereist.`,
    };
  }

  // Check that check-in date is bookable (available, discount, or departure)
  const checkInInfo = statusMap.get(selection.checkIn);
  if (!checkInInfo || checkInInfo.status === "booked") {
    return {
      valid: false,
      reason: "De aankomstdatum is niet meer beschikbaar.",
    };
  }

  // Check that check-out date exists in data
  const checkOutInfo = statusMap.get(selection.checkOut);
  if (!checkOutInfo) {
    return {
      valid: false,
      reason: "De vertrekdatum valt buiten de boekbare periode.",
    };
  }

  // Check all intermediate days (between check-in and check-out, exclusive)
  // These must NOT be "booked". Departure days within a range are acceptable
  // because they represent the end of another booking — the night before
  // that day is occupied, but the day itself is available for new arrivals.
  for (let i = 1; i < dates.length - 1; i++) {
    const info = statusMap.get(dates[i]);
    if (!info || info.status === "booked") {
      return {
        valid: false,
        reason:
          "Er zit een bezette datum in uw geselecteerde periode. De beschikbaarheid is mogelijk gewijzigd.",
      };
    }
  }

  return { valid: true };
}

/**
 * Find the first booked date after a given check-in date.
 *
 * Used to determine the maximum selectable check-out date:
 * the user cannot select a range that crosses a booked day.
 * Returns null if no booked date exists within the horizon.
 */
export function findFirstBookedAfter(
  checkIn: string,
  statusMap: Map<string, DayStatus>,
  horizonEnd: string,
): string | null {
  const dates = dateRange(checkIn, horizonEnd);
  // Skip the check-in date itself (index 0)
  for (let i = 1; i < dates.length; i++) {
    const info = statusMap.get(dates[i]);
    if (info && info.status === "booked") {
      return dates[i];
    }
  }
  return null;
}
