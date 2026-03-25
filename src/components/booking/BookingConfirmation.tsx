"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type {
  BookingType,
  BookingPeriod,
  BookingUpgrades,
  SelectedArrangement,
  ContactDetails,
  BookingSubmissionStatus,
} from "./bookingFlowTypes";
import { EMPTY_UPGRADES } from "./bookingFlowTypes";
import { submitBooking, type BookingActionState } from "@/actions/booking";
import { confirmAvailabilityAction } from "@/lib/availability/actions";
import { formatDisplayDate } from "./dateUtils";
import BookingStepIndicator from "./BookingStepIndicator";
import { Loader2, Check, AlertTriangle, Pencil, CreditCard } from "lucide-react";

interface BookingConfirmationProps {
  bookingType?: BookingType;
  period?: BookingPeriod;
  arrangement?: SelectedArrangement;
  upgrades: BookingUpgrades;
  contact: ContactDetails;
}

/**
 * Step 4 of the booking flow — review & confirm.
 *
 * Shows a read-only overview of all booking details with "Wijzig" links
 * per section. The user accepts terms and clicks "Bevestig boeking" to
 * trigger the final server-side submission.
 */
export default function BookingConfirmation({
  bookingType = "verblijf",
  period,
  arrangement,
  upgrades,
  contact,
}: BookingConfirmationProps) {
  const router = useRouter();
  const t = useTranslations("bookingModule");
  const isArrangement = bookingType === "arrangement";

  // For arrangements, departureDate must be after arrivalDate for API validation
  const arrangementDepartureDate = (() => {
    if (!arrangement?.date) return "";
    const d = new Date(arrangement.date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  // ── Availability re-check on mount (verblijf only) ────────
  const [availCheck, setAvailCheck] = useState<
    "checking" | "available" | "unavailable" | "error"
  >(isArrangement ? "available" : "checking");

  useEffect(() => {
    if (isArrangement || !period) return;
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

  // ── Payment option state ──────────────────────────────────
  const [paymentOption, setPaymentOption] = useState<"full" | "deposit">("full");

  const totalAmount = isArrangement
    ? (arrangement?.totalPrice ?? 0)
    : (period?.grandTotal ?? 0);
  const depositAmount = Math.round(totalAmount * 0.3 * 100) / 100;
  const payableAmount = paymentOption === "deposit" ? depositAmount : totalAmount;

  // ── Terms state ────────────────────────────────────────────
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // ── Server action via useActionState ──────────────────────
  const [state, formAction, isPending] = useActionState<BookingActionState, FormData>(submitBooking, null);

  // Map server action result to legacy status for UI
  const submitStatus: BookingSubmissionStatus = isPending
    ? "submitting"
    : state?.success
      ? "success"
      : state?.error
        ? "error"
        : "idle";
  const submitMessage = state?.success
    ? t("requestReceivedMessage")
    : state?.error
      ? (typeof state.error === "string" ? state.error : t("submitErrorGeneric"))
      : null;
  const bookingReference = state?.reservationNumber ?? null;

  // Redirect to Mollie checkout if payment URL is returned
  useEffect(() => {
    if (state?.success && state.paymentUrl) {
      // Store reference for the return page
      try {
        sessionStorage.setItem("orvelterhof_payment_ref", state.reservationNumber ?? "");
        sessionStorage.setItem("orvelterhof_payment_id", state.paymentId ?? "");
      } catch { /* ignore */ }
      window.location.href = state.paymentUrl;
    }
  }, [state?.success, state?.paymentUrl, state?.reservationNumber, state?.paymentId]);

  // Clear sessionStorage on success (only if no payment redirect)
  useEffect(() => {
    if (state?.success && !state.paymentUrl) {
      try { sessionStorage.removeItem("orvelterhof_booking_contact"); } catch { /* ignore */ }
    }
  }, [state?.success, state?.paymentUrl]);

  // ── Navigation helpers ──────────────────────────────────────
  function baseParams(): URLSearchParams {
    if (isArrangement && arrangement) {
      return new URLSearchParams({
        type: "arrangement",
        arrangement: JSON.stringify(arrangement),
        personen: String(arrangement.guests),
      });
    }
    return new URLSearchParams({
      aankomst: period?.checkIn ?? "",
      vertrek: period?.checkOut ?? "",
      personen: String(period?.guests ?? 2),
    });
  }

  function goToStep(step: number) {
    const params = baseParams();
    if (step > 1) params.set("stap", String(step));
    router.push(`/boeken?${params.toString()}`);
  }

  const isLoading = availCheck === "checking";
  const isSubmitting = isPending;
  const canConfirm = availCheck === "available" && !isSubmitting;

  // ── Redirecting to payment ──────────────────────────────────
  if (submitStatus === "success" && state?.paymentUrl) {
    return (
      <>
        <BookingStepIndicator currentStep={5} onStepClick={goToStep} />
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 flex justify-center">
            <Loader2 size={32} className="animate-spin text-terracotta" />
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            {t("redirectingToPayment")}
          </h2>
          <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {t("redirectingToPaymentDescription")}
          </p>
          <a
            href={state.paymentUrl}
            className="inline-flex rounded-full bg-terracotta px-8 py-3 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg"
          >
            {t("goToPayment")}
          </a>
        </div>
      </>
    );
  }

  // ── Success state (no payment) ────────────────────────────
  if (submitStatus === "success") {
    return (
      <>
        <BookingStepIndicator currentStep={5} onStepClick={goToStep} />
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5a9a5a]/10">
              <Check size={32} className="text-[#5a9a5a]" />
            </span>
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark md:text-3xl">
            {t("requestReceived")}
          </h2>
          <p className="mb-2 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {submitMessage}
          </p>
          {bookingReference && (
            <p className="mb-6 font-[family-name:var(--font-lato)] text-sm text-olive-light">
              {t("referenceNumber")}{" "}
              <span className="font-bold text-olive-dark">{bookingReference}</span>
            </p>
          )}
          <div className="space-y-3">
            <div className="rounded-xl bg-[#fbf8f6] px-6 py-4">
              <p className="font-[family-name:var(--font-lato)] text-sm text-text-muted">
                {isArrangement && arrangement ? (
                  <>
                    <span className="font-medium text-olive-dark">
                      {arrangement.name}
                    </span>
                    {" \u00b7 "}
                    {formatDisplayDate(arrangement.date)} {" \u00b7 "}
                    {t("personsCount", { count: arrangement.guests })}
                  </>
                ) : period ? (
                  <>
                    <span className="font-medium text-olive-dark">
                      {t("dateRangeLabel", { checkIn: formatDisplayDate(period.checkIn), checkOut: formatDisplayDate(period.checkOut) })}
                    </span>
                    {" \u00b7 "}
                    {period.totalNights === 1 ? t("nightSingular") : t("nightPlural", { count: period.totalNights })} {" \u00b7 "}
                    {t("personsCount", { count: period.guests })}
                  </>
                ) : null}
              </p>
            </div>
            <p className="font-[family-name:var(--font-lato)] text-xs text-text-muted">
              {t("confirmationSentTo")}{" "}
              <span className="font-medium">{contact.email}</span>
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── Unavailable at mount ────────────────────────────────────
  if (availCheck === "unavailable") {
    return (
      <>
        <BookingStepIndicator currentStep={5} onStepClick={goToStep} />
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
            onClick={() => goToStep(1)}
            className="rounded-full bg-terracotta px-8 py-3 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
          >
            {t("chooseAnotherPeriod")}
          </button>
        </div>
      </>
    );
  }

  // ── Main confirmation view ──────────────────────────────────
  return (
    <>
      <BookingStepIndicator currentStep={5} onStepClick={goToStep} />

      {isLoading && (
        <div className="mb-8 flex items-center justify-center gap-3 rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-4">
          <Loader2 size={18} className="animate-spin text-terracotta" />
          <p className="font-[family-name:var(--font-lato)] text-sm text-olive-dark">
            {t("recheckingAvailability")}
          </p>
        </div>
      )}

      {/* Submit error */}
      {submitStatus === "error" && submitMessage && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
          <p className="font-[family-name:var(--font-lato)] text-sm font-medium text-red-700">
            {submitMessage}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Overview */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Heading */}
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive font-[family-name:var(--font-lato)] text-sm font-bold text-white">
                5
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark md:text-2xl">
                {t("reviewBooking")}
              </h2>
            </div>
            <p className="mt-2 pl-11 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-text-muted">
              {t("reviewBookingDescription")}
            </p>
          </div>

          {/* Verblijf / Arrangement section */}
          {isArrangement && arrangement ? (
            <SummarySection title={t("arrangementSection")} editLabel={t("edit")} onEdit={() => goToStep(1)}>
              <SummaryRow label={t("arrangementSection")} value={arrangement.name} />
              <SummaryRow label={t("dateLabel")} value={formatDisplayDate(arrangement.date)} />
              <SummaryRow label={t("numberOfPersonsLabel")} value={t("personsCount", { count: arrangement.guests })} />
              <SummaryRow
                label={t("pricePerPerson")}
                value={`\u20AC${arrangement.pricePerPerson.toFixed(2).replace(".", ",")}`}
              />
            </SummarySection>
          ) : period ? (
            <SummarySection title={t("staySection")} editLabel={t("edit")} onEdit={() => goToStep(1)}>
              <SummaryRow label={t("arrival")} value={formatDisplayDate(period.checkIn)} />
              <SummaryRow label={t("departure")} value={formatDisplayDate(period.checkOut)} />
              <SummaryRow label={t("stayDuration")} value={period.totalNights === 1 ? t("nightSingular") : t("nightPlural", { count: period.totalNights })} />
              <SummaryRow label={t("numberOfPersonsLabel")} value={t("personsCount", { count: period.guests })} />
            </SummarySection>
          ) : null}

          {/* Upgrades section (verblijf only) */}
          {!isArrangement && (
            <SummarySection title={t("extrasSection")} editLabel={t("edit")} onEdit={() => goToStep(2)}>
              {upgrades.extras.filter((e) => e.value > 0).length > 0 ? (
                upgrades.extras.filter((e) => e.value > 0).map((extra) => (
                  <SummaryRow
                    key={extra.id}
                    label={t(`extra${extra.id.charAt(0).toUpperCase()}${extra.id.slice(1)}` as Parameters<typeof t>[0])}
                    value={extra.type === "yesno" ? t("extraYes") : String(extra.value)}
                  />
                ))
              ) : (
                <p className="font-[family-name:var(--font-lato)] text-sm text-text-muted">
                  {t("noExtrasSelected")}
                </p>
              )}
            </SummarySection>
          )}

          {/* Gegevens section */}
          <SummarySection title={t("yourDetailsSection")} editLabel={t("edit")} onEdit={() => goToStep(3)}>
            <SummaryRow label={t("name")} value={`${contact.firstName} ${contact.lastName}`} />
            {contact.organisation && (
              <SummaryRow label={t("organisationLabel")} value={contact.organisation} />
            )}
            <SummaryRow label={t("email")} value={contact.email} />
            <SummaryRow label={t("phone")} value={contact.phone} />
            <SummaryRow
              label={t("address")}
              value={`${contact.street}, ${contact.postalCode} ${contact.city}`}
            />
            {contact.remarks && (
              <SummaryRow label={t("remarks")} value={contact.remarks} />
            )}
          </SummarySection>

          {/* Terms + confirm */}
          <form
            action={formAction}
            onSubmit={(e) => {
              if (!acceptTerms) {
                e.preventDefault();
                setTermsError(true);
                return;
              }
            }}
            className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm"
          >
            {/* Hidden fields for server action */}
            <input type="hidden" name="bookingType" value={bookingType} />
            <input type="hidden" name="firstName" value={contact.firstName} />
            <input type="hidden" name="lastName" value={contact.lastName} />
            <input type="hidden" name="email" value={contact.email} />
            <input type="hidden" name="phone" value={contact.phone} />
            <input type="hidden" name="organisation" value={contact.organisation} />
            <input type="hidden" name="street" value={contact.street} />
            <input type="hidden" name="postalCode" value={contact.postalCode} />
            <input type="hidden" name="city" value={contact.city} />
            <input type="hidden" name="arrivalDate" value={isArrangement ? (arrangement?.date ?? "") : (period?.checkIn ?? "")} />
            <input type="hidden" name="departureDate" value={isArrangement ? arrangementDepartureDate : (period?.checkOut ?? "")} />
            <input type="hidden" name="numberOfGuests" value={isArrangement ? (arrangement?.guests ?? 2) : (period?.guests ?? 2)} />
            <input type="hidden" name="guestNote" value={contact.remarks} />
            <input type="hidden" name="totalPrice" value={isArrangement ? (arrangement?.totalPrice ?? 0) : (period?.grandTotal ?? 0)} />
            <input type="hidden" name="paymentOption" value={paymentOption} />
            {isArrangement && arrangement && (
              <>
                <input type="hidden" name="arrangementId" value={arrangement.arrangementId} />
                <input type="hidden" name="arrangementName" value={arrangement.name} />
              </>
            )}

            {/* Payment option */}
            {totalAmount > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <CreditCard size={16} className="text-olive-light" />
                  <h4 className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                    {t("paymentOptionTitle")}
                  </h4>
                </div>
                <div className="space-y-2">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                      paymentOption === "full"
                        ? "border-olive bg-olive/5"
                        : "border-cream-dark hover:border-olive/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOptionRadio"
                      checked={paymentOption === "full"}
                      onChange={() => setPaymentOption("full")}
                      className="h-4 w-4 accent-olive"
                    />
                    <div className="flex-1">
                      <p className="font-[family-name:var(--font-lato)] text-sm font-medium text-olive-dark">
                        {t("payFullAmount")}
                      </p>
                      <p className="font-[family-name:var(--font-lato)] text-xs text-text-muted">
                        &euro;{totalAmount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                      paymentOption === "deposit"
                        ? "border-olive bg-olive/5"
                        : "border-cream-dark hover:border-olive/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOptionRadio"
                      checked={paymentOption === "deposit"}
                      onChange={() => setPaymentOption("deposit")}
                      className="h-4 w-4 accent-olive"
                    />
                    <div className="flex-1">
                      <p className="font-[family-name:var(--font-lato)] text-sm font-medium text-olive-dark">
                        {t("payDeposit")}
                      </p>
                      <p className="font-[family-name:var(--font-lato)] text-xs text-text-muted">
                        &euro;{depositAmount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} ({t("depositPercentage")})
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Terms checkbox */}
            <div className="mb-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (e.target.checked) setTermsError(false);
                  }}
                  disabled={isSubmitting}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-cream-dark text-olive accent-olive focus:ring-olive"
                />
                <span className="font-[family-name:var(--font-lato)] text-sm text-text-muted">
                  {t("termsCheckbox")}{" "}
                  <a href="/algemene-voorwaarden" className="font-medium text-olive-dark underline hover:text-terracotta">
                    {t("termsLabel")}
                  </a>{" "}
                  {t("andThe")}{" "}
                  <a href="/privacybeleid" className="font-medium text-olive-dark underline hover:text-terracotta">
                    {t("privacyLabel")}
                  </a>
                  .
                </span>
              </label>
              {termsError && (
                <p className="mt-1 pl-7 font-[family-name:var(--font-lato)] text-xs text-red-600">
                  {t("termsError")}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => goToStep(3)}
                disabled={isSubmitting}
                className="order-2 font-[family-name:var(--font-lato)] text-sm text-olive-light transition-colors hover:text-terracotta disabled:opacity-50 sm:order-1"
              >
                {t("backToDetails")}
              </button>

              <button
                type="submit"
                disabled={!canConfirm}
                aria-busy={isSubmitting}
                className={`order-1 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all sm:order-2 ${
                  canConfirm
                    ? "bg-terracotta text-white shadow-md hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
                    : "bg-cream-dark/40 text-olive-light/40"
                }`}
              >
                {isSubmitting && (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                )}
                {isSubmitting ? t("submittingBooking") : t("confirmBooking")}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar — compact price overview */}
        <div className="w-full shrink-0 lg:sticky lg:top-6 lg:w-80">
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-xl text-olive-dark">
              {t("priceOverview")}
            </h3>

            <div className="space-y-2">
              {isArrangement && arrangement ? (
                <>
                  <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                    <span>{arrangement.name}</span>
                  </div>
                  <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                    <span>&euro;{arrangement.pricePerPerson.toFixed(2).replace(".", ",")} &times; {arrangement.guests} pers.</span>
                    <span>&euro;{arrangement.totalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-cream-dark pt-2">
                    <span className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">{t("total")}</span>
                    <span className="font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
                      &euro;{arrangement.totalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : period ? (
                <>
                  <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                    <span>{t("stayWithNights", { nights: period.totalNights === 1 ? t("nightSingular") : t("nightPlural", { count: period.totalNights }) })}</span>
                    <span>&euro;{period.totalPrice.toLocaleString("nl-NL")}</span>
                  </div>
                  <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                    <span>{t("finalCleaning")}</span>
                    <span>&euro;{period.additionalCosts.cleaning.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                    <span>{t("bedLinen", { guests: period.guests })}</span>
                    <span>&euro;{period.additionalCosts.linen.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                    <span>{t("energy")}</span>
                    <span>&euro;{period.additionalCosts.energy.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                    <span>{t("avgTaxes")}</span>
                    <span>&euro;{period.additionalCosts.tax.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-cream-dark pt-2">
                    <span className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">{t("total")}</span>
                    <span className="font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
                      &euro;{period.grandTotal.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Summary section component ─────────────────────────────────

function SummarySection({
  title,
  editLabel,
  onEdit,
  children,
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg text-olive-dark">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 font-[family-name:var(--font-lato)] text-xs font-medium text-terracotta transition-colors hover:text-terracotta-dark"
        >
          <Pencil size={12} />
          {editLabel}
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-[family-name:var(--font-lato)] text-sm text-text-muted">
        {label}
      </span>
      <span className="text-right font-[family-name:var(--font-lato)] text-sm font-medium text-olive-dark">
        {value}
      </span>
    </div>
  );
}
