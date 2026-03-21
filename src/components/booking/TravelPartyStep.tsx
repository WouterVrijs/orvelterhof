"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { BookingPeriod, TravelParty } from "./bookingFlowTypes";
import BookingFlowSummary from "./BookingFlowSummary";
import BookingStepIndicator from "./BookingStepIndicator";
import { Users } from "lucide-react";

interface TravelPartyStepProps {
  period: BookingPeriod;
  initialParty?: TravelParty;
}

export default function TravelPartyStep({
  period,
  initialParty,
}: TravelPartyStepProps) {
  const router = useRouter();
  const t = useTranslations("bookingModule");

  const [adults, setAdults] = useState(initialParty?.adults ?? period.guests);
  const [children, setChildren] = useState(initialParty?.children ?? 0);
  const [babies, setBabies] = useState(initialParty?.babies ?? 0);

  const total = adults + children + babies;
  const isValid = total === period.guests;

  function goBack() {
    const params = new URLSearchParams({
      aankomst: period.checkIn,
      vertrek: period.checkOut,
      personen: String(period.guests),
    });
    router.push(`/boeken?${params.toString()}`);
  }

  function goForward() {
    if (!isValid) return;
    const params = new URLSearchParams({
      aankomst: period.checkIn,
      vertrek: period.checkOut,
      personen: String(period.guests),
      stap: "3",
      volwassenen: String(adults),
      kinderen: String(children),
      babys: String(babies),
    });
    router.push(`/boeken?${params.toString()}`);
  }

  return (
    <>
      <BookingStepIndicator currentStep={2} />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Content */}
        <div className="min-w-0 flex-1 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive font-[family-name:var(--font-lato)] text-sm font-bold text-white">
                2
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark md:text-2xl">
                {t("travelPartyTitle")}
              </h2>
            </div>
            <p className="mt-2 pl-11 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-text-muted">
              {t("travelPartyDescription")}
            </p>
          </div>

          {/* Party breakdown */}
          <div className="divide-y divide-cream-dark">
            {/* Adults */}
            <div className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="font-[family-name:var(--font-lato)] text-sm font-bold text-olive-dark">
                  {t("adults")}
                </p>
                <p className="font-[family-name:var(--font-lato)] text-xs italic text-text-muted">
                  {t("adultsAge")}
                </p>
              </div>
              <select
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                className="w-24 rounded-lg border border-cream-dark bg-warm-white px-3 py-2 font-[family-name:var(--font-lato)] text-sm text-olive-dark outline-none transition-colors focus:border-olive"
              >
                {Array.from({ length: period.guests + 1 }).map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="font-[family-name:var(--font-lato)] text-sm font-bold text-olive-dark">
                  {t("travelChildren")}
                </p>
                <p className="font-[family-name:var(--font-lato)] text-xs italic text-text-muted">
                  {t("childrenAge")}
                </p>
              </div>
              <select
                value={children}
                onChange={(e) => setChildren(parseInt(e.target.value, 10))}
                className="w-24 rounded-lg border border-cream-dark bg-warm-white px-3 py-2 font-[family-name:var(--font-lato)] text-sm text-olive-dark outline-none transition-colors focus:border-olive"
              >
                {Array.from({ length: period.guests + 1 }).map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Babies */}
            <div className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="font-[family-name:var(--font-lato)] text-sm font-bold text-olive-dark">
                  {t("babies")}
                </p>
                <p className="font-[family-name:var(--font-lato)] text-xs italic text-text-muted">
                  {t("babiesAge")}
                </p>
              </div>
              <select
                value={babies}
                onChange={(e) => setBabies(parseInt(e.target.value, 10))}
                className="w-24 rounded-lg border border-cream-dark bg-warm-white px-3 py-2 font-[family-name:var(--font-lato)] text-sm text-olive-dark outline-none transition-colors focus:border-olive"
              >
                {Array.from({ length: period.guests + 1 }).map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation message */}
          {!isValid && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <Users size={16} className="shrink-0 text-amber-600" />
              <p className="font-[family-name:var(--font-lato)] text-sm text-amber-800">
                {t("travelPartyMismatch", { total: period.guests })} ({t("travelPartyCurrent", { current: total })})
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              className="order-2 font-[family-name:var(--font-lato)] text-sm text-olive-light transition-colors hover:text-terracotta sm:order-1"
            >
              {t("backToStay")}
            </button>

            <button
              type="button"
              disabled={!isValid}
              onClick={isValid ? goForward : undefined}
              className={`order-1 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all sm:order-2 ${
                isValid
                  ? "bg-terracotta text-white shadow-md hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
                  : "bg-cream-dark/40 text-olive-light/40"
              }`}
            >
              {t("proceedToUpgrades")}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 lg:sticky lg:top-6 lg:w-80">
          <BookingFlowSummary period={period} onEditPeriod={goBack} />
        </div>
      </div>
    </>
  );
}
