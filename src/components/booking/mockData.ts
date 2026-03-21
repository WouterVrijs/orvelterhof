import type { DayStatus } from "./types";
import { bookingConfig } from "./bookingConfig";

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Seizoenen 2026:
 * Laag:   03-01 t/m 06-03, 21-11 t/m 22-12
 * Midden: 07-03 t/m 03-04, 03-11 t/m 20-11
 * Hoog:   04-04 t/m 02-11
 *
 * Per-nacht prijzen (hele accommodatie, afgeleid van pakkettarieven):
 *                    Laag    Midden   Hoog
 * Weekend (vr/za):   €1425   €1600    €1650
 * Midweek (ma-do):   €550    €625     €650
 */
type Season = "laag" | "midden" | "hoog";

function getSeason(d: Date): Season {
  const m = d.getMonth(); // 0-indexed
  const day = d.getDate();

  // Maand + dag als getal voor makkelijk vergelijken (MMDD)
  const mmdd = m * 100 + day;

  // Laagseizoen: 03-01 (0201) t/m 06-03 (0206), 21-11 (1021) t/m 22-12 (1122)
  if (mmdd <= 205) return "laag"; // jan 1 - mar 6
  if (mmdd >= 1020 && mmdd <= 1121) return "laag"; // nov 21 - dec 22

  // Middenseizoen: 07-03 (0206) t/m 03-04 (0303), 03-11 (1002) t/m 20-11 (1019)
  if (mmdd >= 206 && mmdd <= 303) return "midden"; // mar 7 - apr 3
  if (mmdd >= 1002 && mmdd <= 1019) return "midden"; // nov 3 - nov 20

  // Hoogseizoen: 04-04 (0303) t/m 02-11 (1001)
  if (mmdd >= 304 && mmdd <= 1001) return "hoog"; // apr 4 - nov 2

  // Rest (dec 23-31, jan begin) = laagseizoen
  return "laag";
}

function getPricePerNight(d: Date): number {
  const season = getSeason(d);
  const dow = d.getDay(); // 0=zo, 5=vr, 6=za

  // Weekend nachten = vrijdag en zaterdag
  const isWeekendNight = dow === 5 || dow === 6;

  if (isWeekendNight) {
    if (season === "laag") return 1425;
    if (season === "midden") return 1600;
    return 1650;
  }
  // Midweek nachten
  if (season === "laag") return 550;
  if (season === "midden") return 625;
  return 650;
}

export function generateMockData(): DayStatus[] {
  const data: DayStatus[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setMonth(end.getMonth() + bookingConfig.horizonMonths);

  // --- Speciale arrangementen (reeds verhuurd) ---
  const specialBooked = new Set<string>();
  const specialRanges: [Date, Date][] = [
    [new Date(2026, 3, 3), new Date(2026, 3, 6)],   // Pasen 03/04 - 06/04
    [new Date(2026, 4, 13), new Date(2026, 4, 17)],  // Hemelvaart 13/05 - 17/05
    [new Date(2026, 5, 22), new Date(2026, 5, 25)],  // Pinksteren 22/06 - 25/06
  ];
  for (const [start, finish] of specialRanges) {
    const c = new Date(start);
    while (c <= finish) {
      specialBooked.add(formatDate(c));
      c.setDate(c.getDate() + 1);
    }
  }

  // --- Regulier geboekte weekenden (~70%) ---
  const bookedWeekends = new Set<string>();
  const current = new Date(today);
  let weekendCount = 0;
  while (current <= end) {
    if (current.getDay() === 5) {
      weekendCount++;
      if (weekendCount % 10 !== 3 && weekendCount % 10 !== 7 && weekendCount % 10 !== 0) {
        for (let i = 0; i < 3; i++) {
          const d = new Date(current);
          d.setDate(d.getDate() + i);
          bookedWeekends.add(formatDate(d));
        }
      }
    }
    current.setDate(current.getDate() + 1);
  }

  // --- Regulier geboekte midweken (~30%) ---
  const bookedMidweeks = new Set<string>();
  const mw = new Date(today);
  let midweekCount = 0;
  while (mw <= end) {
    if (mw.getDay() === 1) {
      midweekCount++;
      if (midweekCount % 10 === 2 || midweekCount % 10 === 5 || midweekCount % 10 === 8) {
        for (let i = 0; i < 5; i++) {
          const d = new Date(mw);
          d.setDate(d.getDate() + i);
          bookedMidweeks.add(formatDate(d));
        }
      }
    }
    mw.setDate(mw.getDate() + 1);
  }

  // --- Kortingsdagen: laagseizoen midweken (nov/dec en jan/feb) ---
  const discountDates = new Set<string>();
  const iter2 = new Date(today);
  while (iter2 <= end) {
    const season = getSeason(iter2);
    const dow = iter2.getDay();
    const ds = formatDate(iter2);
    // Korting op laagseizoen doordeweekse dagen die niet geboekt zijn
    if (
      season === "laag" &&
      dow >= 1 &&
      dow <= 4 &&
      !bookedWeekends.has(ds) &&
      !bookedMidweeks.has(ds) &&
      !specialBooked.has(ds)
    ) {
      discountDates.add(ds);
    }
    iter2.setDate(iter2.getDate() + 1);
  }

  // --- Build day-by-day array ---
  const iter = new Date(today);
  while (iter <= end) {
    const ds = formatDate(iter);
    const price = getPricePerNight(iter);
    const discountPrice = Math.round(price * 0.85); // 15% korting in laagseizoen

    const isSpecialBooked = specialBooked.has(ds);
    const isRegularBooked = bookedWeekends.has(ds) || bookedMidweeks.has(ds);
    const isBooked = isSpecialBooked || isRegularBooked;
    const isDiscount = discountDates.has(ds);

    if (isBooked) {
      const prev = new Date(iter);
      prev.setDate(prev.getDate() - 1);
      const next = new Date(iter);
      next.setDate(next.getDate() + 1);
      const prevDs = formatDate(prev);
      const nextDs = formatDate(next);
      const prevBooked =
        specialBooked.has(prevDs) ||
        bookedWeekends.has(prevDs) ||
        bookedMidweeks.has(prevDs);
      const nextBooked =
        specialBooked.has(nextDs) ||
        bookedWeekends.has(nextDs) ||
        bookedMidweeks.has(nextDs);

      if (!prevBooked && nextBooked) {
        data.push({ date: ds, status: "booked", price });
      } else if (prevBooked && !nextBooked) {
        data.push({ date: ds, status: "departure", price });
      } else {
        data.push({ date: ds, status: "booked" });
      }
    } else if (isDiscount) {
      data.push({ date: ds, status: "discount", price: discountPrice });
    } else {
      data.push({ date: ds, status: "available", price });
    }

    iter.setDate(iter.getDate() + 1);
  }

  return data;
}
