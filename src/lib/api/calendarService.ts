/**
 * Calendar data service.
 *
 * Server-side service that fetches calendar data (day-by-day status + pricing)
 * from the external booking system API.
 *
 * When BOOKING_API_URL is not configured or the /calendar endpoint doesn't
 * exist, returns null so the caller falls back to client-side mock data.
 *
 * This runs server-side only (in page.tsx or server components).
 */

import type { DayStatus } from "@/components/booking/types";
import { isApiConfigured, apiFetch, BookingApiError } from "./bookingApiClient";
import type { BookingApiCalendarResponse } from "./types";
import { apiCalendarToDayStatus } from "./types";

/**
 * Fetch calendar data from the booking system API.
 *
 * @param fromDate - Start of range (ISO "YYYY-MM-DD")
 * @param toDate   - End of range (ISO "YYYY-MM-DD")
 * @returns DayStatus[] if API is configured and responds, null otherwise
 */
export async function fetchCalendarData(
  fromDate: string,
  toDate: string,
): Promise<DayStatus[] | null> {
  if (!isApiConfigured()) return null;

  try {
    const params = new URLSearchParams({ from: fromDate, to: toDate });
    const response = await apiFetch<BookingApiCalendarResponse>(
      `/calendar?${params.toString()}`,
    );

    return response.days.map(apiCalendarToDayStatus);
  } catch (error) {
    // Silently fall back to mock data. The /calendar endpoint may not exist
    // yet on the booking system — this is expected during development.
    if (error instanceof BookingApiError && error.statusCode === 404) {
      // 404 is expected — endpoint not built yet
      return null;
    }
    if (error instanceof BookingApiError) {
      console.warn(
        "[api:calendar] Calendar endpoint unavailable, using mock data.",
        { status: error.statusCode },
      );
    }
    return null;
  }
}
