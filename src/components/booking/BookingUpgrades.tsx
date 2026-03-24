"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { BookingPeriod, BookingUpgrades as BookingUpgradesType, UpgradeOption, UpgradeLineItem, BookingFlowStep } from "./bookingFlowTypes";
import { EMPTY_UPGRADES } from "./bookingFlowTypes";
import { confirmAvailabilityAction } from "@/lib/availability/actions";
import BookingFlowSummary from "./BookingFlowSummary";
import BookingStepIndicator from "./BookingStepIndicator";
import { Loader2, AlertTriangle, Info } from "lucide-react";
import type { PricingData } from "@/lib/pricing/types";
import { calculateCostItemTotal } from "@/lib/pricing/types";

interface ExtraConfig {
  id: string;
  labelKey: string;
  priceKey: string;
  infoKey?: string;
  type: "quantity" | "yesno";
  max?: number;
}

const EXTRAS: ExtraConfig[] = [
  { id: "keukenlinnen", labelKey: "extraKeukenlinnen", priceKey: "extraKeukenlinnenPrice", infoKey: "extraKeukenlinnenInfo", type: "quantity", max: 36 },
  { id: "barbecue", labelKey: "extraBarbecue", priceKey: "extraBarbecuePrice", type: "yesno" },
  { id: "badlinnen", labelKey: "extraBadlinnen", priceKey: "extraBadlinnenPrice", infoKey: "extraBadlinnenInfo", type: "quantity", max: 36 },
  { id: "activiteit", labelKey: "extraActiviteit", priceKey: "extraActiviteitPrice", type: "quantity", max: 36 },
  { id: "kinderbedden", labelKey: "extraKinderbedden", priceKey: "extraKinderbeddenPrice", type: "quantity", max: 10 },
  { id: "ontbijt", labelKey: "extraOntbijt", priceKey: "extraOntbijtPrice", type: "quantity", max: 36 },
];

interface BookingUpgradesProps {
  period: BookingPeriod;
  initialUpgrades?: BookingUpgradesType;
  pricingData?: PricingData;
}

export default function BookingUpgrades({
  period,
  initialUpgrades,
  pricingData,
}: BookingUpgradesProps) {
  const router = useRouter();
  const t = useTranslations("bookingModule");

  // ── Extras state ──────────────────────────────────────────────
  const [extras, setExtras] = useState<UpgradeOption[]>(() => {
    if (initialUpgrades?.extras?.length) return initialUpgrades.extras;
    return EXTRAS.map((e) => ({ id: e.id, type: e.type, value: 0 }));
  });

  const updateExtra = useCallback((id: string, value: number) => {
    setExtras((prev) =>
      prev.map((e) => (e.id === id ? { ...e, value } : e))
    );
  }, []);

  // ── Compute upgrade line items for sidebar ────────────────────
  const upgradeItems: UpgradeLineItem[] = useMemo(() => {
    if (!pricingData) return [];
    const upgradeMap = new Map(pricingData.upgrades.map((u) => [u.id, u]));
    return extras
      .filter((e) => e.value > 0)
      .map((e) => {
        const config = upgradeMap.get(e.id);
        if (!config) return null;
        const amount = calculateCostItemTotal(config, period.guests, period.totalNights, e.value);
        return { id: e.id, name: config.name, amount, quantity: e.value };
      })
      .filter((item): item is UpgradeLineItem => item !== null);
  }, [extras, pricingData, period.guests, period.totalNights]);

  // ── Availability re-check on mount ────────────────────────────
  const [availCheck, setAvailCheck] = useState<
    "checking" | "available" | "unavailable" | "error"
  >("checking");

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const result = await confirmAvailabilityAction(
          period.checkIn,
          period.checkOut,
        );
        if (cancelled) return;
        setAvailCheck(
          result.status === "available" ? "available" : "unavailable",
        );
      } catch {
        if (!cancelled) setAvailCheck("error");
      }
    }
    check();
    return () => { cancelled = true; };
  }, [period.checkIn, period.checkOut]);

  // ── Navigation ────────────────────────────────────────────────
  function goToStep(step: BookingFlowStep) {
    const params = new URLSearchParams({
      aankomst: period.checkIn,
      vertrek: period.checkOut,
      personen: String(period.guests),
    });
    if (step > 1) params.set("stap", String(step));
    router.push(`/boeken?${params.toString()}`);
  }

  function goBack() {
    goToStep(1);
  }

  function goForward() {
    const params = new URLSearchParams({
      aankomst: period.checkIn,
      vertrek: period.checkOut,
      personen: String(period.guests),
      stap: "4",
    });
    const activeExtras = extras.filter((e) => e.value > 0);
    if (activeExtras.length > 0) {
      const upgrades: BookingUpgradesType = {
        selectedOptions: activeExtras.map((e) => e.id),
        extras: activeExtras,
        remarks: "",
      };
      params.set("upgrades", JSON.stringify(upgrades));
    }
    router.push(`/boeken?${params.toString()}`);
  }

  // ── Unavailable at mount ──────────────────────────────────────
  if (availCheck === "unavailable") {
    return (
      <>
        <BookingStepIndicator currentStep={3} onStepClick={goToStep} />
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={32} className="text-red-500" />
            </span>
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            {t("periodNoLongerAvailable")}
          </h2>
          <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {t("periodNoLongerAvailableDescription")}
          </p>
          <button
            type="button"
            onClick={goBack}
            className="rounded-full bg-terracotta px-8 py-3 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
          >
            {t("chooseAnotherPeriod")}
          </button>
        </div>
      </>
    );
  }

  const isLoading = availCheck === "checking";

  return (
    <>
      <BookingStepIndicator currentStep={3} onStepClick={goToStep} />

      {/* Loading state */}
      {isLoading && (
        <div className="mb-8 flex items-center justify-center gap-3 rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-4">
          <Loader2 size={18} className="animate-spin text-terracotta" />
          <p className="font-[family-name:var(--font-lato)] text-sm text-olive-dark">
            {t("recheckingAvailability")}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Content */}
        <div className="min-w-0 flex-1 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive font-[family-name:var(--font-lato)] text-sm font-bold text-white">
                3
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark md:text-2xl">
                {t("extrasTitle")}
              </h2>
            </div>
            <p className="mt-2 pl-11 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-text-muted">
              {t("extrasDescription")}
            </p>
          </div>

          {/* Extra options */}
          <div className="divide-y divide-cream-dark">
            {EXTRAS.map((extra) => {
              const current = extras.find((e) => e.id === extra.id);
              const value = current?.value ?? 0;

              return (
                <div
                  key={extra.id}
                  className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Label */}
                  <div className="flex items-center gap-2">
                    <p className="font-[family-name:var(--font-lato)] text-sm font-bold text-olive-dark">
                      {t(extra.labelKey)}
                    </p>
                    {extra.infoKey && (
                      <div className="group relative">
                        <Info size={14} className="text-text-muted/50 cursor-help" />
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-olive-dark px-3 py-1.5 font-[family-name:var(--font-lato)] text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          {t(extra.infoKey)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Select */}
                    {extra.type === "quantity" ? (
                      <select
                        value={value}
                        onChange={(e) => updateExtra(extra.id, parseInt(e.target.value, 10))}
                        className="w-24 rounded-lg border border-cream-dark bg-warm-white px-3 py-2 font-[family-name:var(--font-lato)] text-sm text-olive-dark outline-none transition-colors focus:border-olive"
                      >
                        {Array.from({ length: (extra.max ?? 10) + 1 }).map((_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={value}
                        onChange={(e) => updateExtra(extra.id, parseInt(e.target.value, 10))}
                        className="w-24 rounded-lg border border-cream-dark bg-warm-white px-3 py-2 font-[family-name:var(--font-lato)] text-sm text-olive-dark outline-none transition-colors focus:border-olive"
                      >
                        <option value={0}>{t("extraNo")}</option>
                        <option value={1}>{t("extraYes")}</option>
                      </select>
                    )}

                    {/* Price */}
                    <p className="min-w-[140px] text-right font-[family-name:var(--font-lato)] text-sm text-text-muted">
                      {t(extra.priceKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

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
              disabled={isLoading}
              onClick={!isLoading ? goForward : undefined}
              className={`order-1 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all sm:order-2 ${
                !isLoading
                  ? "bg-terracotta text-white shadow-md hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
                  : "bg-cream-dark/40 text-olive-light/40"
              }`}
            >
              {t("proceedToDetails")}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 lg:sticky lg:top-6 lg:w-80">
          <BookingFlowSummary period={period} onEditPeriod={goBack} upgradeItems={upgradeItems} />
        </div>
      </div>
    </>
  );
}
