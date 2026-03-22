"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

/* ─── Types ─── */
interface HeroSearchBarProps {
  unavailableDates?: string[];
  /** "verblijf" = date range (default), "zakelijk" = single date for arrangements */
  mode?: "verblijf" | "zakelijk";
}

interface CalendarMonth {
  year: number;
  month: number; // 0-indexed
}

/* ─── Helpers ─── */

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: string, b: string) {
  return a === b;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Monday=0 … Sunday=6 (ISO weekday) */
function getISOWeekday(year: number, month: number, day: number) {
  const d = new Date(year, month, day).getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1;
}

function addMonths(cm: CalendarMonth, n: number): CalendarMonth {
  const d = new Date(cm.year, cm.month + n, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

/* ─── Mini Calendar Grid ─── */
function MiniCalendarMonth({
  cm,
  unavailable,
  arrival,
  departure,
  hovered,
  onSelect,
  onHover,
  monthNames,
  dayLabels,
}: {
  cm: CalendarMonth;
  unavailable: Set<string>;
  arrival: string | null;
  departure: string | null;
  hovered: string | null;
  onSelect: (d: string) => void;
  onHover: (d: string | null) => void;
  monthNames: string[];
  dayLabels: string[];
}) {
  const today = toDateStr(new Date());
  const daysInMonth = getDaysInMonth(cm.year, cm.month);
  const startWeekday = getISOWeekday(cm.year, cm.month, 1);

  const rangeEnd = departure || hovered;

  function isInRange(ds: string) {
    if (!arrival || !rangeEnd) return false;
    return ds > arrival && ds < rangeEnd;
  }

  const cells: React.ReactNode[] = [];

  // Empty leading cells
  for (let i = 0; i < startWeekday; i++) {
    cells.push(<div key={`e${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const ds = toDateStr(new Date(cm.year, cm.month, day));
    const isPast = ds < today;
    const isUnavailable = unavailable.has(ds);
    const disabled = isPast || isUnavailable;
    const isArrival = arrival ? isSameDay(ds, arrival) : false;
    const isDeparture = departure ? isSameDay(ds, departure) : false;
    const inRange = isInRange(ds);
    const isSelected = isArrival || isDeparture;

    let bg = "";
    if (isSelected) bg = "bg-[#A4633C] text-white";
    else if (inRange) bg = "bg-[#A4633C]/10 text-[#3a3a35]";
    else if (disabled) bg = "text-[#c5c2bc]";
    else bg = "text-[#3a3a35] hover:bg-[#f5f0ea]";

    cells.push(
      <button
        key={day}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onSelect(ds)}
        onMouseEnter={() => !disabled && onHover(ds)}
        onMouseLeave={() => onHover(null)}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-[0.8125rem] transition-colors ${bg} ${disabled ? "cursor-default" : "cursor-pointer"} ${isArrival && rangeEnd ? "rounded-r-none" : ""} ${isDeparture ? "rounded-l-none" : ""} ${inRange ? "rounded-none" : ""}`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="w-[17rem]">
      <p className="mb-2 text-center font-[family-name:var(--font-playfair)] text-[0.9375rem] font-medium text-[#3a3a35]">
        {monthNames[cm.month]} {cm.year}
      </p>
      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {dayLabels.map((d) => (
          <div
            key={d}
            className="flex h-8 items-center justify-center text-[0.6875rem] font-bold uppercase tracking-wider text-[#6b6b63]"
          >
            {d}
          </div>
        ))}
      </div>
      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">{cells}</div>
    </div>
  );
}

/* ─── Main Component ─── */
export function HeroSearchBar({ unavailableDates = [], mode = "verblijf" }: HeroSearchBarProps) {
  const isZakelijk = mode === "zakelijk";
  const router = useRouter();
  const t = useTranslations("search");
  const MONTH_NAMES = t("months").split(",");
  const SHORT_MONTH_NAMES = t("shortMonths").split(",");
  const DAY_LABELS = t("dayLabels").split(",");
  const unavailableSet = useRef(new Set(unavailableDates));
  useEffect(() => {
    unavailableSet.current = new Set(unavailableDates);
  }, [unavailableDates]);

  // State
  const [arrival, setArrival] = useState<string | null>(null);
  const [departure, setDeparture] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pulseDates, setPulseDates] = useState(false);

  // Calendar navigation
  const now = new Date();
  const [calBase, setCalBase] = useState<CalendarMonth>({
    year: now.getFullYear(),
    month: now.getMonth(),
  });

  // Refs for click-outside
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Calendar date selection
  function handleDateSelect(ds: string) {
    if (isZakelijk) {
      setArrival(ds);
      setDeparture(null);
      setCalendarOpen(false);
      return;
    }
    if (!arrival || (arrival && departure)) {
      setArrival(ds);
      setDeparture(null);
    } else {
      if (ds <= arrival) {
        setArrival(ds);
        setDeparture(null);
      } else {
        const hasBlocked = unavailableDates.some((u) => u > arrival && u < ds);
        if (hasBlocked) {
          setArrival(ds);
          setDeparture(null);
        } else {
          setDeparture(ds);
          setCalendarOpen(false);
        }
      }
    }
  }

  // Search
  function handleSearch() {
    if (isZakelijk) {
      if (!arrival) {
        setPulseDates(true);
        setTimeout(() => setPulseDates(false), 1000);
        return;
      }
      router.push(
        `/boeken?type=arrangement&datum=${arrival}&personen=${guests}`
      );
      return;
    }
    if (!arrival || !departure) {
      setPulseDates(true);
      setTimeout(() => setPulseDates(false), 1000);
      return;
    }
    router.push(
      `/boeken?aankomst=${arrival}&vertrek=${departure}&personen=${guests}`
    );
  }

  // Can navigate back?
  const canGoBack =
    calBase.year > now.getFullYear() ||
    (calBase.year === now.getFullYear() && calBase.month > now.getMonth());

  // Display values
  const arrivalDate = arrival ? parseDate(arrival) : null;
  const departureDate = departure ? parseDate(departure) : null;

  const arrivalDay = arrivalDate ? arrivalDate.getDate() : now.getDate();
  const arrivalMonth = arrivalDate
    ? SHORT_MONTH_NAMES[arrivalDate.getMonth()]
    : SHORT_MONTH_NAMES[now.getMonth()];

  const defaultDeparture = new Date(now);
  defaultDeparture.setDate(defaultDeparture.getDate() + 1);
  const departureDay = departureDate
    ? departureDate.getDate()
    : defaultDeparture.getDate();
  const departureMonth = departureDate
    ? SHORT_MONTH_NAMES[departureDate.getMonth()]
    : SHORT_MONTH_NAMES[defaultDeparture.getMonth()];

  return (
    <div ref={calRef} className="relative z-20 w-full max-w-3xl">
      {/* Visual bar */}
      <div className="flex flex-col rounded-2xl shadow-xl shadow-black/10 md:flex-row">
        {/* ── White section ── */}
        <div className="flex flex-1 flex-row rounded-t-2xl bg-white/95 backdrop-blur-md md:rounded-l-2xl md:rounded-tr-none">
          {isZakelijk ? (
            <>
              {/* Single date field */}
              <button
                type="button"
                onClick={() => setCalendarOpen(!calendarOpen)}
                className={`flex flex-1 flex-col items-center justify-center rounded-tl-2xl px-3 py-3 transition-colors hover:bg-[#f5f0ea] md:px-6 md:py-5 ${pulseDates ? "animate-pulse bg-[#f5f0ea]" : ""}`}
              >
                <span className="mb-0.5 font-[family-name:var(--font-lato)] text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#6b6b63] md:mb-1 md:text-[0.65rem] md:tracking-[0.2em]">
                  {t("date")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-playfair)] text-[1.75rem] leading-none text-[#3a3a35] md:text-[2.75rem]">
                    {arrivalDay}
                  </span>
                  <span className="font-[family-name:var(--font-lato)] text-[0.7rem] text-[#6b6b63] md:text-[0.9rem]">
                    {arrivalMonth}
                  </span>
                </div>
              </button>
            </>
          ) : (
            <>
              {/* Check-in */}
              <button
                type="button"
                onClick={() => setCalendarOpen(!calendarOpen)}
                className={`flex flex-1 flex-col items-center justify-center rounded-tl-2xl px-3 py-3 transition-colors hover:bg-[#f5f0ea] md:px-6 md:py-5 ${pulseDates ? "animate-pulse bg-[#f5f0ea]" : ""}`}
              >
                <span className="mb-0.5 font-[family-name:var(--font-lato)] text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#6b6b63] md:mb-1 md:text-[0.65rem] md:tracking-[0.2em]">
                  {t("checkIn")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-playfair)] text-[1.75rem] leading-none text-[#3a3a35] md:text-[2.75rem]">
                    {arrivalDay}
                  </span>
                  <span className="font-[family-name:var(--font-lato)] text-[0.7rem] text-[#6b6b63] md:text-[0.9rem]">
                    {arrivalMonth}
                  </span>
                </div>
              </button>

              {/* Divider */}
              <div className="my-auto h-8 w-px bg-[#e5e0d8] md:h-auto md:self-stretch" />

              {/* Check-out */}
              <button
                type="button"
                onClick={() => setCalendarOpen(!calendarOpen)}
                className={`flex flex-1 flex-col items-center justify-center px-3 py-3 transition-colors hover:bg-[#f5f0ea] md:px-6 md:py-5 ${pulseDates ? "animate-pulse bg-[#f5f0ea]" : ""}`}
              >
                <span className="mb-0.5 font-[family-name:var(--font-lato)] text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#6b6b63] md:mb-1 md:text-[0.65rem] md:tracking-[0.2em]">
                  {t("checkOut")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-playfair)] text-[1.75rem] leading-none text-[#3a3a35] md:text-[2.75rem]">
                    {departureDay}
                  </span>
                  <span className="font-[family-name:var(--font-lato)] text-[0.7rem] text-[#6b6b63] md:text-[0.9rem]">
                    {departureMonth}
                  </span>
                </div>
              </button>
            </>
          )}

          {/* Divider */}
          <div className="my-auto h-8 w-px bg-[#e5e0d8] md:h-auto md:self-stretch" />

          {/* Guests */}
          <div className="flex flex-1 flex-col items-center justify-center px-3 py-3 md:px-6 md:py-5">
            <span className="mb-0.5 font-[family-name:var(--font-lato)] text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#6b6b63] md:mb-1 md:text-[0.65rem] md:tracking-[0.2em]">
              {t("guests")}
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={2}
                max={36}
                value={guests}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setGuests(Math.min(36, Math.max(2, v)));
                  else if (e.target.value === "") setGuests(2);
                }}
                className="w-[3ch] bg-transparent text-center font-[family-name:var(--font-playfair)] text-[1.75rem] leading-none text-[#3a3a35] outline-none md:text-[2.75rem] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(36, guests + 1))}
                  disabled={guests >= 36}
                  className="flex h-4 w-4 items-center justify-center text-[#6b6b63] transition-colors hover:text-[#3a3a35] disabled:text-[#ddd] md:h-5 md:w-5"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="md:h-3 md:w-3">
                    <path
                      d="M6 15l6-6 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(2, guests - 1))}
                  disabled={guests <= 2}
                  className="flex h-4 w-4 items-center justify-center text-[#6b6b63] transition-colors hover:text-[#3a3a35] disabled:text-[#ddd] md:h-5 md:w-5"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="md:h-3 md:w-3">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search button ── */}
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center justify-center rounded-b-2xl bg-terracotta px-6 py-3 font-[family-name:var(--font-lato)] text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-terracotta-dark md:rounded-r-2xl md:rounded-bl-none md:px-10 md:py-6 md:text-[0.7rem] md:tracking-[0.2em]"
        >
          {isZakelijk ? t("viewArrangementsLine1") : t("checkAvailabilityLine1")}
          <br />
          {isZakelijk ? t("viewArrangementsLine2") : t("checkAvailabilityLine2")}
        </button>
      </div>

      {/* ── Calendar dropdown (outside overflow container) ── */}
      {calendarOpen && (
        <div className="absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 rounded-2xl bg-white p-5 shadow-2xl shadow-black/15 ring-1 ring-black/5">
          {/* Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              disabled={!canGoBack}
              onClick={() => setCalBase(addMonths(calBase, -1))}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${canGoBack ? "hover:bg-[#f5f0ea] text-[#3a3a35]" : "text-[#ddd] cursor-default"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setCalBase(addMonths(calBase, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#3a3a35] transition-colors hover:bg-[#f5f0ea]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {/* Two months */}
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <MiniCalendarMonth
              cm={calBase}
              unavailable={unavailableSet.current}
              arrival={arrival}
              departure={isZakelijk ? null : departure}
              hovered={isZakelijk ? null : hovered}
              onSelect={handleDateSelect}
              onHover={isZakelijk ? () => {} : setHovered}
              monthNames={MONTH_NAMES}
              dayLabels={DAY_LABELS}
            />
            <MiniCalendarMonth
              cm={addMonths(calBase, 1)}
              unavailable={unavailableSet.current}
              arrival={arrival}
              departure={isZakelijk ? null : departure}
              hovered={isZakelijk ? null : hovered}
              onSelect={handleDateSelect}
              onHover={isZakelijk ? () => {} : setHovered}
              monthNames={MONTH_NAMES}
              dayLabels={DAY_LABELS}
            />
          </div>
        </div>
      )}
    </div>
  );
}
