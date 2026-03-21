import { describe, it, expect } from "vitest";
import {
  isValidISODate,
  validateAvailabilityInput,
  hasOverlap,
  checkAvailability,
} from "../checkAvailability";
import type { Booking } from "../types";

// ── Helper ──────────────────────────────────────────────────────

function booking(
  id: string,
  startDate: string,
  endDate: string,
  status: Booking["status"] = "confirmed",
): Booking {
  return { id, startDate, endDate, status };
}

// ── isValidISODate ──────────────────────────────────────────────

describe("isValidISODate", () => {
  it("accepts valid dates", () => {
    expect(isValidISODate("2026-06-15")).toBe(true);
    expect(isValidISODate("2024-02-29")).toBe(true); // leap year
    expect(isValidISODate("2026-01-01")).toBe(true);
    expect(isValidISODate("2026-12-31")).toBe(true);
  });

  it("rejects invalid formats", () => {
    expect(isValidISODate("2026/06/15")).toBe(false);
    expect(isValidISODate("15-06-2026")).toBe(false);
    expect(isValidISODate("not-a-date")).toBe(false);
    expect(isValidISODate("")).toBe(false);
    expect(isValidISODate("2026-6-15")).toBe(false); // no padding
  });

  it("rejects impossible dates", () => {
    expect(isValidISODate("2026-02-29")).toBe(false); // not a leap year
    expect(isValidISODate("2026-13-01")).toBe(false); // month 13
    expect(isValidISODate("2026-04-31")).toBe(false); // april has 30 days
  });
});

// ── validateAvailabilityInput ───────────────────────────────────

describe("validateAvailabilityInput", () => {
  it("returns null for valid input", () => {
    expect(validateAvailabilityInput("2026-06-01", "2026-06-05")).toBeNull();
  });

  it("rejects non-string input", () => {
    const r1 = validateAvailabilityInput(null, "2026-06-05");
    expect(r1?.status).toBe("invalid_request");

    const r2 = validateAvailabilityInput("2026-06-01", undefined);
    expect(r2?.status).toBe("invalid_request");

    const r3 = validateAvailabilityInput(123, 456);
    expect(r3?.status).toBe("invalid_request");
  });

  it("rejects invalid date strings", () => {
    const r1 = validateAvailabilityInput("not-a-date", "2026-06-05");
    expect(r1?.status).toBe("invalid_request");
    expect(r1?.reason).toContain("Aankomstdatum");

    const r2 = validateAvailabilityInput("2026-06-01", "invalid");
    expect(r2?.status).toBe("invalid_request");
    expect(r2?.reason).toContain("Vertrekdatum");
  });

  it("rejects departure equal to arrival", () => {
    const r = validateAvailabilityInput("2026-06-01", "2026-06-01");
    expect(r?.status).toBe("invalid_request");
  });

  it("rejects departure before arrival", () => {
    const r = validateAvailabilityInput("2026-06-05", "2026-06-01");
    expect(r?.status).toBe("invalid_request");
  });
});

// ── hasOverlap ──────────────────────────────────────────────────

describe("hasOverlap", () => {
  it("detects full overlap", () => {
    // Existing: Jun 5-10, Request: Jun 5-10
    expect(hasOverlap("2026-06-05", "2026-06-10", "2026-06-05", "2026-06-10")).toBe(true);
  });

  it("detects partial overlap at the start", () => {
    // Existing: Jun 5-10, Request: Jun 3-7
    expect(hasOverlap("2026-06-03", "2026-06-07", "2026-06-05", "2026-06-10")).toBe(true);
  });

  it("detects partial overlap at the end", () => {
    // Existing: Jun 5-10, Request: Jun 8-12
    expect(hasOverlap("2026-06-08", "2026-06-12", "2026-06-05", "2026-06-10")).toBe(true);
  });

  it("detects containment (request contains existing)", () => {
    // Existing: Jun 6-8, Request: Jun 5-10
    expect(hasOverlap("2026-06-05", "2026-06-10", "2026-06-06", "2026-06-08")).toBe(true);
  });

  it("detects containment (existing contains request)", () => {
    // Existing: Jun 5-10, Request: Jun 6-8
    expect(hasOverlap("2026-06-06", "2026-06-08", "2026-06-05", "2026-06-10")).toBe(true);
  });

  it("allows back-to-back bookings (check-in on check-out day)", () => {
    // Existing: Jun 5-8, Request: Jun 8-10
    // Guest A checks out Jun 8, Guest B checks in Jun 8 → no overlap
    expect(hasOverlap("2026-06-08", "2026-06-10", "2026-06-05", "2026-06-08")).toBe(false);
  });

  it("allows back-to-back in reverse order", () => {
    // Existing: Jun 8-10, Request: Jun 5-8
    expect(hasOverlap("2026-06-05", "2026-06-08", "2026-06-08", "2026-06-10")).toBe(false);
  });

  it("no overlap when completely before", () => {
    // Existing: Jun 10-15, Request: Jun 1-5
    expect(hasOverlap("2026-06-01", "2026-06-05", "2026-06-10", "2026-06-15")).toBe(false);
  });

  it("no overlap when completely after", () => {
    // Existing: Jun 1-5, Request: Jun 10-15
    expect(hasOverlap("2026-06-10", "2026-06-15", "2026-06-01", "2026-06-05")).toBe(false);
  });
});

// ── checkAvailability ───────────────────────────────────────────

describe("checkAvailability", () => {
  const existingBookings: Booking[] = [
    booking("b1", "2026-06-05", "2026-06-08", "confirmed"),
    booking("b2", "2026-06-15", "2026-06-20", "reserved"),
    booking("b3", "2026-07-01", "2026-07-05", "blocked"),
    booking("b4", "2026-08-01", "2026-08-05", "cancelled"), // should NOT block
    booking("b5", "2026-08-10", "2026-08-15", "expired"),   // should NOT block
  ];

  it("returns available for a free period", () => {
    const r = checkAvailability("2026-06-09", "2026-06-14", existingBookings);
    expect(r.status).toBe("available");
  });

  it("returns unavailable for overlapping confirmed booking", () => {
    const r = checkAvailability("2026-06-04", "2026-06-07", existingBookings);
    expect(r.status).toBe("unavailable");
    expect(r.conflictIds).toContain("b1");
  });

  it("returns unavailable for overlapping reserved booking", () => {
    const r = checkAvailability("2026-06-18", "2026-06-22", existingBookings);
    expect(r.status).toBe("unavailable");
    expect(r.conflictIds).toContain("b2");
  });

  it("returns unavailable for overlapping blocked period", () => {
    const r = checkAvailability("2026-06-30", "2026-07-03", existingBookings);
    expect(r.status).toBe("unavailable");
    expect(r.conflictIds).toContain("b3");
  });

  it("ignores cancelled bookings (not blocking)", () => {
    const r = checkAvailability("2026-08-01", "2026-08-05", existingBookings);
    expect(r.status).toBe("available");
  });

  it("ignores expired bookings (not blocking)", () => {
    const r = checkAvailability("2026-08-10", "2026-08-15", existingBookings);
    expect(r.status).toBe("available");
  });

  it("allows check-in on exact check-out day of existing booking", () => {
    // b1 ends Jun 8 → new booking can start Jun 8
    const r = checkAvailability("2026-06-08", "2026-06-12", existingBookings);
    expect(r.status).toBe("available");
  });

  it("allows check-out on exact check-in day of existing booking", () => {
    // b1 starts Jun 5 → new booking can end Jun 5
    const r = checkAvailability("2026-06-01", "2026-06-05", existingBookings);
    expect(r.status).toBe("available");
  });

  it("detects multiple conflicts", () => {
    // Span that overlaps both b1 and b2
    const r = checkAvailability("2026-06-06", "2026-06-18", existingBookings);
    expect(r.status).toBe("unavailable");
    expect(r.conflictIds).toContain("b1");
    expect(r.conflictIds).toContain("b2");
  });

  it("returns invalid_request for bad dates", () => {
    const r = checkAvailability("2026-06-10", "2026-06-05", existingBookings);
    expect(r.status).toBe("invalid_request");
  });

  it("returns available when no bookings exist", () => {
    const r = checkAvailability("2026-06-01", "2026-06-10", []);
    expect(r.status).toBe("available");
  });

  it("handles 1-night stay correctly", () => {
    // Jun 9 to Jun 10 (1 night) — between b1 and b2
    const r = checkAvailability("2026-06-09", "2026-06-10", existingBookings);
    expect(r.status).toBe("available");
  });

  it("handles month boundary correctly", () => {
    // Jun 28 to Jul 2 — overlaps with b3 (Jul 1-5)
    const r = checkAvailability("2026-06-28", "2026-07-02", existingBookings);
    expect(r.status).toBe("unavailable");
    expect(r.conflictIds).toContain("b3");
  });

  it("handles year boundary correctly", () => {
    const yearEndBookings: Booking[] = [
      booking("nye", "2026-12-30", "2027-01-02", "confirmed"),
    ];
    // Overlapping across year boundary
    const r = checkAvailability("2026-12-31", "2027-01-03", yearEndBookings);
    expect(r.status).toBe("unavailable");

    // Before the booking
    const r2 = checkAvailability("2026-12-28", "2026-12-30", yearEndBookings);
    expect(r2.status).toBe("available");
  });

  it("handles leap year correctly", () => {
    const leapBookings: Booking[] = [
      booking("leap", "2028-02-28", "2028-03-02", "confirmed"),
    ];
    // Feb 29 exists in 2028 — should detect overlap
    const r = checkAvailability("2028-02-29", "2028-03-01", leapBookings);
    expect(r.status).toBe("unavailable");
  });
});
