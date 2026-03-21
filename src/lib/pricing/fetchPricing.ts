import type { PricingData, CostItem } from "./types";
import { isApiConfigured } from "@/lib/api/bookingApiClient";
import { bookingConfig } from "@/components/booking/bookingConfig";

/**
 * Fetch pricing data from the booking system API.
 * Falls back to hardcoded defaults from bookingConfig if API is unavailable.
 *
 * Uses Next.js revalidation (5 min cache) to avoid excessive API calls.
 */
export async function fetchPricing(): Promise<PricingData> {
  if (!isApiConfigured()) {
    return getDefaultPricing();
  }

  try {
    const res = await fetch(`${process.env.BOOKING_API_URL}/pricing`, {
      headers: {
        Authorization: `Bearer ${process.env.BOOKING_API_KEY}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      console.warn(
        "[pricing] API returned error, using defaults.",
        { status: res.status },
      );
      return getDefaultPricing();
    }

    const data = (await res.json()) as PricingData;

    // Deduplicate cost items by name (API may return duplicates)
    data.mandatoryCosts = deduplicateByName(data.mandatoryCosts);
    data.upgrades = deduplicateByName(data.upgrades);

    return data;
  } catch (error) {
    console.warn("[pricing] Could not fetch pricing, using defaults.", error);
    return getDefaultPricing();
  }
}

/**
 * Default pricing from bookingConfig — used when API is unavailable.
 */
function getDefaultPricing(): PricingData {
  return {
    basePrice: {
      perNight: bookingConfig.weekendPricePerNight,
      type: "PER_NIGHT",
    },
    mandatoryCosts: [
      { id: "cleaning", name: "Eindschoonmaak", type: "FIXED", price: bookingConfig.cleaningFee },
      { id: "linen", name: "Bedlinnen", type: "PER_PERSON", price: bookingConfig.linenPerPerson },
      { id: "energy", name: "Energie", type: "PER_PERSON_PER_NIGHT", price: bookingConfig.energyPerPersonPerNight },
      { id: "tax", name: "Gem. heffingen", type: "PER_PERSON_PER_NIGHT", price: bookingConfig.taxPerPersonPerNight },
    ],
    upgrades: [
      { id: "keukenlinnen", name: "Keukenlinnen", type: "PER_UNIT", price: 5.50 },
      { id: "barbecue", name: "Barbecue", type: "PER_UNIT", price: 35.00 },
      { id: "badlinnen", name: "Badlinnen", type: "PER_PERSON", price: 3.75 },
      { id: "activiteit", name: "Activiteit", type: "PER_PERSON", price: 20.00 },
      { id: "kinderbedden", name: "Kinderbedden", type: "PER_UNIT", price: 7.50 },
      { id: "ontbijt", name: "Ontbijt", type: "PER_PERSON_PER_NIGHT", price: 0.00 },
    ],
  };
}

/**
 * Remove duplicate cost items by name, keeping the first occurrence.
 */
function deduplicateByName(items: CostItem[]): CostItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}
