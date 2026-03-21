"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { DayStatus } from "./types";
import { useBookingState } from "./useBookingState";
import { bookingConfig } from "./bookingConfig";
import CalendarMonth from "./CalendarMonth";
import BookingSummary from "./BookingSummary";
import BookingStepIndicator from "./BookingStepIndicator";
import BookingTypeSelector from "./BookingTypeSelector";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface BookingCalendarProps {
  availabilityData: DayStatus[];
  initialCheckIn?: string | null;
  initialCheckOut?: string | null;
  initialGuests?: number;
  onTypeChange?: (type: import("./bookingFlowTypes").BookingType) => void;
}

export default function BookingCalendar({
  availabilityData,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  onTypeChange,
}: BookingCalendarProps) {
  const router = useRouter();
  const t = useTranslations("bookingModule");
  const now = new Date();

  const startMonth = initialCheckIn
    ? parseInt(initialCheckIn.split("-")[1], 10) - 1
    : now.getMonth();
  const startYear = initialCheckIn
    ? parseInt(initialCheckIn.split("-")[0], 10)
    : now.getFullYear();

  const [baseMonth, setBaseMonth] = useState(startMonth);
  const [baseYear, setBaseYear] = useState(startYear);

  const {
    selection,
    phase,
    guests,
    setGuests,
    validationError,
    handleDateClick,
    handleHover,
    isInRange,
    isRangeStart,
    isRangeEnd,
    isDateSelectable,
    getDayRenderStatus,
    totalNights,
    hoverNights,
    totalPrice,
    avgPricePerNight,
    additionalCosts,
    grandTotal,
    confirmSelection,
    isConfirming,
    clearSelection,
    statusMap,
    selectionHint,
    availabilityStatus,
    availabilityReason,
    recheckAvailability,
  } = useBookingState(availabilityData, {
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests,
  });

  const isComplete = phase === "complete";
  const hasSelection = selection.checkIn !== null;

  // Max navigable month — from config
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + bookingConfig.horizonMonths);
    return d;
  }, []);

  const canGoBack =
    baseYear > now.getFullYear() ||
    (baseYear === now.getFullYear() && baseMonth > now.getMonth());

  const secondMonth = baseMonth === 11 ? 0 : baseMonth + 1;
  const secondYear = baseMonth === 11 ? baseYear + 1 : baseYear;
  const canGoForward =
    secondYear < maxDate.getFullYear() ||
    (secondYear === maxDate.getFullYear() &&
      secondMonth < maxDate.getMonth());

  // Navigation label: "Maart — April 2026" or "December 2025 — Januari 2026"
  const navLabel =
    baseYear === secondYear
      ? `${t(`monthNames.${baseMonth}`)} \u2014 ${t(`monthNames.${secondMonth}`)} ${baseYear}`
      : `${t(`monthNames.${baseMonth}`)} ${baseYear} \u2014 ${t(`monthNames.${secondMonth}`)} ${secondYear}`;

  // Translated night count label
  const nightLabel = totalNights === 1 ? t("nightSingular") : t("nightPlural", { count: totalNights });

  // Phase-aware hint text below the calendar
  const calendarHint =
    phase === "selectCheckIn"
      ? t("selectCheckInHint")
      : phase === "selectCheckOut"
        ? t("selectCheckOutHint", { minNights: bookingConfig.minNights })
        : t("nightsSelected", { nights: nightLabel });

  function goBack() {
    if (!canGoBack) return;
    if (baseMonth === 0) {
      setBaseMonth(11);
      setBaseYear(baseYear - 1);
    } else {
      setBaseMonth(baseMonth - 1);
    }
  }

  function goForward() {
    if (!canGoForward) return;
    if (baseMonth === 11) {
      setBaseMonth(0);
      setBaseYear(baseYear + 1);
    } else {
      setBaseMonth(baseMonth + 1);
    }
  }

  async function handleConfirm() {
    const result = await confirmSelection();
    if (result.valid && selection.checkIn && selection.checkOut) {
      // Pass confirmed state to next step via URL params.
      // This ensures state survives navigation and can be bookmarked/shared.
      const params = new URLSearchParams({
        aankomst: selection.checkIn,
        vertrek: selection.checkOut,
        personen: String(guests),
        stap: "2",
      });
      router.push(`/boeken?${params.toString()}`);
    }
  }

  // Mobile bar status text
  const mobileStatusText = isConfirming
    ? t("confirmingAvailability")
    : availabilityStatus === "checking"
      ? t("checkingAvailability")
      : availabilityStatus === "available"
        ? t("totalPrice", { price: grandTotal.toLocaleString("nl-NL", { minimumFractionDigits: 2 }) })
        : availabilityStatus === "unavailable"
          ? t("unfortunatelyUnavailable")
          : availabilityStatus === "error"
            ? t("checkFailed")
            : t("totalPrice", { price: grandTotal.toLocaleString("nl-NL", { minimumFractionDigits: 2 }) });

  // Mobile bar CTA text
  const mobileCta = isConfirming
    ? t("confirming")
    : availabilityStatus === "checking"
      ? t("checking")
      : availabilityStatus === "available"
        ? t("proceed")
        : availabilityStatus === "unavailable"
          ? t("unavailable")
          : availabilityStatus === "error"
            ? t("tryAgain")
            : t("proceed");

  const mobileCtaDisabled = availabilityStatus !== "available" || isConfirming;
  const showMobileSpinner = availabilityStatus === "checking" || isConfirming;

  return (
    <>
      <BookingStepIndicator currentStep={1} />

      {onTypeChange && (
        <BookingTypeSelector value="verblijf" onChange={onTypeChange} />
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Calendar section */}
        <div className="min-w-0 flex-1 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          {/* Section heading — frames this as step 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive font-[family-name:var(--font-lato)] text-sm font-bold text-white">
                1
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark md:text-2xl">
                {t("chooseYourPeriod")}
              </h2>
            </div>
            <p className="mt-2 pl-11 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-text-muted">
              {t("chooseYourPeriodDescription")}
            </p>
          </div>
          {/* Month navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                canGoBack
                  ? "border-cream-dark text-olive hover:border-olive hover:bg-olive hover:text-white"
                  : "cursor-not-allowed border-transparent text-[#ddd]"
              }`}
              aria-label={t("previousMonth")}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="font-[family-name:var(--font-playfair)] text-base text-olive-dark md:text-lg">
              {navLabel}
            </span>

            <button
              type="button"
              onClick={goForward}
              disabled={!canGoForward}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                canGoForward
                  ? "border-cream-dark text-olive hover:border-olive hover:bg-olive hover:text-white"
                  : "cursor-not-allowed border-transparent text-[#ddd]"
              }`}
              aria-label={t("nextMonth")}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Month grids */}
          <div className="flex flex-col gap-8 md:flex-row md:gap-6">
            <CalendarMonth
              year={baseYear}
              month={baseMonth}
              statusMap={statusMap}
              getDayRenderStatus={getDayRenderStatus}
              isDateSelectable={isDateSelectable}
              isInRange={isInRange}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              onDateClick={handleDateClick}
              onDateHover={handleHover}
            />
            <CalendarMonth
              year={secondYear}
              month={secondMonth}
              statusMap={statusMap}
              getDayRenderStatus={getDayRenderStatus}
              isDateSelectable={isDateSelectable}
              isInRange={isInRange}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              onDateClick={handleDateClick}
              onDateHover={handleHover}
            />
          </div>

          {/* Phase-aware hint */}
          <p className="mt-4 text-center font-[family-name:var(--font-lato)] text-xs text-text-muted">
            {calendarHint}
          </p>
        </div>

        {/* Booking summary sidebar */}
        <div className="w-full shrink-0 lg:sticky lg:top-6 lg:w-80">
          <BookingSummary
            checkIn={selection.checkIn}
            checkOut={selection.checkOut}
            phase={phase}
            guests={guests}
            setGuests={setGuests}
            totalNights={totalNights}
            hoverNights={hoverNights}
            totalPrice={totalPrice}
            avgPricePerNight={avgPricePerNight}
            additionalCosts={additionalCosts}
            grandTotal={grandTotal}
            validationError={validationError}
            selectionHint={selectionHint}
            availabilityStatus={availabilityStatus}
            availabilityReason={availabilityReason}
            isConfirming={isConfirming}
            onConfirm={handleConfirm}
            onClear={clearSelection}
            onRetry={recheckAvailability}
          />
        </div>
      </div>

      {/* Sticky mobile CTA bar — always visible on mobile for guidance */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-cream-dark bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          {isComplete ? (
            <>
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                  {nightLabel}
                </p>
                <p className="font-[family-name:var(--font-lato)] text-xs text-text-muted">
                  {mobileStatusText}
                </p>
              </div>
              <button
                type="button"
                disabled={mobileCtaDisabled}
                onClick={!mobileCtaDisabled ? handleConfirm : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full px-6 py-3 font-[family-name:var(--font-lato)] text-sm font-bold shadow-sm transition-all ${
                  !mobileCtaDisabled
                    ? "bg-terracotta text-white hover:bg-terracotta-dark hover:shadow-md"
                    : "bg-cream-dark/50 text-olive-light/50"
                }`}
              >
                {showMobileSpinner && (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                )}
                {mobileCta}
              </button>
            </>
          ) : hasSelection ? (
            <p className="w-full text-center font-[family-name:var(--font-lato)] text-sm text-olive-light">
              {t("selectDepartureDate")}
            </p>
          ) : (
            <p className="w-full text-center font-[family-name:var(--font-lato)] text-sm text-olive-light">
              {t("selectArrivalInCalendar")}
            </p>
          )}
        </div>
      </div>

      {/* Bottom spacer to prevent content hiding behind sticky bar on mobile */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}
