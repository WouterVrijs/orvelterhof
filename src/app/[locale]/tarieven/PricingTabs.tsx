"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// ── Data per jaar ───────────────────────────────────────────────

interface YearData {
  year: number;
  seasons: { label: string; dates: string[] }[];
  rates: { type: string; nights: string; prices: string[]; note?: boolean }[];
  specials: { period: string; price: string | null; note?: string }[];
  footnotes: string[];
}

const YEARS: YearData[] = [
  {
    year: 2026,
    seasons: [
      { label: "Periode 1", dates: ["03-01 tot 07-03", "21-11 tot 22-12"] },
      { label: "Periode 2", dates: ["07-03 tot 04-04", "03-11 tot 21-11"] },
      { label: "Periode 3", dates: ["04-04 tot 03-11"] },
    ],
    rates: [
      { type: "Weekend", nights: "2 nachten", prices: ["2.850", "3.200", "3.300"] },
      { type: "Weekend lang", nights: "3 nachten", prices: ["2.950", "3.300", "3.400"] },
      { type: "Midweek", nights: "4 nachten", prices: ["2.200", "2.500", "2.600"], note: true },
      { type: "Week", nights: "7 nachten", prices: ["4.200", "5.400", "5.800"] },
    ],
    specials: [
      { period: "Pasen vr 03/04 \u2013 ma 06/04", price: null, note: "alreadyRented" },
      { period: "Hemelvaart wo 13/05 \u2013 zo 17/05", price: null, note: "alreadyRented" },
      { period: "Pinksteren vr 22/06 \u2013 ma 25/06", price: null, note: "alreadyRented" },
      { period: "Kerst ma 21/12 \u2013 ma 28/12 (week)", price: "5.500" },
      { period: "Kerst vr 25/12 \u2013 ma 28/12 (weekend)", price: "3.500" },
      { period: "Oud en Nieuw ma 28/12 \u2013 vr 01/01", price: "5.500" },
      { period: "Oud en Nieuw ma 28/12 \u2013 zo 03/01", price: "6.800" },
      { period: "Midweken voorjaars-, mei- en herfstvakantie", price: "2.750" },
    ],
    footnotes: [
      "* Door de week is het eventueel mogelijk om de Orvelter Hof te huren voor een kortere periode of met een kleine groep. Neem gerust contact op.",
      "* Getoonde prijzen zijn inclusief BTW verhoging naar 21%",
      "* Boekingen voor het jaar 2026 en geboekt voor 1 juni 2025 worden nageven met het verhoogde btw tarief.",
    ],
  },
  {
    year: 2027,
    seasons: [
      { label: "Periode 1", dates: ["04-01 tot 07-03", "22-11 tot 20-12"] },
      { label: "Periode 2", dates: ["07-03 tot 29-03", "08-07 tot 02-09", "31-10 tot 22-11"] },
      { label: "Periode 3", dates: ["29-03 tot 31-10"] },
    ],
    rates: [
      { type: "Weekend", nights: "2 nachten", prices: ["2.950", "3.400", "3.600"] },
      { type: "Weekend lang", nights: "3 nachten", prices: ["3.050", "3.500", "3.700"] },
      { type: "Midweek", nights: "4 nachten", prices: ["2.200", "2.600", "2.700"], note: true },
      { type: "Week", nights: "7 nachten", prices: ["4.200", "5.400", "5.900"] },
    ],
    specials: [
      { period: "Pasen vr 26/03 \u2013 ma 29/03", price: "5.200" },
      { period: "Hemelvaart wo 05/05 \u2013 zo 09/05", price: null, note: "alreadyRented" },
      { period: "Pinksteren vr 14/05 \u2013 ma 17/05", price: null, note: "alreadyRented" },
      { period: "Kerst ma 20/12 \u2013 ma 27/12 (week)", price: "5.400" },
      { period: "Kerst vr 24/12 \u2013 ma 27/12 (weekend)", price: "3.775" },
      { period: "Oud en Nieuw ma 27/12 \u2013 zo 02/01", price: "6.800" },
      { period: "Midweken voorjaars-, mei- en herfstvakantie", price: "2.750" },
    ],
    footnotes: [
      "* Door de week is het eventueel mogelijk om de Orvelter Hof te huren voor een kortere periode of met een kleine groep. Neem gerust contact op.",
    ],
  },
  {
    year: 2028,
    seasons: [
      { label: "Periode 1", dates: ["04-01 tot 07-03", "22-11 tot 20-12"] },
      { label: "Periode 2", dates: ["07-03 tot 29-03", "08-07 tot 02-09", "29-10 tot 22-11"] },
      { label: "Periode 3", dates: ["27-03 tot 29-10"] },
    ],
    rates: [
      { type: "Weekend", nights: "2 nachten", prices: ["2.950", "3.400", "3.600"] },
      { type: "Weekend lang", nights: "3 nachten", prices: ["3.050", "3.500", "3.700"] },
      { type: "Midweek", nights: "4 nachten", prices: ["2.200", "2.600", "2.700"], note: true },
      { type: "Week", nights: "7 nachten", prices: ["4.200", "5.400", "5.900"] },
    ],
    specials: [
      { period: "Pasen vr 14/04 \u2013 ma 17/04", price: "5.300" },
      { period: "Hemelvaart wo 24/05 \u2013 zo 28/05", price: "6.050" },
      { period: "Pinksteren vr 02/06 \u2013 ma 05/06", price: "5.500" },
      { period: "Kerst ma 25/12 \u2013 vr 29/12", price: "5.400" },
      { period: "Oud en Nieuw vr 29/12 \u2013 ma 01/01 (weekend)", price: "5.775" },
      { period: "Oud en Nieuw vr 29/12 \u2013 do 05/01 (week)", price: "6.800" },
      { period: "Midweken voorjaars-, mei- en herfstvakantie", price: "2.850" },
    ],
    footnotes: [
      "* Door de week is het eventueel mogelijk om de Orvelter Hof te huren voor een kortere periode of met een kleine groep. Neem gerust contact op.",
    ],
  },
];

// ── Component ───────────────────────────────────────────────────

export default function PricingTabs() {
  const t = useTranslations("tarieven");
  const [activeYear, setActiveYear] = useState(2026);
  const data = YEARS.find((y) => y.year === activeYear)!;

  return (
    <div>
      {/* Year tabs */}
      <div className="mb-8 flex gap-1 rounded-xl bg-white p-1 shadow-sm border border-[#ede6d8]">
        {YEARS.map((y) => (
          <button
            key={y.year}
            type="button"
            onClick={() => setActiveYear(y.year)}
            className={`flex-1 rounded-lg py-2.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all ${
              activeYear === y.year
                ? "bg-olive text-white shadow-sm"
                : "text-[#6b6b63] hover:bg-[#fbf8f6] hover:text-[#4a524f]"
            }`}
          >
            {y.year}
          </button>
        ))}
      </div>

      {/* Main heading */}
      <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f]">
        {t("yearHeading")} {data.year}
      </h2>

      {/* Rate table */}
      <div className="mb-4 overflow-x-auto rounded-2xl border border-[#ede6d8] bg-white shadow-sm">
        <table className="w-full font-[family-name:var(--font-lato)] text-sm">
          <thead>
            <tr className="bg-[#fbf8f6]">
              <th className="px-6 py-4 text-left font-bold text-[#4a524f]">
                {t("tableHeader")}
              </th>
              {data.seasons.map((s) => (
                <th key={s.label} className="px-4 py-4 text-center text-[#4a524f]">
                  <span className="font-bold">{s.label}</span>
                  <br />
                  {s.dates.map((d, i) => (
                    <span key={i} className="text-xs font-normal text-[#6b6b63]">
                      {d}
                      {i < s.dates.length - 1 && <br />}
                    </span>
                  ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[#3a3a35]">
            {data.rates.map((row, i) => (
              <tr
                key={row.type}
                className={i % 2 === 0 ? "bg-white" : "bg-[#fbf8f6]"}
              >
                <td className="px-6 py-3.5">
                  <span className="font-bold">{row.type}</span>
                  {row.note && <span className="text-terracotta">*</span>}
                  <br />
                  <span className="text-xs text-[#6b6b63]">{row.nights}</span>
                </td>
                {row.prices.map((price, j) => (
                  <td key={j} className="px-4 py-3.5 text-center">
                    &euro; {price}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footnotes */}
      {data.footnotes.map((note, i) => (
        <p
          key={i}
          className={`font-[family-name:var(--font-lato)] text-xs text-[#6b6b63] ${
            i === 0 ? "mt-3" : "mt-1"
          } ${note.startsWith("* Getoonde") || note.startsWith("* Boekingen") ? "font-bold text-[#3a3a35]" : ""}`}
        >
          {note}
        </p>
      ))}

      {/* Special arrangements */}
      <h3 className="mb-4 mt-10 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f]">
        {t("specialArrangementsTitle")}
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-[#ede6d8] bg-white shadow-sm">
        <table className="w-full font-[family-name:var(--font-lato)] text-sm">
          <thead>
            <tr className="bg-[#fbf8f6]">
              <th className="px-6 py-4 text-left font-bold text-[#4a524f]">
                {t("periodHeader")}
              </th>
              <th className="px-6 py-4 text-right font-bold text-[#4a524f]">
                {t("priceHeader")}
              </th>
            </tr>
          </thead>
          <tbody className="text-[#3a3a35]">
            {data.specials.map((row, i) => (
              <tr
                key={row.period}
                className={i % 2 === 0 ? "bg-white" : "bg-[#fbf8f6]"}
              >
                <td className="px-6 py-3.5">{row.period}</td>
                <td className="px-6 py-3.5 text-right">
                  {row.note ? (
                    <span className="text-xs italic text-[#6b6b63]">
                      {t("alreadyRented")}
                    </span>
                  ) : (
                    <>&euro; {row.price}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
