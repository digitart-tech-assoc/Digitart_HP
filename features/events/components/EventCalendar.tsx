"use client";

import { useSyncExternalStore } from "react";

import type { CalendarEvent, EventType } from "@/features/events/schema";
import {
  calendarEventKey,
  selectUpcomingEvents,
  UPCOMING_EVENTS_LIMIT,
} from "@/features/events/upcoming";
import { msUntilNextDayInTokyo, todayInTokyo } from "@/lib/date";

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

/**
 * 日付が変わったときに再描画させる。開いたまま日をまたいだタブや、
 * 「戻る」で復元したページ（bfcache）でも終わった予定が残らないようにする
 */
function subscribeToday(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const scheduleNextDay = () => {
    clearTimeout(timer);
    // 端末の時計の誤差を見込み、日付が変わった少し後に確認する
    timer = setTimeout(() => {
      onChange();
      scheduleNextDay();
    }, msUntilNextDayInTokyo() + 1000);
  };
  // バックグラウンドのタブではタイマーが遅れるため、表示に戻ったときにも確認する
  const handleVisible = () => {
    if (document.visibilityState === "visible") {
      onChange();
      scheduleNextDay();
    }
  };

  scheduleNextDay();
  document.addEventListener("visibilitychange", handleVisible);
  window.addEventListener("pageshow", handleVisible);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", handleVisible);
    window.removeEventListener("pageshow", handleVisible);
  };
}

/** サーバー（ビルド時）では閲覧する日が分からないため null を返し、ビルド時に絞り込んだ予定をそのまま表示する */
function getTodayServerSnapshot() {
  return null;
}

type EventCalendarProps = {
  /** ビルド日以降、次に再ビルドされるまでに表示しうる予定（日付順） */
  events: CalendarEvent[];
};

/**
 * トップページに表示する、直近の予定（今日以降の数件）。
 * JavaScript が動かない環境や検索エンジンにも予定が見えるよう、ビルド時に絞り込んだ予定を HTML に含める。
 * ページは静的に生成されるため、ハイドレーション後に閲覧した日を基準に絞り込み直し、終わった予定を除く。
 */
export function EventCalendar({ events }: EventCalendarProps) {
  const today = useSyncExternalStore<string | null>(
    subscribeToday,
    todayInTokyo,
    getTodayServerSnapshot,
  );

  // events はビルド日以降の予定なので、ビルド時は先頭から表示する件数分を出す
  const rows =
    today === null ? events.slice(0, UPCOMING_EVENTS_LIMIT) : selectUpcomingEvents(events, today);

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
          const meta = TYPE_META[ev.type];

          return (
            <li
              key={calendarEventKey(ev)}
              className="group flex flex-col items-start gap-4 py-6 md:flex-row md:gap-8"
            >
              {/* Date */}
              <div className="w-16 shrink-0 md:w-24 md:pt-0.5">
                <span
                  className="text-base font-bold tabular-nums md:text-2xl"
                  style={{ color: isSun ? "#dc2626" : isSat ? "#2563eb" : "#1e293b" }}
                >
                  {d.getUTCMonth() + 1}/{d.getUTCDate()}
                  <span className="ml-1 text-xs md:text-base">({WEEKDAYS[day]})</span>
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
