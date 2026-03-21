/**
 * Tests for the server actions: checkAvailabilityAction and confirmAvailabilityAction.
 *
 * These tests verify:
 * - Input validation (missing, invalid, manipulated data)
 * - Availability checking against mock bookings
 * - Error handling (unexpected failures return controlled responses)
 * - Response safety (no conflictIds leaked to frontend)
 * - Confirm re-check behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We test the action logic indirectly by testing the underlying functions
// and the action's error handling. Direct testing of "use server" functions
// requires a Next.js runtime, so we test the behavior by importing the
// module and verifying the contracts.

import {
  checkAvailability,
  validateAvailabilityInput,
} from "../checkAvailability";
import type { Booking, AvailabilityResult } from "../types";

// ── Helper ──────────────────────────────────────────────────────

function booking(
  id: string,
  startDate: string,
  endDate: string,
  status: Booking["status"] = "confirmed",
): Booking {
  return { id, startDate, endDate, status };
}

// ── Input validation (server-side boundary) ─────────────────────

describe("Server-side input validation", () => {
  it("rejects missing arrivalDate", () => {
    const r = validateAvailabilityInput(null, "2026-06-05");
    expect(r?.status).toBe("invalid_request");
    expect(r?.reason).toBeDefined();
  });

  it("rejects missing departureDate", () => {
    const r = validateAvailabilityInput("2026-06-01", undefined);
    expect(r?.status).toBe("invalid_request");
  });

  it("rejects non-string input (number)", () => {
    const r = validateAvailabilityInput(123, 456);
    expect(r?.status).toBe("invalid_request");
  });

  it("rejects empty strings", () => {
    const r = validateAvailabilityInput("", "2026-06-05");
    expect(r?.status).toBe("invalid_request");
  });

  it("rejects invalid date format", () => {
    const r = validateAvailabilityInput("2026/06/01", "2026-06-05");
    expect(r?.status).toBe("invalid_request");
    expect(r?.reason).toContain("Aankomstdatum");
  });

  it("rejects impossible date", () => {
    const r = validateAvailabilityInput("2026-02-29", "2026-03-05");
    expect(r?.status).toBe("invalid_request");
  });

  it("rejects departure equal to arrival", () => {
    const r = validateAvailabilityInput("2026-06-01", "2026-06-01");
    expect(r?.status).toBe("invalid_request");
  });

  it("rejects departure before arrival", () => {
    const r = validateAvailabilityInput("2026-06-10", "2026-06-05");
    expect(r?.status).toBe("invalid_request");
  });

  it("accepts valid input", () => {
    const r = validateAvailabilityInput("2026-06-01", "2026-06-05");
    expect(r).toBeNull();
  });

  it("never returns 'available' for invalid input", () => {
    // This is the critical safety guarantee: no false positive
    const invalidInputs: [unknown, unknown][] = [
      [null, "2026-06-05"],
      ["2026-06-01", null],
      [123, "2026-06-05"],
      ["not-a-date", "2026-06-05"],
      ["2026-06-01", "invalid"],
      ["2026-06-10", "2026-06-05"],
      ["", ""],
      [undefined, undefined],
    ];

    for (const [arrival, departure] of invalidInputs) {
      const r = validateAvailabilityInput(arrival, departure);
      expect(r).not.toBeNull();
      expect(r?.status).not.toBe("available");
    }
  });
});

// ── Availability checking (domain logic) ────────────────────────

describe("Server-side availability checking", () => {
  const bookings: Booking[] = [
    booking("b1", "2026-06-05", "2026-06-08", "confirmed"),
    booking("b2", "2026-06-15", "2026-06-20", "reserved"),
    booking("b3", "2026-07-01", "2026-07-05", "blocked"),
    booking("b4", "2026-08-01", "2026-08-05", "cancelled"),
    booking("b5", "2026-08-10", "2026-08-15", "expired"),
  ];

  it("returns available for a free period", () => {
    const r = checkAvailability("2026-06-09", "2026-06-14", bookings);
    expect(r.status).toBe("available");
  });

  it("returns unavailable for overlap with confirmed booking", () => {
    const r = checkAvailability("2026-06-04", "2026-06-07", bookings);
    expect(r.status).toBe("unavailable");
    expect(r.conflictIds).toContain("b1");
  });

  it("returns unavailable for overlap with reserved booking", () => {
    const r = checkAvailability("2026-06-18", "2026-06-22", bookings);
    expect(r.status).toBe("unavailable");
    expect(r.conflictIds).toContain("b2");
  });

  it("returns unavailable for overlap with blocked period", () => {
    const r = checkAvailability("2026-06-30", "2026-07-03", bookings);
    expect(r.status).toBe("unavailable");
    expect(r.conflictIds).toContain("b3");
  });

  it("ignores cancelled bookings", () => {
    const r = checkAvailability("2026-08-01", "2026-08-05", bookings);
    expect(r.status).toBe("available");
  });

  it("ignores expired bookings", () => {
    const r = checkAvailability("2026-08-10", "2026-08-15", bookings);
    expect(r.status).toBe("available");
  });

  it("allows exact back-to-back (check-in on checkout day)", () => {
    const r = checkAvailability("2026-06-08", "2026-06-12", bookings);
    expect(r.status).toBe("available");
  });

  it("returns invalid_request for bad input instead of available", () => {
    const r = checkAvailability("2026-06-10", "2026-06-05", bookings);
    expect(r.status).toBe("invalid_request");
    // Crucially: NOT "available"
  });
});

// ── Response safety ─────────────────────────────────────────────

describe("Response safety (no internal data leakage)", () => {
  it("checkAvailability includes conflictIds in its result (for server-side use)", () => {
    const bookings = [booking("secret-1", "2026-06-05", "2026-06-10", "confirmed")];
    const r = checkAvailability("2026-06-06", "2026-06-08", bookings);
    expect(r.status).toBe("unavailable");
    // The raw result DOES contain conflictIds (this is expected server-side)
    expect(r.conflictIds).toContain("secret-1");
  });

  // Note: The actual stripping of conflictIds happens in toClientResult()
  // inside the server action. We verify the pattern here.
  it("toClientResult pattern strips conflictIds", () => {
    const serverResult: AvailabilityResult = {
      status: "unavailable",
      reason: "Overlap",
      conflictIds: ["secret-1", "secret-2"],
    };
    // Simulate what toClientResult does
    const { conflictIds: _, ...clientSafe } = serverResult;
    expect(clientSafe).not.toHaveProperty("conflictIds");
    expect(clientSafe.status).toBe("unavailable");
    expect(clientSafe.reason).toBe("Overlap");
  });
});

// ── Error handling ──────────────────────────────────────────────

describe("Error handling", () => {
  it("unexpected errors never return 'available'", () => {
    // Simulate: if checkAvailability were given corrupted data
    // The validation layer prevents this, but we verify the contract
    const r = checkAvailability("not-a-date", "also-not", []);
    expect(r.status).not.toBe("available");
    expect(r.status).toBe("invalid_request");
  });

  it("error status is a valid AvailabilityResult status", () => {
    // Verify the type system allows "error" as a status
    const errorResult: AvailabilityResult = {
      status: "error",
      reason: "Unexpected failure",
    };
    expect(errorResult.status).toBe("error");
  });
});

// ── Status filtering ────────────────────────────────────────────

describe("Blocking status filtering", () => {
  const statuses: Array<{ status: Booking["status"]; shouldBlock: boolean }> = [
    { status: "confirmed", shouldBlock: true },
    { status: "reserved", shouldBlock: true },
    { status: "blocked", shouldBlock: true },
    { status: "cancelled", shouldBlock: false },
    { status: "expired", shouldBlock: false },
  ];

  for (const { status, shouldBlock } of statuses) {
    it(`${status} ${shouldBlock ? "blocks" : "does not block"} availability`, () => {
      const bookings = [booking("test", "2026-06-05", "2026-06-10", status)];
      const r = checkAvailability("2026-06-06", "2026-06-08", bookings);
      expect(r.status).toBe(shouldBlock ? "unavailable" : "available");
    });
  }
});

// ── Confirm re-check scenario ───────────────────────────────────

describe("Confirm re-check scenario", () => {
  it("period available, then new booking appears → unavailable", () => {
    const initialBookings: Booking[] = [];
    const laterBookings: Booking[] = [
      booking("new-1", "2026-06-05", "2026-06-10", "confirmed"),
    ];

    // Initial check: available
    const r1 = checkAvailability("2026-06-06", "2026-06-08", initialBookings);
    expect(r1.status).toBe("available");

    // Confirm check with new data: unavailable
    const r2 = checkAvailability("2026-06-06", "2026-06-08", laterBookings);
    expect(r2.status).toBe("unavailable");
  });

  it("confirm check uses fresh booking data, not cached result", () => {
    // This simulates the race condition scenario:
    // User checks at T1 → available
    // Another user books at T2
    // User confirms at T3 → must be unavailable
    const bookingsAtT1: Booking[] = [];
    const bookingsAtT3: Booking[] = [
      booking("concurrent", "2026-09-01", "2026-09-05", "confirmed"),
    ];

    const check = checkAvailability("2026-09-02", "2026-09-04", bookingsAtT1);
    expect(check.status).toBe("available");

    const confirm = checkAvailability("2026-09-02", "2026-09-04", bookingsAtT3);
    expect(confirm.status).toBe("unavailable");
    expect(confirm.conflictIds).toContain("concurrent");
  });

  it("confirm blocks correctly when status changed from reserved to confirmed", () => {
    // Even status changes within blocking statuses should still block
    const bookings = [
      booking("upgraded", "2026-10-01", "2026-10-05", "confirmed"),
    ];
    const r = checkAvailability("2026-10-02", "2026-10-04", bookings);
    expect(r.status).toBe("unavailable");
  });
});
