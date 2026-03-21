"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ArrangementOption, SelectedArrangement, BookingType } from "./bookingFlowTypes";
import { ARRANGEMENTS } from "./arrangementsConfig";
import BookingTypeSelector from "./BookingTypeSelector";
import BookingStepIndicator from "./BookingStepIndicator";
import { Check, ChevronDown, ChevronUp, Calendar, Users } from "lucide-react";

interface ArrangementPickerProps {
  onTypeChange: (type: BookingType) => void;
  initialArrangementId?: string | null;
  initialDate?: string | null;
  initialGuests?: number;
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

export default function ArrangementPicker({
  onTypeChange,
  initialArrangementId,
  initialDate,
  initialGuests = 10,
}: ArrangementPickerProps) {
  const router = useRouter();
  const t = useTranslations("bookingModule");

  const [selectedId, setSelectedId] = useState<string | null>(initialArrangementId ?? null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [date, setDate] = useState(initialDate ?? "");
  const [guests, setGuests] = useState(initialGuests);

  const selected = useMemo(
    () => ARRANGEMENTS.find((a) => a.id === selectedId) ?? null,
    [selectedId],
  );

  // Price calculation
  const totalPrice = selected
    ? Math.round(selected.pricePerPerson * guests * 100) / 100
    : 0;

  const canProceed = selected !== null && date !== "" && guests >= 2;

  function handleConfirm() {
    if (!selected || !date) return;

    const arrangement: SelectedArrangement = {
      arrangementId: selected.id,
      name: selected.name,
      date,
      guests,
      pricePerPerson: selected.pricePerPerson,
      surchargeTotal: 0,
      totalPrice,
    };

    const params = new URLSearchParams({
      type: "arrangement",
      arrangement: JSON.stringify(arrangement),
      personen: String(guests),
      stap: "4", // Skip reisgezelschap + upgrades, go straight to gegevens
    });
    router.push(`/boeken?${params.toString()}`);
  }

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  return (
    <>
      <BookingStepIndicator currentStep={1} />
      <BookingTypeSelector value="arrangement" onChange={onTypeChange} />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Arrangement cards */}
        <div className="min-w-0 flex-1 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive font-[family-name:var(--font-lato)] text-sm font-bold text-white">
                1
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark md:text-2xl">
                {t("chooseArrangement")}
              </h2>
            </div>
            <p className="mt-2 pl-11 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-text-muted">
              {t("chooseArrangementDescription")}
            </p>
          </div>

          <div className="space-y-3">
            {ARRANGEMENTS.map((arr) => (
              <ArrangementCard
                key={arr.id}
                arrangement={arr}
                isSelected={selectedId === arr.id}
                isExpanded={expandedId === arr.id}
                onSelect={() => setSelectedId(arr.id)}
                onToggleExpand={() =>
                  setExpandedId(expandedId === arr.id ? null : arr.id)
                }
                guests={guests}
                perPersonLabel={t("perPerson")}
                hideDetailsLabel={t("hideDetails")}
                showDetailsLabel={t("showDetails")}
                surchargesLabel={t("surcharges")}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 lg:sticky lg:top-6 lg:w-80">
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <h3 className="mb-1 font-[family-name:var(--font-playfair)] text-xl text-olive-dark">
              {t("yourArrangement")}
            </h3>
            <p className="mb-5 font-[family-name:var(--font-lato)] text-xs text-text-muted">
              {t("orvelterHofCapacity30")}
            </p>

            {/* Selected arrangement */}
            {selected ? (
              <div className="mb-5 rounded-xl bg-cream px-4 py-3">
                <p className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                  {selected.name}
                </p>
                <p className="font-[family-name:var(--font-lato)] text-xs text-text-muted">
                  &euro;{selected.pricePerPerson.toFixed(2).replace(".", ",")} {t("perPerson")}
                </p>
              </div>
            ) : (
              <div className="mb-5 rounded-xl border border-dashed border-cream-dark px-4 py-4 text-center">
                <p className="font-[family-name:var(--font-lato)] text-sm text-text-muted">
                  {t("selectAnArrangement")}
                </p>
              </div>
            )}

            {/* Date picker */}
            <div className="mb-4">
              <label
                htmlFor="arrangement-date"
                className="mb-1.5 flex items-center gap-1.5 font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-text-muted"
              >
                <Calendar size={12} />
                {t("dateLabel")}
              </label>
              <input
                id="arrangement-date"
                type="date"
                value={date}
                min={minDate}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5 font-[family-name:var(--font-lato)] text-sm text-olive-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
              />
            </div>

            {/* Guest count */}
            <div className="mb-5">
              <label
                htmlFor="arrangement-guests"
                className="mb-1.5 flex items-center gap-1.5 font-[family-name:var(--font-lato)] text-[0.6875rem] font-bold uppercase tracking-wider text-text-muted"
              >
                <Users size={12} />
                {t("numberOfPersons")}
              </label>
              <select
                id="arrangement-guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5 font-[family-name:var(--font-lato)] text-sm text-olive-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
              >
                {Array.from({ length: 29 }, (_, i) => i + 2).map((n) => (
                  <option key={n} value={n}>
                    {t("personsCount", { count: n })}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            {selected && (
              <div className="mb-5 border-t border-cream-dark pt-4">
                <div className="flex items-baseline justify-between font-[family-name:var(--font-lato)] text-sm text-text-muted">
                  <span>
                    &euro;{selected.pricePerPerson.toFixed(2).replace(".", ",")} &times; {guests} pers.
                  </span>
                  <span>&euro;{totalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between border-t border-cream-dark pt-2">
                  <span className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                    {t("total")}
                  </span>
                  <span className="font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
                    &euro;{totalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {selected.surcharges && (
                  <p className="mt-2 font-[family-name:var(--font-lato)] text-xs text-text-muted">
                    {t("excludingSurcharges", { surcharges: selected.surcharges.join(", ") })}
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            <button
              type="button"
              disabled={!canProceed}
              onClick={canProceed ? handleConfirm : undefined}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all ${
                canProceed
                  ? "bg-terracotta text-white shadow-md hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
                  : "cursor-not-allowed bg-cream-dark/60 text-[#b5b0a8]"
              }`}
            >
              {canProceed ? t("proceedWithBooking") : t("selectArrangementAndDate")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Arrangement card ────────────────────────────────────────────

function ArrangementCard({
  arrangement,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  guests,
  perPersonLabel,
  hideDetailsLabel,
  showDetailsLabel,
  surchargesLabel,
}: {
  arrangement: ArrangementOption;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  guests: number;
  perPersonLabel: string;
  hideDetailsLabel: string;
  showDetailsLabel: string;
  surchargesLabel: string;
}) {
  const total = Math.round(arrangement.pricePerPerson * guests * 100) / 100;

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        isSelected
          ? "border-olive bg-olive/5 shadow-sm"
          : "border-cream-dark bg-warm-white hover:border-olive/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Select button + info */}
        <button
          type="button"
          onClick={onSelect}
          className="flex flex-1 items-start gap-3 text-left"
        >
          {/* Radio circle */}
          <span
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              isSelected
                ? "border-olive bg-olive"
                : "border-cream-dark bg-white"
            }`}
          >
            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-olive-light">
                {arrangement.icon === "clock" ? <ClockIcon /> : <CalendarIcon />}
              </span>
              <h3 className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                {arrangement.name}
              </h3>
            </div>
            <p className="mt-1 font-[family-name:var(--font-lato)] text-xs text-text-muted">
              {arrangement.description}
            </p>
            <p className="mt-2 font-[family-name:var(--font-playfair)] text-lg text-olive-dark">
              &euro;{arrangement.pricePerPerson.toFixed(2).replace(".", ",")}
              <span className="font-[family-name:var(--font-lato)] text-xs font-normal text-text-muted">
                {" "}{perPersonLabel}
              </span>
            </p>
          </div>
        </button>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream transition-colors hover:bg-cream-dark"
          aria-label={isExpanded ? hideDetailsLabel : showDetailsLabel}
        >
          {isExpanded ? (
            <ChevronUp size={16} className="text-olive-light" />
          ) : (
            <ChevronDown size={16} className="text-olive-light" />
          )}
        </button>
      </div>

      {/* Expandable details */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-4 pl-8">
            <hr className="mb-3 border-cream-dark" />
            <ul className="space-y-1.5">
              {arrangement.features.map((f) => (
                <li
                  key={f}
                  className="font-[family-name:var(--font-lato)] text-sm text-text-muted"
                >
                  <span className="mr-2 text-text-muted/50">&bull;</span>
                  {f}
                </li>
              ))}
            </ul>
            {arrangement.surcharges && (
              <div className="mt-3 rounded-lg bg-cream px-3 py-2">
                <p className="font-[family-name:var(--font-lato)] text-xs font-medium text-olive-dark">
                  {surchargesLabel}
                </p>
                {arrangement.surcharges.map((s) => (
                  <p key={s} className="font-[family-name:var(--font-lato)] text-xs text-text-muted">
                    {s}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
