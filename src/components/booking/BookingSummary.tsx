"use client";

import type { SelectionPhase } from "./types";
import type { AdditionalCosts } from "./bookingFlowTypes";
import type { AvailabilityCheckStatus } from "@/lib/availability/types";
import { formatDisplayDate } from "./dateUtils";
import { useTranslations } from "next-intl";
import AvailabilityStatusMessage from "./AvailabilityStatusMessage";
import { Loader2 } from "lucide-react";

interface BookingSummaryProps {
  checkIn: string | null;
  checkOut: string | null;
  phase: SelectionPhase;
  guests: number;
  setGuests: (n: number) => void;
  totalNights: number;
  hoverNights: number;
  totalPrice: number;
  avgPricePerNight: number;
  additionalCosts: AdditionalCosts | null;
  grandTotal: number;
  validationError: string | null;
  selectionHint: string | null;
  availabilityStatus: AvailabilityCheckStatus;
  availabilityReason: string | null;
  isConfirming: boolean;
  onConfirm: () => void;
  onClear: () => void;
  onRetry: () => void;
}

/** Dot class per phase (no translated text — labels come from `t()`). */
const DOT_CLASS: Record<SelectionPhase, string> = {
  selectCheckIn: "animate-pulse bg-terracotta",
  selectCheckOut: "animate-pulse bg-terracotta",
  complete: "bg-[#5a9a5a]",
};

export default function BookingSummary({
  checkIn,
  checkOut,
  phase,
  guests,
  setGuests,
  totalNights,
  hoverNights,
  totalPrice,
  avgPricePerNight,
  additionalCosts,
  grandTotal,
  validationError,
  selectionHint,
  availabilityStatus,
  availabilityReason,
  isConfirming,
  onConfirm,
  onClear,
  onRetry,
}: BookingSummaryProps) {
  const t = useTranslations("bookingModule");
  const hasSelection = checkIn !== null;
  const isComplete = phase === "complete";
  const isAvailable = availabilityStatus === "available";
  const isChecking = availabilityStatus === "checking";
  const canProceed = isComplete && isAvailable && !isConfirming;

  /** Phase-aware step label from translations. */
  const stepLabel =
    phase === "selectCheckIn"
      ? t("stepSelectArrival")
      : phase === "selectCheckOut"
        ? t("stepSelectDeparture")
        : t("stepPeriodSelected");

  /** CTA button label per availability state (complete phase only). */
  function getCtaLabel(): string {
    if (phase !== "complete") {
      return phase === "selectCheckIn"
        ? t("selectArrivalDate")
        : t("selectDepartureDateCta");
    }
    if (isConfirming) return t("confirmingAvailability");
    switch (availabilityStatus) {
      case "checking":
        return t("checkingAvailability");
      case "available":
        return t("proceedWithBooking");
      case "unavailable":
        return t("unavailable");
      case "error":
        return t("checkingFailed");
      case "invalid":
        return t("invalidSelection");
      default:
        return t("proceedWithBooking");
    }
  }

  const ctaLabel = getCtaLabel();
  const dotClass = DOT_CLASS[phase];

  const nightLabel = totalNights === 1 ? t("nightSingular") : t("nightPlural", { count: totalNights });
  const hoverNightLabel = hoverNights === 1 ? t("nightSingular") : t("nightPlural", { count: hoverNights });

  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
      {/* Sidebar heading */}
      <h3 className="mb-1 font-[family-name:var(--font-playfair)] text-xl text-olive-dark">
        {t("yourStay")}
      </h3>
      <p className="mb-5 font-[family-name:var(--font-lato)] text-xs text-text-muted">
        {t("orvelterHofCapacity")}
      </p>

      {/* Step indicator */}
      <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-[#fbf8f6] px-4 py-2.5">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`}
        />
        <span className="font-[family-name:var(--font-lato)] text-xs font-medium text-olive-light">
          {stepLabel}
        </span>
      </div>

      {/* Selection hint (transient feedback) */}
      {selectionHint && !validationError && (
        <div className="mb-5 rounded-xl bg-cream px-4 py-3">
          <p className="font-[family-name:var(--font-lato)] text-xs font-medium text-olive-light">
            {selectionHint}
          </p>
        </div>
      )}

      {/* Validation error */}
      {validationError && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
          <p className="font-[family-name:var(--font-lato)] text-xs font-medium text-red-700">
            {validationError}
          </p>
        </div>
      )}

      {/* Dates */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div
          className={`rounded-xl p-3 transition-all ${
            phase === "selectCheckIn"
              ? "bg-[#5a625f]/8 ring-1 ring-[#5a625f]/20"
              : "bg-[#fbf8f6]"
          }`}
        >
          <span className="block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-olive-light">
            {t("arrival")}
          </span>
          <span
            className={`mt-1 block font-[family-name:var(--font-lato)] text-sm ${
              checkIn ? "text-text-dark" : "text-[#c5c2bc]"
            }`}
          >
            {formatDisplayDate(checkIn)}
          </span>
        </div>
        <div
          className={`rounded-xl p-3 transition-all ${
            phase === "selectCheckOut"
              ? "bg-[#5a625f]/8 ring-1 ring-[#5a625f]/20"
              : "bg-[#fbf8f6]"
          }`}
        >
          <span className="block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-olive-light">
            {t("departure")}
          </span>
          <span
            className={`mt-1 block font-[family-name:var(--font-lato)] text-sm ${
              checkOut ? "text-text-dark" : "text-[#c5c2bc]"
            }`}
          >
            {formatDisplayDate(checkOut)}
          </span>
        </div>
      </div>

      {/* Night count */}
      {(totalNights > 0 || hoverNights > 0) && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-[#fbf8f6] px-4 py-3">
          <span className="font-[family-name:var(--font-playfair)] text-lg text-olive-dark">
            {totalNights > 0 ? nightLabel : hoverNightLabel}
          </span>
          {hoverNights > 0 && totalNights === 0 && (
            <span className="font-[family-name:var(--font-lato)] text-xs text-text-muted">
              {t("preview")}
            </span>
          )}
        </div>
      )}

      {/* Availability status */}
      <AvailabilityStatusMessage
        status={availabilityStatus}
        reason={availabilityReason}
        onRetry={onRetry}
      />

      {/* Guests */}
      <div className="mb-5">
        <label
          htmlFor="booking-guests"
          className="mb-1.5 block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-olive-light"
        >
          {t("numberOfPersons")}
        </label>
        <select
          id="booking-guests"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-xl border border-cream-dark bg-[#fbf8f6] px-4 py-2.5 font-[family-name:var(--font-lato)] text-sm text-text-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
        >
          {Array.from({ length: 35 }, (_, i) => i + 2).map((n) => (
            <option key={n} value={n}>
              {t("personsCount", { count: n })}
            </option>
          ))}
        </select>
      </div>

      {/* Price breakdown */}
      {isComplete && (
        <div className="mb-5 space-y-2 border-t border-cream-dark pt-4">
          {/* Accommodation */}
          <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
            <span>
              {t("stayPriceLabel", { pricePerNight: avgPricePerNight, nights: nightLabel })}
            </span>
            <span>&euro;{totalPrice.toLocaleString("nl-NL")}</span>
          </div>

          {/* Additional costs */}
          {additionalCosts && (
            <>
              <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                <span>{t("finalCleaning")}</span>
                <span>&euro;{additionalCosts.cleaning.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                <span>{t("bedLinen", { guests })}</span>
                <span>&euro;{additionalCosts.linen.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                <span>{t("energyWithDetails", { guests, nights: totalNights })}</span>
                <span>&euro;{additionalCosts.energy.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                <span>{t("avgTaxesWithDetails", { guests, nights: totalNights })}</span>
                <span>&euro;{additionalCosts.tax.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          )}

          {/* Grand total */}
          <div className="flex items-baseline justify-between border-t border-cream-dark pt-2">
            <span className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
              {t("total")}
            </span>
            <span className="font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
              &euro;{grandTotal.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        disabled={!canProceed}
        onClick={canProceed ? onConfirm : undefined}
        aria-busy={isConfirming}
        className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all ${
          canProceed
            ? "bg-terracotta text-white shadow-md hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
            : isComplete && (isChecking || isConfirming)
              ? "bg-cream-dark/50 text-olive-light/60"
              : "bg-cream-dark/40 text-olive-light/40"
        }`}
      >
        {(isChecking || isConfirming) && (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        )}
        {ctaLabel}
      </button>

      {/* Clear */}
      {hasSelection && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 w-full text-center font-[family-name:var(--font-lato)] text-xs text-olive-light transition-colors hover:text-terracotta"
        >
          {t("clearSelection")}
        </button>
      )}

    </div>
  );
}
