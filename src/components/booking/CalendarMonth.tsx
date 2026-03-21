"use client";

import type { DayStatus, DayRenderStatus } from "./types";
import { useTranslations } from "next-intl";
import CalendarDay from "./CalendarDay";
import { todayISO } from "./dateUtils";

interface CalendarMonthProps {
  year: number;
  month: number; // 0-indexed
  statusMap: Map<string, DayStatus>;
  getDayRenderStatus: (date: string) => DayRenderStatus;
  isDateSelectable: (date: string) => boolean;
  isInRange: (date: string) => boolean;
  isRangeStart: (date: string) => boolean;
  isRangeEnd: (date: string) => boolean;
  onDateClick: (date: string) => void;
  onDateHover: (date: string | null) => void;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDate(y: number, m: number, d: number): string {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export default function CalendarMonth({
  year,
  month,
  statusMap,
  getDayRenderStatus,
  isDateSelectable,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onDateClick,
  onDateHover,
}: CalendarMonthProps) {
  const t = useTranslations("bookingModule");
  const today = todayISO();
  const WEEKDAYS = Array.from({ length: 7 }, (_, i) => t(`weekdays.${i}`));

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday = 0, Sunday = 6 (ISO week)
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return (
    <div className="min-w-0 flex-1">
      <h3 className="mb-4 text-center font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
        {t(`monthNames.${month}`)} {year}
      </h3>

      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center font-[family-name:var(--font-lato)] text-xs font-bold uppercase tracking-wider text-[#6b746f]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7" role="grid">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-14" />;
          }
          const dateStr = formatDate(year, month, day);
          const status = statusMap.get(dateStr);
          const renderStatus = getDayRenderStatus(dateStr);
          return (
            <CalendarDay
              key={dateStr}
              date={dateStr}
              dayNumber={day}
              status={status}
              renderStatus={renderStatus}
              isSelectable={isDateSelectable(dateStr)}
              inRange={isInRange(dateStr)}
              isStart={isRangeStart(dateStr)}
              isEnd={isRangeEnd(dateStr)}
              isToday={dateStr === today}
              onClick={onDateClick}
              onHover={onDateHover}
            />
          );
        })}
      </div>
    </div>
  );
}
