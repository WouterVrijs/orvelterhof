"use server";

/**
 * Server Actions for availability checking.
 *
 * These are the authoritative availability checks — the backend is the
 * source of truth. The frontend may do optimistic pre-checks (via the
 * calendar statusMap), but these server actions have the final word.
 *
 * Security guarantees:
 * - All input is validated server-side before processing
 * - Internal data (conflictIds) is never exposed to the frontend
 * - Unexpected errors return a controlled "error" status, never raw stack traces
 * - All failures are logged server-side for debugging
 */

import type { AvailabilityResult } from "./types";
import { checkAvailability, validateAvailabilityInput } from "./checkAvailability";
import { getBookingsInRange } from "./bookingRepository";

/**
 * Strip internal fields from the result before sending to the frontend.
 * conflictIds are useful for server-side debugging but should not be
 * exposed to end users.
 */
function toClientResult(result: AvailabilityResult): AvailabilityResult {
  const { conflictIds: _, ...clientSafe } = result;
  return clientSafe;
}

/**
 * Check whether Orvelterhof is available for the given period.
 *
 * This is the primary availability check, called automatically when the
 * user selects dates. Results are informational — the definitive check
 * happens at confirm time via `confirmAvailabilityAction`.
 *
 * @param arrivalDate   - ISO date string "YYYY-MM-DD" (check-in day)
 * @param departureDate - ISO date string "YYYY-MM-DD" (check-out day)
 * @returns AvailabilityResult with status and optional reason (no internal IDs)
 */
export async function checkAvailabilityAction(
  arrivalDate: string,
  departureDate: string,
): Promise<AvailabilityResult> {
  try {
    // 1. Validate input server-side (rejects invalid/manipulated requests)
    const validationError = validateAvailabilityInput(arrivalDate, departureDate);
    if (validationError) {
      console.warn(
        "[availability] Invalid request:",
        { arrivalDate, departureDate, reason: validationError.reason },
      );
      return toClientResult(validationError);
    }

    // 2. Fetch potentially conflicting bookings
    const bookings = await getBookingsInRange(arrivalDate, departureDate);

    // 3. Check availability against bookings
    const result = checkAvailability(arrivalDate, departureDate, bookings);

    if (result.status === "unavailable") {
      console.info(
        "[availability] Period unavailable:",
        { arrivalDate, departureDate, conflicts: result.conflictIds?.length ?? 0 },
      );
    }

    return toClientResult(result);
  } catch (error) {
    // Log the full error server-side, return a controlled response to the client
    console.error("[availability] Unexpected error during availability check:", error);
    return {
      status: "error",
      reason: "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.",
    };
  }
}

/**
 * Definitive availability re-check at confirm time.
 *
 * Called when the user clicks "Ga verder met boeken". This is the final
 * gate before proceeding to the next step in the booking flow.
 *
 * This action performs the exact same validation as checkAvailabilityAction
 * but represents a different moment in the flow: the user is about to
 * commit. We re-check because availability may have changed since the
 * initial (informational) check.
 *
 * @param arrivalDate   - ISO date string "YYYY-MM-DD" (check-in day)
 * @param departureDate - ISO date string "YYYY-MM-DD" (check-out day)
 * @returns AvailabilityResult — if status !== "available", the user must not proceed
 */
export async function confirmAvailabilityAction(
  arrivalDate: string,
  departureDate: string,
): Promise<AvailabilityResult> {
  try {
    // 1. Validate input
    const validationError = validateAvailabilityInput(arrivalDate, departureDate);
    if (validationError) {
      console.warn(
        "[availability:confirm] Invalid request at confirm:",
        { arrivalDate, departureDate, reason: validationError.reason },
      );
      return toClientResult(validationError);
    }

    // 2. Fetch fresh booking data (not cached from earlier check)
    const bookings = await getBookingsInRange(arrivalDate, departureDate);

    // 3. Definitive availability check
    const result = checkAvailability(arrivalDate, departureDate, bookings);

    if (result.status === "unavailable") {
      console.info(
        "[availability:confirm] Period no longer available at confirm:",
        { arrivalDate, departureDate, conflicts: result.conflictIds?.length ?? 0 },
      );
    }

    return toClientResult(result);
  } catch (error) {
    console.error(
      "[availability:confirm] Unexpected error during confirm check:",
      error,
    );
    return {
      status: "error",
      reason: "Er is een onverwachte fout opgetreden bij het bevestigen. Probeer het opnieuw.",
    };
  }
}
