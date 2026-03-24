/**
 * Zakelijke arrangementen — configuratie en data.
 *
 * Teksten (name, description, features, surcharges) komen uit de
 * vertaalbestanden (bookingModule.arr_*). Hier staan alleen de
 * structurele/numerieke gegevens.
 */

export interface ArrangementConfig {
  id: string;
  pricePerPerson: number;
  icon: "clock" | "calendar";
  featureKeys: string[];
  surchargeKeys: string[] | null;
  includesOvernight: boolean;
}

export const ARRANGEMENTS: ArrangementConfig[] = [
  {
    id: "4-uurs",
    pricePerPerson: 45.5,
    icon: "clock",
    featureKeys: ["feat_zaalhuur1", "feat_koffie", "feat_cake", "feat_koekjes", "feat_flipover", "feat_beamer", "feat_wifi"],
    surchargeKeys: null,
    includesOvernight: false,
  },
  {
    id: "4-uurs-lunch",
    pricePerPerson: 59.5,
    icon: "calendar",
    featureKeys: ["feat_zaalhuur1", "feat_koffie", "feat_cake", "feat_koekjes", "feat_flipover", "feat_beamer", "feat_wifi", "feat_lunch"],
    surchargeKeys: null,
    includesOvernight: false,
  },
  {
    id: "8-uurs-lunch",
    pricePerPerson: 88.5,
    icon: "calendar",
    featureKeys: ["feat_zaalhuur1", "feat_koffie", "feat_cake", "feat_koekjes", "feat_flipover", "feat_beamer", "feat_wifi", "feat_lunch"],
    surchargeKeys: null,
    includesOvernight: false,
  },
  {
    id: "12-uurs",
    pricePerPerson: 119.5,
    icon: "clock",
    featureKeys: ["feat_zaalhuur3", "feat_koffie", "feat_cake", "feat_koekjes", "feat_flipover", "feat_beamer", "feat_wifi", "feat_lunch", "feat_diner"],
    surchargeKeys: null,
    includesOvernight: false,
  },
  {
    id: "24-uurs",
    pricePerPerson: 179.5,
    icon: "clock",
    featureKeys: ["feat_24combo"],
    surchargeKeys: ["surcharge_single", "surcharge_tax"],
    includesOvernight: true,
  },
  {
    id: "32-uurs",
    pricePerPerson: 219.5,
    icon: "clock",
    featureKeys: ["feat_32combo"],
    surchargeKeys: ["surcharge_single", "surcharge_tax"],
    includesOvernight: true,
  },
];

/** Look up an arrangement by its ID. */
export function getArrangementById(id: string): ArrangementConfig | undefined {
  return ARRANGEMENTS.find((a) => a.id === id);
}
