import React, { useState, useRef, useEffect } from "react";

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

type WeekDatePickerProps = {
  week: number;
  onChange: (week: number) => void;
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/**
 * Returns the Wednesday (week anchor) of the given ISO week.
 * Correct algorithm: Jan 4 is always in ISO week 1.
 */
function weekToWednesday(week: number, year?: number): Date {
  const y = year ?? new Date().getFullYear();
  // Jan 4 is always in ISO week 1
  const jan4 = new Date(y, 0, 4);
  const jan4Day = jan4.getDay() || 7; // Mon=1..Sun=7
  // Monday of ISO week 1
  const mondayW1 = new Date(y, 0, 4 - (jan4Day - 1));
  // Monday of target week
  const monday = new Date(mondayW1);
  monday.setDate(monday.getDate() + (week - 1) * 7);
  // Wednesday = Monday + 2
  const wed = new Date(monday);
  wed.setDate(wed.getDate() + 2);
  return wed;
}

export default function WeekDatePicker({ week, onChange }: WeekDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const anchorDate = weekToWednesday(week);
  const [viewDate, setViewDate] = useState(anchorDate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calDays: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(new Date(year, month, d));
  while (calDays.length % 7 !== 0) calDays.push(null);

  const calWeeks: (Date | null)[][] = [];
  for (let i = 0; i < calDays.length; i += 7) calWeeks.push(calDays.slice(i, i + 7));

  function handleSelect(day: Date) {
    onChange(getISOWeek(day));
    setIsOpen(false);
  }

  const displayDate = anchorDate.toLocaleDateString("pl-PL", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setViewDate(anchorDate); setIsOpen(!isOpen); }}
        className="flex h-8 items-center gap-2 rounded border border-oa-control bg-white px-3 text-sm shadow-sm transition hover:border-primary-50 focus:border-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-10 whitespace-nowrap"
      >
        <span className="text-oa-text">{displayDate}</span>
        <span className="rounded-md bg-primary-10 px-1.5 py-0.5 text-xs font-bold text-primary-80">
          W{week}
        </span>
        <svg className="h-3.5 w-3.5 shrink-0 text-oa-gray-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-oa-border bg-white p-3 shadow-lg">
          {/* Month navigation */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="rounded-lg px-2 py-1 text-oa-gray-40 hover:bg-oa-gray-5 hover:text-oa-text"
            >‹</button>
            <span className="text-sm font-semibold">{MONTH_NAMES[month]} {year}</span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="rounded-lg px-2 py-1 text-oa-gray-40 hover:bg-oa-gray-5 hover:text-oa-text"
            >›</button>
          </div>

          {/* Calendar grid */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-7 pb-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-primary-80">Wk</th>
                {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
                  <th key={d} className={`pb-1.5 text-center text-[10px] uppercase tracking-wide text-oa-gray-40 ${d === "We" ? "font-black text-base" : "font-semibold"}`}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calWeeks.map((wkDays, wi) => {
                const firstReal = wkDays.find(d => d !== null);
                const wNum = firstReal ? getISOWeek(firstReal) : null;
                const isSelectedWeek = wNum === week;
                return (
                  <tr key={wi}>
                    <td className="py-0.5 text-center">
                      <span className={`text-[10px] font-bold ${isSelectedWeek ? "text-primary-50" : "text-oa-gray-40"}`}>
                        {wNum}
                      </span>
                    </td>
                    {wkDays.map((day, di) => {
                      if (!day) return <td key={di} className="py-0.5" />;
                      const inSelectedWeek = getISOWeek(day) === week;
                      const isWednesday = di === 2;
                      const isAnchor = inSelectedWeek && isWednesday;
                      return (
                        <td key={di} className="py-0.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleSelect(day)}
                            className={`h-7 w-7 rounded-lg text-xs transition ${
                              isAnchor
                                ? "bg-primary-50 text-white font-black"
                                : inSelectedWeek
                                ? `bg-primary-10 text-primary-80 hover:bg-primary-50 hover:text-white ${isWednesday ? "font-black text-sm" : "font-medium"}`
                                : isWednesday
                                ? "font-black text-sm text-oa-text hover:bg-oa-gray-5"
                                : "font-medium text-oa-text hover:bg-oa-gray-5"
                            }`}
                          >
                            {day.getDate()}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
