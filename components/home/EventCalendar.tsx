"use client";

import { useMemo } from "react";
import eventsData from "@/lib/events.json";

type EventType = "welcome" | "info" | "activity" | "study" | "reserve";

interface CalendarEvent {
  date: string;
  title: string;
  type: EventType;
  time?: string;
  location?: string;
}

const events = eventsData as CalendarEvent[];

const TYPE_STYLES: Record<EventType, { dot: string; text: string }> = {
  welcome:  { dot: "bg-emerald-500", text: "text-emerald-600" },
  info:     { dot: "bg-violet-500",  text: "text-violet-600"  },
  activity: { dot: "bg-amber-500",   text: "text-amber-600"   },
  study:    { dot: "bg-teal-500",    text: "text-teal-600"    },
  reserve:  { dot: "bg-slate-400",   text: "text-slate-400"   },
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
      .sort((a, b) => a.date.localeCompare(b.date) || 0)
      .slice(0, DISPLAY_ROWS);
  }, []);

  if (rows.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome <span className="text-emerald-600">Events</span>
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 font-medium">2026年度 新入生向けイベント</p>
        </div>
        <span className="mb-0.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          新歓期間中
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {rows.map((ev, i) => {
          const d = new Date(ev.date + "T00:00:00");
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000);
          const dow = WEEKDAYS[d.getDay()];
          const isSun = d.getDay() === 0;
          const isSat = d.getDay() === 6;
          const dayLabel =
            diffDays === 0 ? "今日" : diffDays === 1 ? "明日" : diffDays === 2 ? "明後日" : null;

          return (
            <div
              key={i}
              className={`flex items-stretch gap-0 ${i < rows.length - 1 ? "border-b border-slate-100" : ""}`}
            >
              {/* Date column */}
              <div className="flex flex-col items-center justify-center gap-0.5 px-4 py-4 min-w-[72px] border-r border-slate-100 bg-slate-50/60">
                <span className={`text-[11px] font-bold ${isSun ? "text-rose-400" : isSat ? "text-sky-400" : "text-slate-400"}`}>
                  {d.getMonth() + 1}/{d.getDate()}
                </span>
                <span className={`text-[11px] font-bold ${isSun ? "text-rose-400" : isSat ? "text-sky-400" : "text-slate-400"}`}>
                  ({dow})
                </span>
                {dayLabel ? (
                  <span className="mt-1 text-[10px] font-bold rounded-full bg-emerald-500 text-white px-1.5 py-0.5 leading-none">
                    {dayLabel}
                  </span>
                ) : (
                  <span className="mt-1 text-[10px] font-semibold text-slate-400 leading-none">
                    {diffDays}日後
                  </span>
                )}
              </div>

              {/* Event info column */}
              <div className="flex items-center gap-3 px-4 py-4 flex-1">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_STYLES[ev.type].dot}`} />
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{ev.title}</p>
                  {(ev.time || ev.location) && (
                    <p className="mt-0.5 text-xs text-slate-400 font-medium leading-tight">
                      {[ev.time, ev.location].filter(Boolean).join("　")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
        {(Object.entries(TYPE_STYLES) as [EventType, { dot: string; text: string }][]).map(([t, s]) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            {{ welcome:"対面新歓", info:"説明会", activity:"活動", study:"講習会", reserve:"予備" }[t]}
          </span>
        ))}
      </div>
    </section>
  );
}
