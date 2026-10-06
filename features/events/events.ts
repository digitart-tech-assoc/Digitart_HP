import "server-only";

import { z } from "zod";

import eventsData from "@/content/events.json";
import { type CalendarEvent, calendarEventsSchema } from "@/features/events/schema";
import { todayInTokyo } from "@/lib/date";

/** content/events.json を検証し、日付順に並べて返す */
function loadEvents(): CalendarEvent[] {
  const result = calendarEventsSchema.safeParse(eventsData);
  if (!result.success) {
    // パスの先頭の数字は配列の何番目か（0 始まり）を表す
    throw new Error(`content/events.json の形式が不正です\n${z.prettifyError(result.error)}`);
  }
  return result.data.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * ビルドした日以降の予定を返す。
 * ページは静的に生成されるため、「今日以降」への絞り込みはクライアント側で表示時に行う。
 * ここではビルド時点で確実に終わっている予定だけを除き、送るデータを減らす。
 */
export function getUpcomingEvents(): CalendarEvent[] {
  const buildDate = todayInTokyo();
  return loadEvents().filter((event) => event.date >= buildDate);
}
