"use server";

/**
 * Server Action for submitting a booking request.
 *
 * Dual-mode:
 * - When BOOKING_API_URL is configured: validates locally, then POSTs
 *   to the external booking system API for final processing.
 * - When not configured: validates, re-checks availability, and creates
 *   a mock booking (for local development).
 *
 * In both modes, the action:
 * 1. Validates all input server-side
 * 2. Re-checks availability (source of truth)
 * 3. Creates/submits the booking
 * 4. Returns a controlled result
 */

import type {
  BookingRequest,
  BookingSubmissionResult,
  ContactDetails,
  ContactErrors,
} from "@/components/booking/bookingFlowTypes";
import { checkAvailability, validateAvailabilityInput } from "@/lib/availability/checkAvailability";
import { getBookingsInRange } from "@/lib/availability/bookingRepository";
import { isApiConfigured, apiFetch, BookingApiError } from "@/lib/api/bookingApiClient";
import type { BookingApiSubmitRequest, BookingApiSubmitResponse } from "@/lib/api/types";

// ── Contact validation ──────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;
const POSTAL_CODE_RE = /^\d{4}\s?[A-Za-z]{2}$/;

function validateContact(contact: ContactDetails): ContactErrors {
  const errors: ContactErrors = {};

  if (!contact.firstName.trim()) {
    errors.firstName = "Voornaam is verplicht.";
  }
  if (!contact.lastName.trim()) {
    errors.lastName = "Achternaam is verplicht.";
  }
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
  if (!contact.street.trim()) {
    errors.street = "Straat en huisnummer zijn verplicht.";
  }
  if (!contact.postalCode.trim()) {
    errors.postalCode = "Postcode is verplicht.";
  } else if (!POSTAL_CODE_RE.test(contact.postalCode.trim())) {
    errors.postalCode = "Voer een geldige postcode in (bijv. 1234 AB).";
  }
  if (!contact.city.trim()) {
    errors.city = "Woonplaats is verplicht.";
  }
  if (!contact.acceptTerms) {
    errors.acceptTerms = "U dient akkoord te gaan met de voorwaarden.";
  }

  return errors;
}

// ── Generate booking reference (mock only) ──────────────────────

function generateReference(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `OH-${y}${m}-${random}`;
}

// ── Main action ─────────────────────────────────────────────────

export async function submitBookingAction(
  request: BookingRequest,
): Promise<BookingSubmissionResult> {
  try {
    // 1. Validate contact details (always local — fast feedback)
    const contactErrors = validateContact(request.contact);
    if (Object.keys(contactErrors).length > 0) {
      const firstError = Object.values(contactErrors)[0];
      console.warn("[booking:submit] Validation failed:", contactErrors);
      return {
        status: "error",
        message: firstError ?? "Controleer uw gegevens en probeer het opnieuw.",
      };
    }

    // 2. Validate period input (verblijf only)
    if (!request.period) {
      // Arrangement bookings don't have a period — skip validation
      return submitMockArrangement(request);
    }
    const inputError = validateAvailabilityInput(
      request.period.checkIn,
      request.period.checkOut,
    );
    if (inputError) {
      console.warn("[booking:submit] Invalid period:", inputError.reason);
      return {
        status: "error",
        message: inputError.reason ?? "De gekozen periode is niet geldig.",
      };
    }

    // 3. Submit to API or mock
    if (isApiConfigured()) {
      return submitToApi(request);
    }
    return submitMock(request);
  } catch (error) {
    console.error("[booking:submit] Unexpected error:", error);
    return {
      status: "error",
      message:
        "Er is een onverwachte fout opgetreden bij het verwerken van uw aanvraag. Probeer het later opnieuw.",
    };
  }
}

// ── API submission ──────────────────────────────────────────────

async function submitToApi(
  request: BookingRequest,
): Promise<BookingSubmissionResult> {
  const period = request.period!;
  const apiRequest: BookingApiSubmitRequest = {
    checkIn: period.checkIn,
    checkOut: period.checkOut,
    guests: period.guests,
    contact: {
      firstName: request.contact.firstName,
      lastName: request.contact.lastName,
      email: request.contact.email,
      phone: request.contact.phone,
      street: request.contact.street,
      postalCode: request.contact.postalCode,
      city: request.contact.city,
      organisation: request.contact.organisation || undefined,
      remarks: request.contact.remarks || undefined,
    },
    upgrades: request.upgrades?.selectedOptions ?? [],
  };

  try {
    const response = await apiFetch<BookingApiSubmitResponse>("/bookings", {
      method: "POST",
      body: apiRequest,
    });

    console.info("[booking:submit] API response:", {
      status: response.status,
      reference: response.bookingReference,
    });

    return {
      status: response.status === "success" ? "success"
        : response.status === "unavailable" ? "unavailable"
          : "error",
      message: response.message ?? (
        response.status === "success"
          ? "Uw aanvraag is ontvangen! Wij nemen binnen 24 uur contact met u op."
          : response.status === "unavailable"
            ? "Helaas is de gekozen periode inmiddels niet meer beschikbaar."
            : "Er is een fout opgetreden bij het verwerken van uw aanvraag."
      ),
      bookingReference: response.bookingReference,
    };
  } catch (error) {
    if (error instanceof BookingApiError) {
      console.error("[booking:submit] API error:", {
        message: error.message,
        status: error.statusCode,
        timeout: error.isTimeout,
      });

      return {
        status: "error",
        message: error.isTimeout
          ? "Het boekingssysteem reageert niet. Probeer het later opnieuw."
          : "Er is een fout opgetreden bij het verzenden van uw aanvraag. Probeer het opnieuw.",
      };
    }
    throw error; // Re-throw unexpected errors to outer catch
  }
}

// ── Mock submission ─────────────────────────────────────────────

async function submitMock(
  request: BookingRequest,
): Promise<BookingSubmissionResult> {
  const period = request.period!;

  // Re-check availability against mock data
  const bookings = await getBookingsInRange(period.checkIn, period.checkOut);
  const availResult = checkAvailability(period.checkIn, period.checkOut, bookings);

  if (availResult.status !== "available") {
    console.info(
      "[booking:submit] Period no longer available at submission:",
      { checkIn: period.checkIn, checkOut: period.checkOut },
    );
    return {
      status: "unavailable",
      message:
        "Helaas is de gekozen periode inmiddels niet meer beschikbaar. " +
        "Ga terug en kies een andere periode.",
    };
  }

  const reference = generateReference();
  console.info("[booking:submit] Mock booking created:", {
    reference,
    checkIn: period.checkIn,
    checkOut: period.checkOut,
    guests: period.guests,
    name: `${request.contact.firstName} ${request.contact.lastName}`,
    email: request.contact.email,
    upgrades: request.upgrades?.selectedOptions ?? [],
  });

  return {
    status: "success",
    message:
      "Uw aanvraag is ontvangen! Wij nemen binnen 24 uur contact met u op om de boeking te bevestigen.",
    bookingReference: reference,
  };
}

async function submitMockArrangement(
  request: BookingRequest,
): Promise<BookingSubmissionResult> {
  const reference = generateReference();
  console.info("[booking:submit] Mock arrangement created:", {
    reference,
    arrangement: request.arrangement,
    name: `${request.contact.firstName} ${request.contact.lastName}`,
    email: request.contact.email,
  });

  return {
    status: "success",
    message:
      "Uw aanvraag voor het arrangement is ontvangen! Wij nemen binnen 24 uur contact met u op.",
    bookingReference: reference,
  };
}

// ── Standalone contact validation ────────────────────────────────

/**
 * Server-side contact validation — can be called independently
 * for real-time field validation without submitting.
 */
export async function validateContactAction(
  contact: ContactDetails,
): Promise<{ valid: boolean; errors: ContactErrors }> {
  const errors = validateContact(contact);
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
