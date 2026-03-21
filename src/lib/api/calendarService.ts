/**
 * Calendar data service.
 *
 * Fetches bookings from the external booking system via GET /bookings
 * and converts them into day-by-day calendar status for the frontend.
 *
 * When BOOKING_API_URL is not configured, returns null so the caller
 * falls back to client-side mock data.
 */

import type { DayStatus } from "@/components/booking/types";
import { isApiConfigured, apiFetch, BookingApiError } from "./bookingApiClient";
import type { BookingApiBookingsResponse } from "./types";
import { bookingConfig } from "@/components/booking/bookingConfig";

/**
 * Fetch calendar data by converting bookings into day statuses.
 *
 * Uses GET /bookings (the only available endpoint) and generates
 * day-by-day availability from the booking ranges.
 */
export async function fetchCalendarData(
  fromDate: string,
  toDate: string | Date,
): Promise<DayStatus[] | null> {
  if (!isApiConfigured()) return null;

  const toStr = typeof toDate === "string"
    ? toDate
    : toDate.toISOString().split("T")[0];

  try {
    const params = new URLSearchParams({ from: fromDate, to: toStr });
    const response = await apiFetch<BookingApiBookingsResponse>(
      `/bookings?${params.toString()}`,
    );

    return bookingsToDayStatuses(fromDate, toStr, response.bookings);
  } catch (error) {
    if (error instanceof BookingApiError) {
      console.warn(
        "[api:calendar] Could not fetch bookings, using mock data.",
        { status: error.statusCode, message: error.message },
      );
    }
    return null;
  }
}

/**
 * Convert booking ranges into day-by-day statuses.
 *
 * Days that fall within a confirmed/blocked booking are marked "booked".
 * All other days are "available" with a default price.
 */
function bookingsToDayStatuses(
  fromDate: string,
  toDate: string,
  bookings: BookingApiBookingsResponse["bookings"],
): DayStatus[] {
  // Build a set of all booked dates
  const bookedDates = new Set<string>();
  for (const booking of bookings) {
    if (booking.status !== "confirmed" && booking.status !== "blocked") continue;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const current = new Date(start);
    while (current < end) {
      bookedDates.add(formatDate(current));
      current.setDate(current.getDate() + 1);
    }
  }

  // Generate day-by-day statuses
  const days: DayStatus[] = [];
  const current = new Date(fromDate);
  const end = new Date(toDate);

  while (current <= end) {
    const dateStr = formatDate(current);
    const dayOfWeek = current.getDay(); // 0=Sun, 5=Fri
    const isBooked = bookedDates.has(dateStr);

    // Determine price based on day of week (weekend vs weekday)
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Fri, Sat
    const price = isWeekend
      ? bookingConfig.weekendPricePerNight
      : bookingConfig.midweekPricePerNight;

    days.push({
      date: dateStr,
      status: isBooked ? "booked" : "available",
      price: isBooked ? undefined : price,
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
