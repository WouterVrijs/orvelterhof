export type CostType =
  | "FIXED"
  | "PER_PERSON"
  | "PER_NIGHT"
  | "PER_PERSON_PER_NIGHT"
  | "PER_UNIT";

export interface CostItem {
  id: string;
  name: string;
  type: CostType;
  price: number;
}

export interface PricingData {
  basePrice: {
    perNight: number;
    type: "PER_NIGHT";
  };
  mandatoryCosts: CostItem[];
  upgrades: CostItem[];
}

/**
 * Calculate the total for a cost item based on its type.
 */
export function calculateCostItemTotal(
  item: CostItem,
  guests: number,
  nights: number,
  quantity: number = 1,
): number {
  switch (item.type) {
    case "FIXED":
      return item.price;
    case "PER_PERSON":
      return Math.round(item.price * guests * 100) / 100;
    case "PER_NIGHT":
      return Math.round(item.price * nights * 100) / 100;
    case "PER_PERSON_PER_NIGHT":
      return Math.round(item.price * guests * nights * 100) / 100;
    case "PER_UNIT":
      return Math.round(item.price * quantity * 100) / 100;
    default:
      return 0;
  }
}
