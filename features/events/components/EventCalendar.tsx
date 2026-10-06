"use client";

import { useSyncExternalStore } from "react";

import type { CalendarEvent, EventType } from "@/features/events/schema";
import { todayInTokyo } from "@/lib/date";

/** 予定の種類ごとの、行頭の丸の色 */
const TYPE_DOT_CLASS: Record<EventType, string> = {
  welcome: "bg-lime-500",
  info: "bg-violet-500",
  activity: "bg-amber-500",
  study: "bg-teal-500",
  reserve: "bg-slate-400",
  event: "bg-lime-500",
  etc: "bg-slate-400",
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const DISPLAY_ROWS = 3;

// 日付は日をまたいだときにだけ変わる。開いたまま日付が変わるケースは再読み込みに任せ、購読はしない
function subscribeToday() {
  return () => {};
}

/** サーバー（ビルド時）では閲覧する日が分からないため null を返し、枠だけを表示する */
function getTodayServerSnapshot() {
  return null;
}

type EventCalendarProps = {
  /** ビルド日以降の予定（日付順） */
  events: CalendarEvent[];
};

/**
 * トップページに表示する、直近の予定（今日以降の数件）。
 * ページは静的に生成されるため、ビルド時に絞り込むと日がたつにつれて終わった予定が並んでしまう。
 * そのため「今日」の判定はハイドレーション後にクライアントで行う。
 */
export function EventCalendar({ events }: EventCalendarProps) {
  const today = useSyncExternalStore<string | null>(
    subscribeToday,
    todayInTokyo,
    getTodayServerSnapshot,
  );

  if (today === null) {
    return <EventCalendarSkeleton />;
  }

  const rows = events.filter((e) => e.date >= today).slice(0, DISPLAY_ROWS);

  if (rows.length === 0) {
    return (
      <p className="py-6 text-slate-500 md:text-lg">現在予定されているイベントはありません。</p>
    );
  }

  return (
    <div className="w-full">
      <ul className="divide-y divide-slate-100">
        {rows.map((ev) => {
          // 日付だけを扱うため UTC として解釈し、閲覧者のタイムゾーンで曜日がずれないようにする
          const d = new Date(`${ev.date}T00:00:00Z`);
          const day = d.getUTCDay();
          const isSun = day === 0;
          const isSat = day === 6;

          return (
            <li
              key={`${ev.date}-${ev.title}`}
              className="group flex flex-col items-start gap-4 py-6 md:flex-row md:gap-8"
            >
              {/* Date */}
              <div className="w-16 shrink-0 md:w-24 md:pt-0.5">
                <span
                  className={`text-base font-bold tabular-nums md:text-2xl ${
                    isSun ? "text-red-600" : isSat ? "text-blue-600" : "text-slate-800"
                  }`}
                >
                  {d.getUTCMonth() + 1}/{d.getUTCDate()}
                  <span className="ml-1 text-xs md:text-base">({WEEKDAYS[day]})</span>
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-2 md:gap-3">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full md:h-3 md:w-3 ${TYPE_DOT_CLASS[ev.type]}`}
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

/** 予定を表示するまでの枠。表示後に高さが大きく変わらないよう、予定と同じ行数・余白にする */
function EventCalendarSkeleton() {
  return (
    <div className="w-full" aria-busy="true" aria-label="直近のイベントを読み込み中">
      <ul className="divide-y divide-slate-100">
        {Array.from({ length: DISPLAY_ROWS }, (_, i) => (
          <li key={i} className="flex flex-col items-start gap-4 py-6 md:flex-row md:gap-8">
            <div className="h-6 w-16 shrink-0 animate-pulse rounded bg-slate-100 md:h-8 md:w-24" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-100 md:h-7" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100 md:h-6" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
