/**
 * Booking data access layer.
 *
 * Dual-mode: uses the external booking system API when BOOKING_API_URL
 * is configured, falls back to mock data for local development.
 *
 * The public interface (getBookingsInRange) stays identical regardless
 * of the data source — consumers don't need to know where data comes from.
 */

import type { Booking } from "./types";
import { isApiConfigured, apiFetch, BookingApiError } from "@/lib/api/bookingApiClient";
import type { BookingApiBookingsResponse } from "@/lib/api/types";
import { apiBookingToDomain } from "@/lib/api/types";

// ── Public API ──────────────────────────────────────────────────

/**
 * Get all bookings that could potentially overlap with the given range.
 *
 * When BOOKING_API_URL is configured: fetches from the external booking system.
 * When not configured: returns mock data (for local development).
 */
export async function getBookingsInRange(
  startDate: string,
  endDate: string,
): Promise<Booking[]> {
  if (isApiConfigured()) {
    return getBookingsFromApi(startDate, endDate);
  }
  return getBookingsFromMock(startDate, endDate);
}

// ── API implementation ──────────────────────────────────────────

async function getBookingsFromApi(
  startDate: string,
  endDate: string,
): Promise<Booking[]> {
  try {
    const params = new URLSearchParams({ from: startDate, to: endDate });
    const response = await apiFetch<BookingApiBookingsResponse>(
      `?${params.toString()}`,
    );

    return response.bookings.map(apiBookingToDomain);
  } catch (error) {
    if (error instanceof BookingApiError) {
      console.error(
        "[availability:repo] Failed to fetch bookings from API:",
        { startDate, endDate, message: error.message, status: error.statusCode },
      );
    }
    // Re-throw — the caller (actions.ts) handles errors gracefully
    throw error;
  }
}

// ── Mock implementation ─────────────────────────────────────────

/**
 * Generate mock bookings matching the patterns in mockData.ts.
 *
 * This ensures that what the calendar shows as "booked" matches
 * what the availability checker considers occupied.
 */
function generateMockBookings(): Booking[] {
  const bookings: Booking[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setMonth(end.getMonth() + 12);

  // ── Speciale arrangementen (reeds verhuurd) ─────────────────
  const specialRanges: { start: Date; end: Date; label: string }[] = [
    {
      start: new Date(2026, 3, 3),
      end: new Date(2026, 3, 7),
      label: "Pasen 2026",
    },
    {
      start: new Date(2026, 4, 13),
      end: new Date(2026, 4, 18),
      label: "Hemelvaart 2026",
    },
    {
      start: new Date(2026, 5, 22),
      end: new Date(2026, 5, 26),
      label: "Pinksteren 2026",
    },
  ];

  for (const { start, end: finish, label } of specialRanges) {
    bookings.push({
      id: `special-${label.toLowerCase().replace(/\s+/g, "-")}`,
      startDate: formatDate(start),
      endDate: formatDate(finish),
      status: "confirmed",
      label,
    });
  }

  // ── Regulier geboekte weekenden (~70%) ──────────────────────
  const current = new Date(today);
  let weekendCount = 0;
  while (current <= end) {
    if (current.getDay() === 5) {
      weekendCount++;
      if (
        weekendCount % 10 !== 3 &&
        weekendCount % 10 !== 7 &&
        weekendCount % 10 !== 0
      ) {
        const checkOut = new Date(current);
        checkOut.setDate(checkOut.getDate() + 3);
        bookings.push({
          id: `weekend-${weekendCount}`,
          startDate: formatDate(current),
          endDate: formatDate(checkOut),
          status: "confirmed",
          label: `Weekend ${weekendCount}`,
        });
      }
    }
    current.setDate(current.getDate() + 1);
  }

  // ── Regulier geboekte midweken (~30%) ───────────────────────
  const mw = new Date(today);
  let midweekCount = 0;
  while (mw <= end) {
    if (mw.getDay() === 1) {
      midweekCount++;
      if (
        midweekCount % 10 === 2 ||
        midweekCount % 10 === 5 ||
        midweekCount % 10 === 8
      ) {
        const checkOut = new Date(mw);
        checkOut.setDate(checkOut.getDate() + 5);
        bookings.push({
          id: `midweek-${midweekCount}`,
          startDate: formatDate(mw),
          endDate: formatDate(checkOut),
          status: "confirmed",
          label: `Midweek ${midweekCount}`,
        });
      }
    }
    mw.setDate(mw.getDate() + 1);
  }

  return bookings;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Cached mock data (generated once per process) ───────────────

let cachedBookings: Booking[] | null = null;

function getMockBookings(): Booking[] {
  if (!cachedBookings) {
    cachedBookings = generateMockBookings();
  }
  return cachedBookings;
}

function getBookingsFromMock(
  startDate: string,
  endDate: string,
): Booking[] {
  const all = getMockBookings();
  return all.filter(
    (b) => b.startDate < endDate && b.endDate > startDate,
  );
}
