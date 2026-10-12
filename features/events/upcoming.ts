import type { CalendarEvent } from "@/features/events/schema";

/** トップページの「直近のイベント」に表示する件数 */
export const UPCOMING_EVENTS_LIMIT = 3;

/**
 * `today`（YYYY-MM-DD）以降の予定だけを返す。
 * ビルド時（サーバー）と表示時（クライアント）の両方で同じ基準で絞り込むために使う。
 */
export function filterUpcomingEvents(events: CalendarEvent[], today: string): CalendarEvent[] {
  return events.filter((event) => event.date >= today);
}

/** 日付順に並んだ予定から、`today` 以降の予定を表示する件数分だけ返す */
export function selectUpcomingEvents(events: CalendarEvent[], today: string): CalendarEvent[] {
  return filterUpcomingEvents(events, today).slice(0, UPCOMING_EVENTS_LIMIT);
}

/** 予定を見分けるためのキー。同じ日に同じタイトルの予定が複数回あっても時間で区別する */
export function calendarEventKey(event: CalendarEvent): string {
  return `${event.date}|${event.time ?? ""}|${event.title}`;
}
