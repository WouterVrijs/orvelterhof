"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingCalendar from "@/components/booking";
import TravelPartyStep from "@/components/booking/TravelPartyStep";
import BookingUpgrades from "@/components/booking/BookingUpgrades";
import BookingDetails from "@/components/booking/BookingDetails";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import ArrangementPicker from "@/components/booking/ArrangementPicker";
import { generateMockData } from "@/components/booking/mockData";
import { getNightCount } from "@/components/booking/dateUtils";
import type { DayStatus } from "@/components/booking/types";
import type { PricingData } from "@/lib/pricing/types";
import { calculateCostItemTotal } from "@/lib/pricing/types";
import type {
  BookingType,
  BookingPeriod,
  BookingFlowStep,
  BookingUpgrades as BookingUpgradesType,
  ContactDetails,
  SelectedArrangement,
} from "@/components/booking/bookingFlowTypes";
import { EMPTY_UPGRADES } from "@/components/booking/bookingFlowTypes";

const CONTACT_STORAGE_KEY = "orvelterhof_booking_contact";

interface BookingCalendarWrapperProps {
  apiCalendarData: DayStatus[] | null;
  pricingData: PricingData;
}

/**
 * Wrapper that routes between booking flow steps based on URL params.
 *
 * Supports two booking types:
 * - "verblijf" (default): date range → upgrades → gegevens → bevestigen
 * - "arrangement": arrangement picker → gegevens → bevestigen (skips upgrades)
 */
export default function BookingCalendarWrapper({
  apiCalendarData,
  pricingData,
}: BookingCalendarWrapperProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const data = useMemo(
    () => apiCalendarData ?? generateMockData(),
    [apiCalendarData],
  );

  // ── URL params ──────────────────────────────────────────────
  const bookingType: BookingType =
    searchParams.get("type") === "arrangement" ? "arrangement" : "verblijf";
  const aankomst = searchParams.get("aankomst");
  const vertrek = searchParams.get("vertrek");
  const personen = searchParams.get("personen");
  const datum = searchParams.get("datum"); // single date for arrangements
  const stap = searchParams.get("stap");

  const guestCount = personen ? parseInt(personen, 10) : 2;

  // ── Arrangement data from URL ───────────────────────────────
  const arrangement: SelectedArrangement | null = useMemo(() => {
    const raw = searchParams.get("arrangement");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SelectedArrangement;
    } catch {
      return null;
    }
  }, [searchParams]);

  // ── Step routing ────────────────────────────────────────────
  // For arrangements: step 1 → step 3 → step 4 (skip upgrades)
  // For verblijf: step 1 → step 2 (reisgezelschap) → step 3 (upgrades) → step 4 (gegevens) → step 5 (bevestigen)
  const hasVerblijfDates = !!(aankomst && vertrek);
  const hasArrangement = bookingType === "arrangement" && arrangement !== null;

  const currentStep: BookingFlowStep =
    bookingType === "arrangement"
      ? hasArrangement
        ? stap === "5" ? 5
          : stap === "4" ? 4
            : 1
        : 1
      : hasVerblijfDates
        ? stap === "5" ? 5
          : stap === "4" ? 4
            : stap === "3" ? 3
              : stap === "2" ? 2
                : 1
        : 1;

  // ── Period (verblijf only) ──────────────────────────────────
  const period: BookingPeriod | null = useMemo(() => {
    if (bookingType !== "verblijf" || !aankomst || !vertrek) return null;
    const totalNights = getNightCount(aankomst, vertrek);
    if (totalNights <= 0) return null;

    // Calculate accommodation price from calendar data or API base price
    const statusMap = new Map(data.map((d) => [d.date, d]));
    let totalPrice = 0;
    const current = new Date(aankomst);
    const end = new Date(vertrek);
    while (current < end) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${day}`;
      const info = statusMap.get(dateStr);
      totalPrice += info?.price ?? pricingData.basePrice.perNight;
      current.setDate(current.getDate() + 1);
    }

    // Calculate mandatory costs from pricing API
    const items: { id: string; name: string; amount: number }[] = [];
    let additionalSubtotal = 0;
    for (const cost of pricingData.mandatoryCosts) {
      const amount = calculateCostItemTotal(cost, guestCount, totalNights);
      items.push({ id: cost.id || cost.name, name: cost.name, amount });
      additionalSubtotal += amount;
    }
    additionalSubtotal = Math.round(additionalSubtotal * 100) / 100;

    // Legacy fields (backward compat for BookingSummary in step 1)
    const cleaning = items.find(i => i.id.toLowerCase().includes("clean") || i.name.toLowerCase().includes("schoonmaak"))?.amount ?? 0;
    const linen = items.find(i => i.id.toLowerCase().includes("linen") || i.name.toLowerCase().includes("linnen") || i.name.toLowerCase().includes("bedlinnen"))?.amount ?? 0;
    const energy = items.find(i => i.id.toLowerCase().includes("energy") || i.name.toLowerCase().includes("energie"))?.amount ?? 0;
    const tax = items.find(i => i.id.toLowerCase().includes("tax") || i.name.toLowerCase().includes("heffing") || i.name.toLowerCase().includes("belasting"))?.amount ?? 0;

    return {
      checkIn: aankomst,
      checkOut: vertrek,
      guests: guestCount,
      totalNights,
      totalPrice,
      avgPricePerNight: Math.round(totalPrice / totalNights),
      additionalCosts: { cleaning, linen, energy, tax, subtotal: additionalSubtotal, items },
      grandTotal: Math.round((totalPrice + additionalSubtotal) * 100) / 100,
    };
  }, [aankomst, vertrek, guestCount, data, bookingType, pricingData]);

  // ── Upgrades ────────────────────────────────────────────────
  const upgrades: BookingUpgradesType = useMemo(() => {
    const raw = searchParams.get("upgrades");
    if (!raw) return EMPTY_UPGRADES;
    try {
      return JSON.parse(raw) as BookingUpgradesType;
    } catch {
      return EMPTY_UPGRADES;
    }
  }, [searchParams]);

  // ── Contact ─────────────────────────────────────────────────
  function getContact(): ContactDetails | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem(CONTACT_STORAGE_KEY);
      if (stored) return JSON.parse(stored) as ContactDetails;
    } catch { /* ignore */ }
    return null;
  }

  // ── Type switch handler ─────────────────────────────────────
  const handleTypeChange = useCallback(
    (type: BookingType) => {
      if (type === bookingType) return;
      const params = new URLSearchParams();
      if (type === "arrangement") {
        params.set("type", "arrangement");
      }
      // Reset to step 1 when switching type
      router.push(`/boeken?${params.toString()}`);
    },
    [bookingType, router],
  );

  // ── ARRANGEMENT FLOW ────────────────────────────────────────

  // ── Travel party from URL params ────────────────────────────
  const travelParty = useMemo(() => {
    const v = searchParams.get("volwassenen");
    const k = searchParams.get("kinderen");
    const b = searchParams.get("babys");
    if (!v) return null;
    return {
      adults: parseInt(v, 10) || 0,
      children: parseInt(k ?? "0", 10),
      babies: parseInt(b ?? "0", 10),
    };
  }, [searchParams]);

  if (bookingType === "arrangement") {
    // Step 5: Bevestigen
    if (currentStep === 5 && arrangement) {
      const contact = getContact();
      if (!contact) {
        return (
          <BookingDetails
            period={null}
            arrangement={arrangement}
            bookingType="arrangement"
          />
        );
      }
      return (
        <BookingConfirmation
          bookingType="arrangement"
          arrangement={arrangement}
          upgrades={upgrades}
          contact={contact}
        />
      );
    }

    // Step 4: Gegevens
    if (currentStep === 4 && arrangement) {
      return (
        <BookingDetails
          period={null}
          arrangement={arrangement}
          bookingType="arrangement"
        />
      );
    }

    // Step 1: Arrangement picker
    return (
      <ArrangementPicker
        onTypeChange={handleTypeChange}
        initialArrangementId={arrangement?.arrangementId}
        initialDate={arrangement?.date ?? datum ?? undefined}
        initialGuests={arrangement?.guests ?? guestCount}
        availabilityData={data}
      />
    );
  }

  // ── VERBLIJF FLOW ─────────────────────────────────────────

  // Step 5: Bevestigen
  if (currentStep === 5 && period) {
    const contact = getContact();
    if (!contact) {
      return <BookingDetails period={period} bookingType="verblijf" />;
    }
    return (
      <BookingConfirmation
        bookingType="verblijf"
        period={period}
        upgrades={upgrades}
        contact={contact}
      />
    );
  }

  // Step 4: Gegevens
  if (currentStep === 4 && period) {
    return <BookingDetails period={period} bookingType="verblijf" />;
  }

  // Step 3: Upgrades
  if (currentStep === 3 && period) {
    return <BookingUpgrades period={period} initialUpgrades={upgrades} pricingData={pricingData} />;
  }

  // Step 2: Reisgezelschap
  if (currentStep === 2 && period) {
    return <TravelPartyStep period={period} initialParty={travelParty ?? undefined} />;
  }

  return (
    <BookingCalendar
      availabilityData={data}
      initialCheckIn={aankomst}
      initialCheckOut={vertrek}
      initialGuests={guestCount}
      onTypeChange={handleTypeChange}
    />
  );
}
