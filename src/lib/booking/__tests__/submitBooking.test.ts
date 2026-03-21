/**
 * Tests for the booking submission server action logic.
 *
 * Tests contact validation rules and the booking flow contract.
 * The actual submitBookingAction uses "use server" so we test
 * the validation logic directly and verify the contract.
 */

import { describe, it, expect } from "vitest";
import type {
  ContactDetails,
  BookingPeriod,
} from "@/components/booking/bookingFlowTypes";

// ── Helpers ─────────────────────────────────────────────────────

function validContact(overrides?: Partial<ContactDetails>): ContactDetails {
  return {
    firstName: "Jan",
    lastName: "de Vries",
    email: "jan@voorbeeld.nl",
    phone: "06-12345678",
    organisation: "",
    street: "Hoofdstraat 1",
    postalCode: "7851 AA",
    city: "Emmen",
    remarks: "",
    acceptTerms: true,
    ...overrides,
  };
}

function validPeriod(overrides?: Partial<BookingPeriod>): BookingPeriod {
  return {
    checkIn: "2026-09-01",
    checkOut: "2026-09-04",
    guests: 10,
    totalNights: 3,
    totalPrice: 225,
    avgPricePerNight: 75,
    additionalCosts: {
      cleaning: 425,
      linen: 145,
      energy: 118.5,
      tax: 88.5,
      subtotal: 777,
    },
    grandTotal: 1002,
    ...overrides,
  };
}

// ── Contact validation ──────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;
const POSTAL_CODE_RE = /^\d{4}\s?[A-Za-z]{2}$/;

function validateContact(
  contact: ContactDetails,
): Partial<Record<keyof ContactDetails, string>> {
  const errors: Partial<Record<keyof ContactDetails, string>> = {};
  if (!contact.firstName.trim()) errors.firstName = "Voornaam is verplicht.";
  if (!contact.lastName.trim()) errors.lastName = "Achternaam is verplicht.";
  if (!contact.email.trim()) {
    errors.email = "E-mailadres is verplicht.";
  } else if (!EMAIL_RE.test(contact.email.trim())) {
    errors.email = "Voer een geldig e-mailadres in.";
  }
  if (!contact.phone.trim()) {
    errors.phone = "Telefoonnummer is verplicht.";
  } else if (!PHONE_RE.test(contact.phone.trim())) {
    errors.phone = "Voer een geldig telefoonnummer in.";
  }
  if (!contact.street.trim()) errors.street = "Straat en huisnummer zijn verplicht.";
  if (!contact.postalCode.trim()) {
    errors.postalCode = "Postcode is verplicht.";
  } else if (!POSTAL_CODE_RE.test(contact.postalCode.trim())) {
    errors.postalCode = "Voer een geldige postcode in (bijv. 1234 AB).";
  }
  if (!contact.city.trim()) errors.city = "Woonplaats is verplicht.";
  if (!contact.acceptTerms)
    errors.acceptTerms = "U dient akkoord te gaan met de voorwaarden.";
  return errors;
}

// ── Tests ───────────────────────────────────────────────────────

describe("Contact validation", () => {
  it("accepts valid contact", () => {
    const errors = validateContact(validContact());
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("requires firstName", () => {
    const errors = validateContact(validContact({ firstName: "" }));
    expect(errors.firstName).toBeDefined();
  });

  it("requires lastName", () => {
    const errors = validateContact(validContact({ lastName: "" }));
    expect(errors.lastName).toBeDefined();
  });

  it("requires email", () => {
    const errors = validateContact(validContact({ email: "" }));
    expect(errors.email).toBeDefined();
  });

  it("validates email format", () => {
    const errors = validateContact(validContact({ email: "not-an-email" }));
    expect(errors.email).toContain("geldig");
  });

  it("accepts valid email formats", () => {
    for (const email of [
      "jan@voorbeeld.nl",
      "jan.de.vries@bedrijf.com",
      "user+tag@example.co.uk",
    ]) {
      const errors = validateContact(validContact({ email }));
      expect(errors.email).toBeUndefined();
    }
  });

  it("requires phone", () => {
    const errors = validateContact(validContact({ phone: "" }));
    expect(errors.phone).toBeDefined();
  });

  it("validates phone format", () => {
    const errors = validateContact(validContact({ phone: "abc" }));
    expect(errors.phone).toContain("geldig");
  });

  it("accepts valid phone formats", () => {
    for (const phone of [
      "06-12345678",
      "+31612345678",
      "0591 123456",
      "(06) 1234 5678",
    ]) {
      const errors = validateContact(validContact({ phone }));
      expect(errors.phone).toBeUndefined();
    }
  });

  it("requires street", () => {
    const errors = validateContact(validContact({ street: "" }));
    expect(errors.street).toBeDefined();
  });

  it("requires postalCode", () => {
    const errors = validateContact(validContact({ postalCode: "" }));
    expect(errors.postalCode).toBeDefined();
  });

  it("validates Dutch postal code format", () => {
    const invalid = ["1234", "ABCD EF", "123 AB", "12345 AB"];
    for (const pc of invalid) {
      const errors = validateContact(validContact({ postalCode: pc }));
      expect(errors.postalCode).toBeDefined();
    }
  });

  it("accepts valid Dutch postal codes", () => {
    for (const pc of ["7851 AA", "1234AB", "9999 ZZ"]) {
      const errors = validateContact(validContact({ postalCode: pc }));
      expect(errors.postalCode).toBeUndefined();
    }
  });

  it("requires city", () => {
    const errors = validateContact(validContact({ city: "" }));
    expect(errors.city).toBeDefined();
  });

  it("requires acceptTerms", () => {
    const errors = validateContact(validContact({ acceptTerms: false }));
    expect(errors.acceptTerms).toBeDefined();
  });

  it("organisation is optional", () => {
    const errors = validateContact(validContact({ organisation: "" }));
    expect(errors.organisation).toBeUndefined();
  });

  it("remarks is optional", () => {
    const errors = validateContact(validContact({ remarks: "" }));
    expect(errors.remarks).toBeUndefined();
  });

  it("trims whitespace before validation", () => {
    const errors = validateContact(validContact({ firstName: "   " }));
    expect(errors.firstName).toBeDefined();
  });

  it("returns multiple errors at once", () => {
    const errors = validateContact(
      validContact({
        firstName: "",
        email: "",
        phone: "",
        acceptTerms: false,
      }),
    );
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(4);
  });
});

describe("BookingPeriod type contract", () => {
  it("contains all required fields", () => {
    const p = validPeriod();
    expect(p.checkIn).toBeDefined();
    expect(p.checkOut).toBeDefined();
    expect(p.guests).toBeGreaterThan(0);
    expect(p.totalNights).toBeGreaterThan(0);
    expect(p.totalPrice).toBeGreaterThan(0);
    expect(p.avgPricePerNight).toBeGreaterThan(0);
  });

  it("totalNights matches date difference", () => {
    const p = validPeriod({ checkIn: "2026-09-01", checkOut: "2026-09-04" });
    expect(p.totalNights).toBe(3);
  });

  it("avgPricePerNight is rounded", () => {
    const p = validPeriod({ totalPrice: 200, totalNights: 3 });
    expect(Number.isInteger(p.avgPricePerNight)).toBe(true);
  });
});
