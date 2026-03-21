/**
 * API request/response types for the external booking system.
 *
 * These types represent the wire format — what the API sends and receives.
 * Mapping functions convert between API types and domain types used
 * internally by the website.
 */

import type { Booking, BookingStatus } from "@/lib/availability/types";
import type { DayStatus } from "@/components/booking/types";

// ── GET /bookings response ───────────────────────────────────────

export interface BookingApiBooking {
  id: string;
  startDate: string;  // "YYYY-MM-DD"
  endDate: string;    // "YYYY-MM-DD"
  status: string;     // "confirmed" | "reserved" | etc. — string to handle unknown values
  label?: string;
}

export interface BookingApiBookingsResponse {
  bookings: BookingApiBooking[];
}

// ── GET /calendar response ───────────────────────────────────────

export interface BookingApiCalendarDay {
  date: string;       // "YYYY-MM-DD"
  status: string;     // "available" | "booked" | etc.
  price?: number;
}

export interface BookingApiCalendarResponse {
  days: BookingApiCalendarDay[];
}

// ── POST /bookings ───────────────────────────────────────────────

export interface BookingApiSubmitRequest {
  checkIn: string;
  checkOut: string;
  guests: number;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    postalCode: string;
    city: string;
    organisation?: string;
    remarks?: string;
  };
  upgrades: string[];
}

export interface BookingApiSubmitResponse {
  status: "success" | "unavailable" | "error";
  bookingReference?: string;
  message?: string;
}

// ── Mapping functions ────────────────────────────────────────────

const VALID_BOOKING_STATUSES: Set<string> = new Set([
  "confirmed", "reserved", "blocked", "cancelled", "expired",
]);

/**
 * Map an API booking to the domain Booking type.
 * Unknown statuses are mapped to "blocked" (safe default — blocks availability).
 */
export function apiBookingToDomain(apiBooking: BookingApiBooking): Booking {
  const status: BookingStatus = VALID_BOOKING_STATUSES.has(apiBooking.status)
    ? (apiBooking.status as BookingStatus)
    : "blocked"; // Safe default: unknown status blocks availability

  return {
    id: apiBooking.id,
    startDate: apiBooking.startDate,
    endDate: apiBooking.endDate,
    status,
    label: apiBooking.label,
  };
}

const VALID_DAY_STATUSES: Set<string> = new Set([
  "available", "booked", "arrival", "departure", "discount",
]);

/**
 * Map an API calendar day to the domain DayStatus type.
 * Unknown statuses are mapped to "available" (safe default for calendar display).
 */
export function apiCalendarToDayStatus(apiDay: BookingApiCalendarDay): DayStatus {
  const status = VALID_DAY_STATUSES.has(apiDay.status)
    ? (apiDay.status as DayStatus["status"])
    : "available";

  return {
    date: apiDay.date,
    status,
    price: apiDay.price,
  };
}
