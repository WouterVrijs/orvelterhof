"use client";

import type { DayStatus, DayRenderStatus } from "./types";
import { useTranslations } from "next-intl";

interface CalendarDayProps {
  date: string;
  dayNumber: number;
  status: DayStatus | undefined;
  renderStatus: DayRenderStatus;
  isSelectable: boolean;
  inRange: boolean;
  isStart: boolean;
  isEnd: boolean;
  isToday: boolean;
  showPrices?: boolean;
  onClick: (date: string) => void;
  onHover: (date: string | null) => void;
}

export default function CalendarDay({
  date,
  dayNumber,
  status,
  renderStatus,
  isSelectable,
  inRange,
  isStart,
  isEnd,
  isToday,
  showPrices = true,
  onClick,
  onHover,
}: CalendarDayProps) {
  const t = useTranslations("bookingModule");
  const isSelected = isStart || isEnd;
  const isDiscount = renderStatus === "discount";
  const isOccupied = renderStatus === "occupied";
  const isPast = renderStatus === "past";
  const isOutside = renderStatus === "outside_horizon" || renderStatus === "no_data";
  const isBlockedForCheckout = renderStatus === "blocked_for_checkout";
  const isDisabled = !isSelectable;
  const hasPrice = showPrices && status?.price != null && isSelectable;

  // ── Outer cell: carries the range background band ─────────
  let cellClasses =
    "relative flex h-14 w-full items-center justify-center transition-colors duration-150";

  if (inRange && !isSelected) {
    cellClasses += " bg-[#5a625f]/8";
  }
  if (isStart && inRange) {
    cellClasses += " rounded-l-full";
  }
  if (isEnd && inRange) {
    cellClasses += " rounded-r-full";
  }

  // ── Inner circle ──────────────────────────────────────────
  let numberClasses =
    "group/day relative z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full transition-all duration-150";

  if (isSelected) {
    numberClasses += " bg-[#5a625f] text-white font-bold shadow-sm";
  } else if (isOccupied) {
    numberClasses += " text-[#c5c2bc] cursor-default";
  } else if (isPast || isOutside) {
    numberClasses += " text-[#d5d3ce] cursor-default";
  } else if (isBlockedForCheckout) {
    // Visually available-ish but muted — the user can see the date
    // exists but it's not reachable from the current check-in
    numberClasses += " text-[#b5b0a8] cursor-default";
  } else if (isSelectable) {
    numberClasses +=
      " cursor-pointer hover:bg-[#5a625f]/15 text-[#3a3a35]";
  } else {
    numberClasses += " text-[#ddd] cursor-default";
  }

  // Today ring
  if (isToday && !isSelected) {
    numberClasses += " ring-1 ring-[#5a625f]/40";
  }

  // ── Aria label ────────────────────────────────────────────
  let ariaLabel = `${dayNumber}`;
  if (isOccupied) ariaLabel += ` (${t("occupied")})`;
  else if (isPast) ariaLabel += ` (${t("past")})`;
  else if (isOutside) ariaLabel += ` (${t("notBookable")})`;
  else if (isBlockedForCheckout) ariaLabel += ` (${t("notAvailableAsCheckout")})`;
  else if (isDiscount) ariaLabel += ` (${t("discount")})`;
  if (isStart) ariaLabel += ` (${t("arrivalLabel")})`;
  if (isEnd) ariaLabel += ` (${t("departureLabel")})`;

  return (
    <div
      className={cellClasses}
      onMouseEnter={() => isSelectable && onHover(date)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onClick(date)}
        className={numberClasses}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
      >
        <span
          className={`text-sm leading-none ${
            isOccupied
              ? "line-through decoration-[#c5c2bc]"
              : isPast || isOutside
                ? "line-through decoration-[#d5d3ce]"
                : "font-medium"
          }`}
        >
          {dayNumber}
        </span>
        {hasPrice && (
          <span
            className={`mt-0.5 text-[0.5625rem] leading-none ${
              isSelected
                ? "text-white/70"
                : isDiscount
                  ? "text-[#b8704b] font-bold group-hover/day:text-[#b8704b]"
                  : "text-[#6b6b63]/50 group-hover/day:text-[#6b6b63]/70"
            }`}
          >
            €{status!.price}
          </span>
        )}
      </button>

      {/* Discount indicator with tooltip */}
      {isDiscount && !isSelected && (
        <>
          <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#b8704b]" />
          <span
            role="tooltip"
            className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#4a524f] px-2 py-1 font-[family-name:var(--font-lato)] text-[0.625rem] font-medium text-white opacity-0 shadow-md transition-opacity group-hover/day:opacity-100"
          >
            {t("lowSeasonDiscount")}
          </span>
        </>
      )}
    </div>
  );
}
