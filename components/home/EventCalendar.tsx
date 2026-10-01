"use client";

import { useMemo } from "react";

import eventsData from "@/content/events.json";

type EventType = "welcome" | "info" | "activity" | "study" | "reserve" | "event" | "etc";

interface CalendarEvent {
  date: string;
  title: string;
  type: EventType;
  time?: string;
  location?: string;
}

const events = eventsData as CalendarEvent[];

const TYPE_META: Record<EventType, { color: string }> = {
  welcome: { color: "#84cc16" }, // lime-500
  info: { color: "#8b5cf6" }, // violet-500
  activity: { color: "#f59e0b" }, // amber-500
  study: { color: "#14b8a6" }, // teal-500
  reserve: { color: "#94a3b8" }, // slate-400
  event: { color: "#84cc16" }, // lime-500
  etc: { color: "#94a3b8" }, // slate-400
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const DISPLAY_ROWS = 3;

export default function EventCalendar() {
  const rows = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter((e) => e.date >= toDateStr(today))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, DISPLAY_ROWS);
  }, []);

  if (rows.length === 0) return null;

  return (
    <div className="w-full">
      <ul className="divide-y divide-slate-100">
        {rows.map((ev, i) => {
          const d = new Date(ev.date + "T00:00:00");
          const dow = WEEKDAYS[d.getDay()];
          const isSun = d.getDay() === 0;
          const isSat = d.getDay() === 6;
          const meta = TYPE_META[ev.type] || { color: "#94a3b8" };

          return (
            <li key={i} className="group flex flex-col items-start gap-4 py-6 md:flex-row md:gap-8">
              {/* Date */}
              <div className="w-16 shrink-0 md:w-24 md:pt-0.5">
                <span
                  className="text-base font-bold tabular-nums md:text-2xl"
                  style={{ color: isSun ? "#dc2626" : isSat ? "#2563eb" : "#1e293b" }}
                >
                  {d.getMonth() + 1}/{d.getDate()}
                  <span className="ml-1 text-xs md:text-base">({dow})</span>
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-2 md:gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full md:h-3 md:w-3"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-base font-bold text-slate-800 md:text-xl">{ev.title}</span>
                </div>
                {(ev.time || ev.location) && (
                  <div className="ml-[1.3rem] flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 md:ml-[1.6rem] md:gap-6 md:text-base">
                    {ev.time && (
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="h-4 w-4 opacity-70 md:h-5 md:w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        {ev.time.replace(/~/g, "〜")}
                      </span>
                    )}
                    {ev.location && (
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="h-4 w-4 opacity-70 md:h-5 md:w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        {ev.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
