"use client";

import type { BookingType } from "./bookingFlowTypes";
import { useTranslations } from "next-intl";
import { Home, Users } from "lucide-react";

interface BookingTypeSelectorProps {
  value: BookingType;
  onChange: (type: BookingType) => void;
}

/**
 * Toggle between "verblijf" and "arrangement" booking at the top of step 1.
 */
export default function BookingTypeSelector({
  value,
  onChange,
}: BookingTypeSelectorProps) {
  const t = useTranslations("bookingModule");

  const OPTIONS: { type: BookingType; label: string; icon: typeof Home }[] = [
    { type: "verblijf", label: t("bookStay"), icon: Home },
    { type: "arrangement", label: t("bookArrangement"), icon: Users },
  ];

  return (
    <div className="mb-8 flex gap-1 rounded-xl border border-cream-dark bg-white p-1 shadow-sm">
      {OPTIONS.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-[family-name:var(--font-lato)] text-sm font-bold transition-all ${
            value === type
              ? "bg-olive text-white shadow-sm"
              : "text-text-muted hover:bg-cream hover:text-olive-dark"
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
