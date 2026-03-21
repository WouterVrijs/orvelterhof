import { useState, useEffect, useCallback, useRef } from "react";
import type { AvailabilityCheckStatus } from "@/lib/availability/types";
import type { AvailabilityResult } from "@/lib/availability/types";
import { checkAvailabilityAction } from "@/lib/availability/actions";

/** Delay before triggering the availability check after dates change. */
const DEBOUNCE_MS = 300;

interface UseAvailabilityCheckReturn {
  /** Current status of the availability check. */
  availabilityStatus: AvailabilityCheckStatus;
  /** Human-readable reason when unavailable or invalid. */
  availabilityReason: string | null;
  /** The full result from the last check, if any. */
  lastResult: AvailabilityResult | null;
  /** Manually trigger a re-check (bypasses debounce). */
  recheckAvailability: () => void;
}

/**
 * Hook that automatically checks availability when both dates are present
 * and valid (checkIn < checkOut).
 *
 * Improvements over a naive implementation:
 * - **Debounce**: waits 300ms after the last date change before firing
 * - **Request versioning**: only the most recent response updates the UI
 * - **Immediate reset**: clears stale results as soon as dates change
 */
export function useAvailabilityCheck(
  checkIn: string | null,
  checkOut: string | null,
): UseAvailabilityCheckReturn {
  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityCheckStatus>("idle");
  const [availabilityReason, setAvailabilityReason] = useState<string | null>(
    null,
  );
  const [lastResult, setLastResult] = useState<AvailabilityResult | null>(null);

  // Track the current request to handle race conditions
  const requestIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performCheck = useCallback(
    async (arrival: string, departure: string) => {
      const currentId = ++requestIdRef.current;

      setAvailabilityStatus("checking");
      setAvailabilityReason(null);

      try {
        const result = await checkAvailabilityAction(arrival, departure);

        // Ignore stale responses (a newer check was triggered)
        if (currentId !== requestIdRef.current) return;

        setLastResult(result);

        switch (result.status) {
          case "available":
            setAvailabilityStatus("available");
            setAvailabilityReason(null);
            break;
          case "unavailable":
            setAvailabilityStatus("unavailable");
            setAvailabilityReason(
              result.reason ?? "Deze periode is niet beschikbaar.",
            );
            break;
          case "invalid_request":
            setAvailabilityStatus("invalid");
            setAvailabilityReason(result.reason ?? "Ongeldige invoer.");
            break;
          case "error":
            setAvailabilityStatus("error");
            setAvailabilityReason(
              result.reason ?? "We kunnen de beschikbaarheid nu even niet controleren.",
            );
            break;
        }
      } catch {
        if (currentId !== requestIdRef.current) return;

        setAvailabilityStatus("error");
        setAvailabilityReason(
          "We kunnen de beschikbaarheid nu even niet controleren. Probeer het opnieuw.",
        );
        setLastResult(null);
      }
    },
    [],
  );

  // Auto-trigger with debounce when both dates are present and valid
  useEffect(() => {
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!checkIn || !checkOut) {
      // Reset to idle when selection is incomplete — immediately clears stale state
      // Increment requestId to invalidate any in-flight request
      requestIdRef.current++;
      setAvailabilityStatus("idle");
      setAvailabilityReason(null);
      setLastResult(null);
      return;
    }

    // Only check if departure is after arrival
    if (checkOut <= checkIn) return;

    // Immediately show checking state so the user sees instant feedback,
    // but debounce the actual network call
    setAvailabilityStatus("checking");
    setAvailabilityReason(null);

    debounceRef.current = setTimeout(() => {
      performCheck(checkIn, checkOut);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [checkIn, checkOut, performCheck]);

  const recheckAvailability = useCallback(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return;
    // Bypass debounce for manual retry
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    performCheck(checkIn, checkOut);
  }, [checkIn, checkOut, performCheck]);

  return {
    availabilityStatus,
    availabilityReason,
    lastResult,
    recheckAvailability,
  };
}
