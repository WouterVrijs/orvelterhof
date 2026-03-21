import { useState, useCallback, useMemo, useRef } from "react";
import type {
  DayStatus,
  DayRenderStatus,
  SelectedRange,
  SelectionPhase,
} from "./types";
import { bookingConfig } from "./bookingConfig";
import {
  todayISO,
  toDate,
  daysBetween,
  dateRange,
  addMonths,
  getNightCount,
} from "./dateUtils";
import {
  validateRange,
  findFirstBookedAfter,
  type ValidationResult,
} from "./availabilityService";
import { useAvailabilityCheck } from "./useAvailabilityCheck";
import { confirmAvailabilityAction } from "@/lib/availability/actions";

// ── Hook ──────────────────────────────────────────────────────

interface InitialValues {
  checkIn?: string | null;
  checkOut?: string | null;
  guests?: number;
}

export function useBookingState(
  availabilityData: DayStatus[],
  initial?: InitialValues,
) {
  const [selection, setSelection] = useState<SelectedRange>({
    checkIn: initial?.checkIn ?? null,
    checkOut: initial?.checkOut ?? null,
  });
  const [guests, setGuests] = useState(initial?.guests ?? bookingConfig.minGuests);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectionHint, setSelectionHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Show a transient hint that auto-clears after 4 seconds. */
  const showHint = useCallback((msg: string) => {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setSelectionHint(msg);
    hintTimer.current = setTimeout(() => setSelectionHint(null), 4000);
  }, []);

  // ── Derived constants ─────────────────────────────────────

  const today = useMemo(() => todayISO(), []);

  const horizonEnd = useMemo(
    () => addMonths(new Date(), bookingConfig.horizonMonths),
    [],
  );

  const phase: SelectionPhase = useMemo(() => {
    if (!selection.checkIn) return "selectCheckIn";
    if (!selection.checkOut) return "selectCheckOut";
    return "complete";
  }, [selection]);

  // ── Status map ────────────────────────────────────────────

  const statusMap = useMemo(() => {
    const map = new Map<string, DayStatus>();
    for (const d of availabilityData) {
      map.set(d.date, d);
    }
    return map;
  }, [availabilityData]);

  // ── Maximum checkout boundary ─────────────────────────────
  // When the user has selected a check-in, we find the first booked
  // date after it. The user cannot select checkout on or after that date.

  const maxCheckoutDate = useMemo(() => {
    if (!selection.checkIn) return null;
    return findFirstBookedAfter(selection.checkIn, statusMap, horizonEnd);
  }, [selection.checkIn, statusMap, horizonEnd]);

  // ── Selectability logic ───────────────────────────────────

  /**
   * Compute the render status for a date.
   * This is the single source of truth for both selectability and visuals.
   */
  const getDayRenderStatus = useCallback(
    (date: string): DayRenderStatus => {
      // Past dates
      if (date < today) return "past";

      // Beyond horizon
      if (date > horizonEnd) return "outside_horizon";

      // No data for this date
      const info = statusMap.get(date);
      if (!info) return "no_data";

      // Booked dates are occupied
      if (info.status === "booked") return "occupied";

      // During checkout phase: check if this date would create an invalid range
      if (
        phase === "selectCheckOut" &&
        selection.checkIn &&
        date !== selection.checkIn
      ) {
        const nights = daysBetween(selection.checkIn, date);

        // Dates before check-in are still selectable (they restart as new check-in)
        // So we only block dates that are AFTER check-in but unreachable as checkout
        if (nights > 0) {
          // Too few nights
          if (nights < bookingConfig.minNights) return "blocked_for_checkout";

          // Max nights exceeded
          if (bookingConfig.maxNights > 0 && nights > bookingConfig.maxNights)
            return "blocked_for_checkout";

          // Would cross a booked date
          if (maxCheckoutDate && date >= maxCheckoutDate)
            return "blocked_for_checkout";
        }
      }

      // Discount
      if (info.status === "discount") return "discount";

      // Default: available (includes "arrival", "departure" which are selectable)
      return "available";
    },
    [today, horizonEnd, statusMap, phase, selection.checkIn, maxCheckoutDate],
  );

  /** Whether a date can be clicked. */
  const isDateSelectable = useCallback(
    (date: string): boolean => {
      const status = getDayRenderStatus(date);
      return (
        status === "available" ||
        status === "discount"
      );
    },
    [getDayRenderStatus],
  );

  // ── Range checking ────────────────────────────────────────

  const hasBookedDayInRange = useCallback(
    (start: string, end: string): boolean => {
      const dates = dateRange(start, end);
      for (let i = 1; i < dates.length - 1; i++) {
        const info = statusMap.get(dates[i]);
        if (info && info.status === "booked") return true;
      }
      return false;
    },
    [statusMap],
  );

  // ── Click handler ─────────────────────────────────────────

  const handleDateClick = useCallback(
    (date: string) => {
      if (!isDateSelectable(date)) return;

      // Clear any previous validation error on new interaction
      setValidationError(null);
      setSelectionHint(null);

      // Phase: no check-in yet, or selection is already complete → start fresh
      if (phase === "selectCheckIn" || phase === "complete") {
        setSelection({ checkIn: date, checkOut: null });
        setHoverDate(null);
        return;
      }

      // Phase: selecting check-out
      const nights = daysBetween(selection.checkIn!, date);

      // Clicked same date as checkIn, or a date before checkIn → restart
      if (nights <= 0) {
        setSelection({ checkIn: date, checkOut: null });
        setHoverDate(null);
        showHint("Nieuwe aankomstdatum geselecteerd");
        return;
      }

      // Too few nights → restart with this date
      if (nights < bookingConfig.minNights) {
        setSelection({ checkIn: date, checkOut: null });
        setHoverDate(null);
        showHint(`Minimaal ${bookingConfig.minNights} nachten vereist — nieuwe aankomstdatum geselecteerd`);
        return;
      }

      // Booked day within range → restart
      if (hasBookedDayInRange(selection.checkIn!, date)) {
        setSelection({ checkIn: date, checkOut: null });
        setHoverDate(null);
        showHint("Er ligt een bezette datum in de weg — nieuwe aankomstdatum geselecteerd");
        return;
      }

      // Valid checkout
      setSelection({ checkIn: selection.checkIn, checkOut: date });
      setHoverDate(null);
    },
    [phase, selection, isDateSelectable, hasBookedDayInRange, showHint],
  );

  // ── Hover handler ─────────────────────────────────────────

  const handleHover = useCallback(
    (date: string | null) => {
      if (phase !== "selectCheckOut") {
        if (hoverDate !== null) setHoverDate(null);
        return;
      }
      setHoverDate(date);
    },
    [phase, hoverDate],
  );

  // ── Range queries for rendering ───────────────────────────

  const isHoverRangeValid = useMemo(() => {
    if (phase !== "selectCheckOut" || !selection.checkIn || !hoverDate)
      return false;
    const nights = daysBetween(selection.checkIn, hoverDate);
    if (nights < bookingConfig.minNights) return false;
    if (hasBookedDayInRange(selection.checkIn, hoverDate)) return false;
    // Check it doesn't cross the max checkout boundary
    if (maxCheckoutDate && hoverDate >= maxCheckoutDate) return false;
    return true;
  }, [phase, selection.checkIn, hoverDate, hasBookedDayInRange, maxCheckoutDate]);

  const isInRange = useCallback(
    (date: string): boolean => {
      if (!selection.checkIn) return false;

      if (selection.checkOut) {
        const d = toDate(date);
        return (
          d >= toDate(selection.checkIn) && d <= toDate(selection.checkOut)
        );
      }

      if (isHoverRangeValid && hoverDate) {
        const d = toDate(date);
        return (
          d >= toDate(selection.checkIn) && d <= toDate(hoverDate)
        );
      }

      return date === selection.checkIn;
    },
    [selection, hoverDate, isHoverRangeValid],
  );

  const isRangeStart = useCallback(
    (date: string): boolean => date === selection.checkIn,
    [selection.checkIn],
  );

  const isRangeEnd = useCallback(
    (date: string): boolean => {
      if (selection.checkOut) return date === selection.checkOut;
      if (isHoverRangeValid && hoverDate) return date === hoverDate;
      return false;
    },
    [selection.checkOut, hoverDate, isHoverRangeValid],
  );

  // ── Computed values ───────────────────────────────────────

  const totalNights = useMemo(
    () => getNightCount(selection.checkIn, selection.checkOut),
    [selection],
  );

  /** Preview night count while hovering during checkout selection. */
  const hoverNights = useMemo(() => {
    if (!isHoverRangeValid || !selection.checkIn || !hoverDate) return 0;
    return getNightCount(selection.checkIn, hoverDate);
  }, [isHoverRangeValid, selection.checkIn, hoverDate]);

  const totalPrice = useMemo(() => {
    if (!selection.checkIn || !selection.checkOut) return 0;
    const dates = dateRange(selection.checkIn, selection.checkOut);
    let sum = 0;
    for (let i = 0; i < dates.length - 1; i++) {
      const info = statusMap.get(dates[i]);
      sum += info?.price ?? 75;
    }
    return sum;
  }, [selection, statusMap]);

  const avgPricePerNight = useMemo(() => {
    if (totalNights === 0) return 0;
    return Math.round(totalPrice / totalNights);
  }, [totalPrice, totalNights]);

  // ── Bijkomende kosten ───────────────────────────────────────

  const additionalCosts = useMemo(() => {
    if (totalNights === 0) return null;
    const cleaning = bookingConfig.cleaningFee;
    const linen = Math.round(bookingConfig.linenPerPerson * guests * 100) / 100;
    const energy =
      Math.round(bookingConfig.energyPerPersonPerNight * guests * totalNights * 100) / 100;
    const tax =
      Math.round(bookingConfig.taxPerPersonPerNight * guests * totalNights * 100) / 100;
    const subtotal = Math.round((cleaning + linen + energy + tax) * 100) / 100;
    return { cleaning, linen, energy, tax, subtotal };
  }, [totalNights, guests]);

  const grandTotal = useMemo(() => {
    if (!additionalCosts) return totalPrice;
    return Math.round((totalPrice + additionalCosts.subtotal) * 100) / 100;
  }, [totalPrice, additionalCosts]);

  // ── Server-side availability check (auto-triggered) ──────────

  const {
    availabilityStatus,
    availabilityReason,
    recheckAvailability,
  } = useAvailabilityCheck(selection.checkIn, selection.checkOut);

  // ── Confirming state ─────────────────────────────────────────
  const [isConfirming, setIsConfirming] = useState(false);

  // ── Final validation (called before proceeding to next step) ─
  //
  // This is async because it performs a FRESH server-side re-check.
  // The earlier auto-check result is informational only — this is
  // the definitive gate before proceeding.

  const confirmSelection = useCallback(async (): Promise<ValidationResult> => {
    // 1. Client-side pre-check (fast, catches obvious issues)
    const clientResult = validateRange(selection, statusMap, bookingConfig.minNights);
    if (!clientResult.valid) {
      setValidationError(clientResult.reason ?? "Ongeldige selectie.");
      return clientResult;
    }

    if (!selection.checkIn || !selection.checkOut) {
      setValidationError("Selecteer een aankomst- en vertrekdatum.");
      return { valid: false, reason: "Selectie incompleet." };
    }

    // 2. Definitive server-side re-check
    //    The backend is the source of truth. We never trust the cached
    //    availability status from the auto-check — availability may have
    //    changed between the initial check and the confirm click.
    setIsConfirming(true);
    setValidationError(null);

    try {
      const serverResult = await confirmAvailabilityAction(
        selection.checkIn,
        selection.checkOut,
      );

      switch (serverResult.status) {
        case "available":
          setValidationError(null);
          return { valid: true };

        case "unavailable":
          setValidationError(
            serverResult.reason ??
              "Deze periode is helaas net niet meer beschikbaar. Kies een andere periode.",
          );
          return {
            valid: false,
            reason: serverResult.reason ?? "Niet meer beschikbaar.",
          };

        case "invalid_request":
          setValidationError(
            serverResult.reason ?? "De gekozen data zijn niet geldig.",
          );
          return {
            valid: false,
            reason: serverResult.reason ?? "Ongeldige selectie.",
          };

        case "error":
          setValidationError(
            serverResult.reason ??
              "We konden de beschikbaarheid niet bevestigen. Probeer het opnieuw.",
          );
          return {
            valid: false,
            reason: serverResult.reason ?? "Bevestiging mislukt.",
          };

        default:
          setValidationError("Er is een onverwachte fout opgetreden.");
          return { valid: false, reason: "Onverwachte fout." };
      }
    } catch {
      // Network error or unexpected failure — the server action's own
      // try/catch should prevent this, but we handle it as a safety net.
      setValidationError(
        "Er is een fout opgetreden bij het bevestigen. Controleer uw verbinding en probeer het opnieuw.",
      );
      return { valid: false, reason: "Verbindingsfout." };
    } finally {
      setIsConfirming(false);
    }
  }, [selection, statusMap]);

  // ── Clear ─────────────────────────────────────────────────

  const clearSelection = useCallback(() => {
    setSelection({ checkIn: null, checkOut: null });
    setHoverDate(null);
    setValidationError(null);
    setSelectionHint(null);
  }, []);

  return {
    selection,
    phase,
    guests,
    setGuests,
    hoverDate,
    validationError,
    selectionHint,
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
    horizonEnd,
    availabilityStatus,
    availabilityReason,
    recheckAvailability,
  };
}
