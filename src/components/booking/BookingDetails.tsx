"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type {
  BookingType,
  BookingPeriod,
  BookingFlowStep,
  SelectedArrangement,
  ContactDetails,
  ContactErrors,
} from "./bookingFlowTypes";
import { confirmAvailabilityAction } from "@/lib/availability/actions";
import BookingFlowSummary from "./BookingFlowSummary";
import BookingStepIndicator from "./BookingStepIndicator";
import { Loader2, AlertTriangle } from "lucide-react";

interface BookingDetailsProps {
  period?: BookingPeriod | null;
  arrangement?: SelectedArrangement | null;
  bookingType?: BookingType;
  initialContact?: ContactDetails | null;
}

const EMPTY_CONTACT: ContactDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organisation: "",
  street: "",
  postalCode: "",
  city: "",
  remarks: "",
  acceptTerms: false,
};

/** Session storage key for contact details between steps. */
const CONTACT_STORAGE_KEY = "orvelterhof_booking_contact";

/**
 * Step 3 of the booking flow — contact details form.
 *
 * On mount, re-checks availability. On valid submit, saves contact
 * to sessionStorage and navigates to step 4 (confirmation).
 */
export default function BookingDetails({
  period,
  arrangement,
  bookingType = "verblijf",
  initialContact,
}: BookingDetailsProps) {
  const router = useRouter();
  const t = useTranslations("bookingModule");
  const isArrangement = bookingType === "arrangement";

  // ── Availability re-check on mount (verblijf only) ────────
  const [availCheck, setAvailCheck] = useState<
    "checking" | "available" | "unavailable" | "error"
  >(isArrangement ? "available" : "checking");

  useEffect(() => {
    if (isArrangement || !period) return; // skip for arrangements
    let cancelled = false;
    async function check() {
      try {
        const result = await confirmAvailabilityAction(
          period!.checkIn,
          period!.checkOut,
        );
        if (cancelled) return;
        setAvailCheck(
          result.status === "available" ? "available" : "unavailable",
        );
      } catch {
        if (!cancelled) setAvailCheck("error");
      }
    }
    check();
    return () => { cancelled = true; };
  }, [period?.checkIn, period?.checkOut, isArrangement]);

  // ── Form state ──────────────────────────────────────────────
  const [contact, setContact] = useState<ContactDetails>(() => {
    if (initialContact) return initialContact;
    // Try to restore from sessionStorage
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(CONTACT_STORAGE_KEY);
        if (stored) return JSON.parse(stored) as ContactDetails;
      } catch { /* ignore */ }
    }
    return EMPTY_CONTACT;
  });
  const [errors, setErrors] = useState<ContactErrors>({});

  const updateField = useCallback(
    <K extends keyof ContactDetails>(field: K, value: ContactDetails[K]) => {
      setContact((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors],
  );

  // ── Client-side validation (without acceptTerms — that's in step 4) ──
  function validateLocally(): ContactErrors {
    const e: ContactErrors = {};
    if (!contact.firstName.trim()) e.firstName = t("validationFirstName");
    if (!contact.lastName.trim()) e.lastName = t("validationLastName");
    if (!contact.email.trim()) {
      e.email = t("validationEmail");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      e.email = t("validationEmailInvalid");
    }
    if (!contact.phone.trim()) {
      e.phone = t("validationPhone");
    } else if (!/^[+]?[\d\s\-()]{7,20}$/.test(contact.phone.trim())) {
      e.phone = t("validationPhoneInvalid");
    }
    if (!contact.street.trim()) e.street = t("validationStreet");
    if (!contact.postalCode.trim()) {
      e.postalCode = t("validationPostalCode");
    } else if (!/^\d{4}\s?[A-Za-z]{2}$/.test(contact.postalCode.trim())) {
      e.postalCode = t("validationPostalCodeInvalid");
    }
    if (!contact.city.trim()) e.city = t("validationCity");
    return e;
  }

  // ── Proceed to step 4 ──────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const localErrors = validateLocally();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      const firstKey = Object.keys(localErrors)[0];
      const el = document.getElementById(`booking-${firstKey}`);
      el?.focus();
      return;
    }

    // Save contact to sessionStorage for step 4
    try {
      sessionStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contact));
    } catch { /* storage full — proceed anyway */ }

    const params = new URLSearchParams({ stap: "5" });
    if (isArrangement && arrangement) {
      params.set("type", "arrangement");
      params.set("arrangement", JSON.stringify(arrangement));
      params.set("personen", String(arrangement.guests));
    } else if (period) {
      params.set("aankomst", period.checkIn);
      params.set("vertrek", period.checkOut);
      params.set("personen", String(period.guests));
    }
    router.push(`/boeken?${params.toString()}`);
  }

  // ── Navigation ──────────────────────────────────────────────
  function goBack() {
    try {
      sessionStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contact));
    } catch { /* ignore */ }

    if (isArrangement && arrangement) {
      // Go back to arrangement picker (step 1)
      const params = new URLSearchParams({
        type: "arrangement",
        arrangement: JSON.stringify(arrangement),
        personen: String(arrangement.guests),
      });
      router.push(`/boeken?${params.toString()}`);
    } else if (period) {
      const params = new URLSearchParams({
        aankomst: period.checkIn,
        vertrek: period.checkOut,
        personen: String(period.guests),
        stap: "3",
      });
      router.push(`/boeken?${params.toString()}`);
    }
  }

  function goToStep(step: BookingFlowStep) {
    if (isArrangement) {
      const params = new URLSearchParams({ type: "arrangement" });
      if (arrangement) {
        params.set("arrangement", JSON.stringify(arrangement));
        params.set("personen", String(arrangement.guests));
      }
      if (step > 1) params.set("stap", String(step));
      router.push(`/boeken?${params.toString()}`);
    } else if (period) {
      const params = new URLSearchParams({
        aankomst: period.checkIn,
        vertrek: period.checkOut,
        personen: String(period.guests),
      });
      if (step > 1) params.set("stap", String(step));
      router.push(`/boeken?${params.toString()}`);
    }
  }

  function goToStep1() {
    goToStep(1);
  }

  // ── Unavailable at mount ────────────────────────────────────
  if (availCheck === "unavailable") {
    return (
      <>
        <BookingStepIndicator currentStep={4} onStepClick={goToStep} />
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={32} className="text-red-500" />
            </span>
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            {t("periodNoLongerAvailable")}
          </h2>
          <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {t("periodNoLongerAvailableDescription")}
          </p>
          <button
            type="button"
            onClick={goToStep1}
            className="rounded-full bg-terracotta px-8 py-3 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
          >
            {t("chooseAnotherPeriod")}
          </button>
        </div>
      </>
    );
  }

  // ── Main form ───────────────────────────────────────────────
  const isLoading = availCheck === "checking";
  const canProceed = availCheck === "available";

  return (
    <>
      <BookingStepIndicator currentStep={4} onStepClick={goToStep} />

      {isLoading && (
        <div className="mb-8 flex items-center justify-center gap-3 rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-4">
          <Loader2 size={18} className="animate-spin text-terracotta" />
          <p className="font-[family-name:var(--font-lato)] text-sm text-olive-dark">
            {t("recheckingAvailability")}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Form */}
        <div className="min-w-0 flex-1 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive font-[family-name:var(--font-lato)] text-sm font-bold text-white">
                4
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark md:text-2xl">
                {t("yourDetails")}
              </h2>
            </div>
            <p className="mt-2 pl-11 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-text-muted">
              {t("yourDetailsDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                id="booking-firstName"
                label={t("firstName")}
                required
                value={contact.firstName}
                error={errors.firstName}
                onChange={(v) => updateField("firstName", v)}
                autoComplete="given-name"
              />
              <FormField
                id="booking-lastName"
                label={t("lastName")}
                required
                value={contact.lastName}
                error={errors.lastName}
                onChange={(v) => updateField("lastName", v)}
                autoComplete="family-name"
              />
            </div>

            {/* Contact */}
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                id="booking-email"
                label={t("email")}
                type="email"
                required
                value={contact.email}
                error={errors.email}
                onChange={(v) => updateField("email", v)}
                autoComplete="email"
              />
              <FormField
                id="booking-phone"
                label={t("phone")}
                type="tel"
                required
                value={contact.phone}
                error={errors.phone}
                onChange={(v) => updateField("phone", v)}
                autoComplete="tel"
              />
            </div>

            {/* Organisation (optional) */}
            <div className="mb-5">
              <FormField
                id="booking-organisation"
                label={t("organisation")}
                value={contact.organisation}
                onChange={(v) => updateField("organisation", v)}
                autoComplete="organization"
              />
            </div>

            {/* Address */}
            <div className="mb-5">
              <FormField
                id="booking-street"
                label={t("streetAndNumber")}
                required
                value={contact.street}
                error={errors.street}
                onChange={(v) => updateField("street", v)}
                autoComplete="street-address"
              />
            </div>
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                id="booking-postalCode"
                label={t("postalCode")}
                required
                value={contact.postalCode}
                error={errors.postalCode}
                onChange={(v) => updateField("postalCode", v)}
                autoComplete="postal-code"
              />
              <FormField
                id="booking-city"
                label={t("city")}
                required
                value={contact.city}
                error={errors.city}
                onChange={(v) => updateField("city", v)}
                autoComplete="address-level2"
              />
            </div>

            {/* Remarks */}
            <div className="mb-8">
              <label
                htmlFor="booking-remarks"
                className="mb-1.5 block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-olive-light"
              >
                {t("remarksLabel")}
              </label>
              <textarea
                id="booking-remarks"
                value={contact.remarks}
                onChange={(e) => updateField("remarks", e.target.value)}
                rows={3}
                placeholder={t("remarksPlaceholder")}
                className="w-full rounded-xl border border-cream-dark bg-[#fbf8f6] px-4 py-2.5 font-[family-name:var(--font-lato)] text-sm text-text-dark placeholder:text-[#c5c2bc] outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                className="order-2 font-[family-name:var(--font-lato)] text-sm text-olive-light transition-colors hover:text-terracotta sm:order-1"
              >
                {isArrangement ? t("backToArrangement") : t("backToUpgrades")}
              </button>

              <button
                type="submit"
                disabled={!canProceed}
                className={`order-1 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all sm:order-2 ${
                  canProceed
                    ? "bg-terracotta text-white shadow-md hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
                    : "bg-cream-dark/40 text-olive-light/40"
                }`}
              >
                {t("proceedToConfirmation")}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 lg:sticky lg:top-6 lg:w-80">
          {period ? (
            <BookingFlowSummary period={period} onEditPeriod={goToStep1} />
          ) : arrangement ? (
            <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
              <h3 className="mb-1 font-[family-name:var(--font-playfair)] text-xl text-olive-dark">
                {t("yourArrangement")}
              </h3>
              <p className="mb-4 font-[family-name:var(--font-lato)] text-xs text-text-muted">
                {t("orvelterHof")}
              </p>
              <div className="space-y-2 font-[family-name:var(--font-lato)] text-sm text-text-muted">
                <p className="font-medium text-olive-dark">{arrangement.name}</p>
                <p>{t("dateLabel")}: {arrangement.date}</p>
                <p>{t("personsCount", { count: arrangement.guests })}</p>
                <p className="border-t border-cream-dark pt-2 font-[family-name:var(--font-playfair)] text-lg text-olive-dark">
                  &euro;{arrangement.totalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button
                type="button"
                onClick={goToStep1}
                className="mt-4 font-[family-name:var(--font-lato)] text-xs font-medium text-terracotta transition-colors hover:text-terracotta-dark"
              >
                {t("editArrangement")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

// ── Form field component ──────────────────────────────────────

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoComplete?: string;
}

function FormField({
  id,
  label,
  type = "text",
  required,
  value,
  error,
  onChange,
  disabled,
  autoComplete,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-olive-light"
      >
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-[#fbf8f6] px-4 py-2.5 font-[family-name:var(--font-lato)] text-sm text-text-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive disabled:opacity-60 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
            : "border-cream-dark"
        }`}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 font-[family-name:var(--font-lato)] text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
