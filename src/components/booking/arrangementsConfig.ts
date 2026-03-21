/**
 * Zakelijke arrangementen — configuratie en data.
 *
 * Centraal gedefinieerd zodat zowel de selectie-UI als de
 * prijsberekening dezelfde bron gebruiken.
 */

import type { ArrangementOption } from "./bookingFlowTypes";

export const ARRANGEMENTS: ArrangementOption[] = [
  {
    id: "4-uurs",
    name: "4-uurs arrangement",
    description: "Perfect voor een korte, intensieve vergadering of workshop",
    pricePerPerson: 45.5,
    icon: "clock",
    features: [
      "Eén dagdeel zaalhuur",
      "Onbeperkt koffie, thee en kannen water",
      "Victoria cake of Drentse Heidekoek",
      "Koekjes, mintjes",
      "Flipover, stiften",
      "Beamer",
      "Wifi",
    ],
    surcharges: null,
    includesOvernight: false,
  },
  {
    id: "4-uurs-lunch",
    name: "4-uurs arrangement met lunch",
    description: "Voor productieve ochtend- of middagsessies met lunch",
    pricePerPerson: 59.5,
    icon: "calendar",
    features: [
      "Eén dagdeel zaalhuur",
      "Onbeperkt koffie, thee en kannen water",
      "Victoria cake of Drentse Heidekoek",
      "Koekjes, mintjes",
      "Flipover, stiften",
      "Beamer",
      "Wifi",
      "Uitgebreide lunch",
    ],
    surcharges: null,
    includesOvernight: false,
  },
  {
    id: "8-uurs-lunch",
    name: "8-uurs arrangement met lunch",
    description: "Volledig verzorgde dag inclusief lunch & versnaperingen",
    pricePerPerson: 88.5,
    icon: "calendar",
    features: [
      "Eén dagdeel zaalhuur",
      "Onbeperkt koffie, thee en kannen water",
      "Victoria cake of Drentse Heidekoek",
      "Koekjes, mintjes",
      "Flipover, stiften",
      "Beamer",
      "Wifi",
      "Uitgebreide lunch",
    ],
    surcharges: null,
    includesOvernight: false,
  },
  {
    id: "12-uurs",
    name: "12-uurs arrangement",
    description: "Uitgebreid dagprogramma met lunch en 3-gangen diner",
    pricePerPerson: 119.5,
    icon: "clock",
    features: [
      "Drie dagdelen zaalhuur",
      "Onbeperkt koffie, thee en kannen water",
      "Victoria cake of Drentse Heidekoek",
      "Koekjes, mintjes",
      "Flipover, stiften",
      "Beamer",
      "Wifi",
      "Uitgebreide lunch",
      "3 gangen diner",
    ],
    surcharges: null,
    includesOvernight: false,
  },
  {
    id: "24-uurs",
    name: "24-uurs arrangement",
    description: "Inclusief overnachting voor een intensieve heisessie of training",
    pricePerPerson: 179.5,
    icon: "clock",
    features: [
      "12-uurs arrangement + overnachting met ontbijt",
    ],
    surcharges: [
      "1-persoonskamer: \u20AC 18,50",
      "Toeristenbelasting: \u20AC 2,85 p.p.",
    ],
    includesOvernight: true,
  },
  {
    id: "32-uurs",
    name: "32-uurs arrangement",
    description: "Meerdaagse bijeenkomst met volledige verzorging en overnachting",
    pricePerPerson: 219.5,
    icon: "clock",
    features: [
      "24-uurs arrangement + 8-uurs arrangement",
    ],
    surcharges: [
      "1-persoonskamer: \u20AC 18,50",
      "Toeristenbelasting: \u20AC 2,85 p.p.",
    ],
    includesOvernight: true,
  },
];

/** Look up an arrangement by its ID. */
export function getArrangementById(id: string): ArrangementOption | undefined {
  return ARRANGEMENTS.find((a) => a.id === id);
}
