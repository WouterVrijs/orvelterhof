/**
 * Shared types for the multi-step booking flow.
 *
 * The flow supports two booking types:
 * - "verblijf": overnight stay with date range (existing)
 * - "arrangement": business package with single date (new)
 *
 * Flow: Verblijf/Arrangement → Upgrades → Gegevens → Bevestigen
 */

// ── Booking type ─────────────────────────────────────────────────

export type BookingType = "verblijf" | "arrangement";

// ── Arrangement definition ──────────────────────────────────────

export interface ArrangementOption {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  icon: "clock" | "calendar";
  features: string[];
  surcharges: string[] | null;
  /** Whether this arrangement includes overnight stay. */
  includesOvernight: boolean;
}

/** Selected arrangement from step 1. */
export interface SelectedArrangement {
  arrangementId: string;
  name: string;
  date: string;           // ISO "YYYY-MM-DD"
  guests: number;
  pricePerPerson: number;
  surchargeTotal: number;  // e.g. single room + tax
  totalPrice: number;      // pricePerPerson * guests + surchargeTotal
}

// ── Step 1 output ───────────────────────────────────────────────

/** Bijkomende kosten berekend op basis van gasten en nachten. */
export interface AdditionalCosts {
  cleaning: number;
  linen: number;
  energy: number;
  tax: number;
  subtotal: number;
}

/** Confirmed period from step 1 (Verblijf). */
export interface BookingPeriod {
  checkIn: string;    // ISO "YYYY-MM-DD"
  checkOut: string;   // ISO "YYYY-MM-DD"
  guests: number;
  totalNights: number;
  totalPrice: number;
  avgPricePerNight: number;
  additionalCosts: AdditionalCosts;
  grandTotal: number;
}

// ── Step 2 output: Upgrades ─────────────────────────────────────

export interface UpgradeOption {
  id: string;
  type: "quantity" | "yesno";
  value: number; // quantity or 0/1
}

export interface BookingUpgrades {
  selectedOptions: string[];
  extras: UpgradeOption[];
  remarks: string;
}

export const EMPTY_UPGRADES: BookingUpgrades = {
  selectedOptions: [],
  extras: [],
  remarks: "",
};

// ── Step 3 output: Gegevens ─────────────────────────────────────

export interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation: string;
  street: string;
  postalCode: string;
  city: string;
  remarks: string;
  acceptTerms: boolean;
}

export type ContactErrors = Partial<Record<keyof ContactDetails, string>>;

// ── Booking request (submitted in step 4) ────────────────────────

export interface BookingRequest {
  bookingType: BookingType;
  /** Present when bookingType === "verblijf". */
  period?: BookingPeriod;
  /** Present when bookingType === "arrangement". */
  arrangement?: SelectedArrangement;
  upgrades: BookingUpgrades;
  contact: ContactDetails;
}

// ── Booking submission result ────────────────────────────────────

export type BookingSubmissionStatus =
  | "idle"
  | "submitting"
  | "success"
  | "unavailable"
  | "error";

export interface BookingSubmissionResult {
  status: BookingSubmissionStatus;
  message?: string;
  bookingReference?: string;
}

// ── Flow steps ───────────────────────────────────────────────────

export type BookingFlowStep = 1 | 2 | 3 | 4;
