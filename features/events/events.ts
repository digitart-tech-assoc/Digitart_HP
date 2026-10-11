import "server-only";

import { z } from "zod";

import eventsData from "@/content/events.json";
import { type CalendarEvent, calendarEventsSchema } from "@/features/events/schema";
import { selectUpcomingEvents } from "@/features/events/upcoming";
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
 * ビルドした日以降の直近の予定を、トップページに表示する件数分だけ返す。
 * ページは静的に生成されるため、表示時にクライアント側で「今日以降」に絞り込み直す。
 */
export function getUpcomingEvents(): CalendarEvent[] {
  return selectUpcomingEvents(loadEvents(), todayInTokyo());
}
