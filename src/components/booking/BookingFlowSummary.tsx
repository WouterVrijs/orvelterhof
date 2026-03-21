"use client";

import type { BookingPeriod, UpgradeLineItem } from "./bookingFlowTypes";
import { formatDisplayDate } from "./dateUtils";
import { useTranslations } from "next-intl";
import { CalendarDays, Users, Moon } from "lucide-react";

interface BookingFlowSummaryProps {
  period: BookingPeriod;
  onEditPeriod: () => void;
  upgradeItems?: UpgradeLineItem[];
}

export default function BookingFlowSummary({
  period,
  onEditPeriod,
  upgradeItems,
}: BookingFlowSummaryProps) {
  const t = useTranslations("bookingModule");
  const nightLabel = period.totalNights === 1 ? t("nightSingular") : t("nightPlural", { count: period.totalNights });

  const upgradesTotal = upgradeItems?.reduce((sum, item) => sum + item.amount, 0) ?? 0;
  const displayTotal = Math.round((period.grandTotal + upgradesTotal) * 100) / 100;

  // Use items array if available, otherwise fall back to legacy fields
  const costItems = period.additionalCosts.items?.length
    ? period.additionalCosts.items
    : [
        { id: "cleaning", name: t("finalCleaning"), amount: period.additionalCosts.cleaning },
        { id: "linen", name: t("bedLinen", { guests: period.guests }), amount: period.additionalCosts.linen },
        { id: "energy", name: t("energy"), amount: period.additionalCosts.energy },
        { id: "tax", name: t("avgTaxes"), amount: period.additionalCosts.tax },
      ].filter((item) => item.amount > 0);

  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
      {/* Heading */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark">
            {t("yourStay")}
          </h3>
          <p className="mt-0.5 font-[family-name:var(--font-lato)] text-xs text-text-muted">
            {t("orvelterHofCapacity")}
          </p>
        </div>
        <button
          type="button"
          onClick={onEditPeriod}
          className="font-[family-name:var(--font-lato)] text-xs font-medium text-terracotta transition-colors hover:text-terracotta-dark"
        >
          {t("edit")}
        </button>
      </div>

      {/* Dates */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#fbf8f6] p-3">
          <span className="block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-olive-light">
            {t("arrival")}
          </span>
          <span className="mt-1 block font-[family-name:var(--font-lato)] text-sm text-text-dark">
            {formatDisplayDate(period.checkIn)}
          </span>
        </div>
        <div className="rounded-xl bg-[#fbf8f6] p-3">
          <span className="block font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-olive-light">
            {t("departure")}
          </span>
          <span className="mt-1 block font-[family-name:var(--font-lato)] text-sm text-text-dark">
            {formatDisplayDate(period.checkOut)}
          </span>
        </div>
      </div>

      {/* Details row */}
      <div className="mb-5 flex items-center gap-4 rounded-xl bg-[#fbf8f6] px-4 py-3">
        <div className="flex items-center gap-1.5 font-[family-name:var(--font-lato)] text-sm text-olive-dark">
          <Moon size={14} className="text-olive-light" aria-hidden="true" />
          {nightLabel}
        </div>
        <div className="h-4 w-px bg-cream-dark" aria-hidden="true" />
        <div className="flex items-center gap-1.5 font-[family-name:var(--font-lato)] text-sm text-olive-dark">
          <Users size={14} className="text-olive-light" aria-hidden="true" />
          {t("personsCount", { count: period.guests })}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2 border-t border-cream-dark pt-4">
        {/* Accommodation */}
        <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
          <span>
            {t("stayPriceLabel", { pricePerNight: period.avgPricePerNight, nights: nightLabel })}
          </span>
          <span>&euro;{period.totalPrice.toLocaleString("nl-NL")}</span>
        </div>

        {/* Mandatory costs — dynamic from API items */}
        {costItems.map((item) => (
          <div key={item.id} className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
            <span>{item.name}</span>
            <span>&euro;{item.amount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
          </div>
        ))}

        {/* Upgrade items */}
        {upgradeItems && upgradeItems.length > 0 && (
          <>
            {upgradeItems.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-terracotta">
                <span>
                  {item.name}
                  {item.quantity > 1 ? ` (${item.quantity}×)` : ""}
                </span>
                <span>&euro;{item.amount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </>
        )}

        {/* Total */}
        <div className="flex items-baseline justify-between border-t border-cream-dark pt-2">
          <span className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
            {t("total")}
          </span>
          <span className="font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            &euro;{displayTotal.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Trust signals */}
      <div className="mt-5 space-y-2 border-t border-cream-dark pt-4">
        <div className="flex items-center gap-2 font-[family-name:var(--font-lato)] text-xs text-text-muted">
          <CalendarDays size={13} className="shrink-0 text-olive-light" aria-hidden="true" />
          {t("confirmationWithin24h")}
        </div>
        <div className="flex items-center gap-2 font-[family-name:var(--font-lato)] text-xs text-text-muted">
          <span className="shrink-0 text-olive-light" aria-hidden="true">&#10003;</span>
          {t("freeCancellation")}
        </div>
      </div>
    </div>
  );
}
