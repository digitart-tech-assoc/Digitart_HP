import "server-only";

import annualEventsData from "@/content/annual-events.json";
import eventsData from "@/content/events.json";
import regularActivitiesData from "@/content/regular-activities.json";
import {
  annualEventsSchema,
  type CalendarEvent,
  calendarEventsSchema,
  regularActivitiesSchema,
} from "@/features/events/schema";
import { parseContent } from "@/lib/content";
import { todayInTokyo } from "@/lib/date";

/** content/events.json を検証し、日付順に並べて返す */
function loadEvents(): CalendarEvent[] {
  return parseContent("content/events.json", calendarEventsSchema, eventsData).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
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

/** 年間行事（content/annual-events.json） */
export function getAnnualEvents() {
  return parseContent(
    "content/annual-events.json",
    annualEventsSchema,
    annualEventsData,
    (events) => events.map((e) => e.image),
  );
}

/** 定例活動（content/regular-activities.json） */
export function getRegularActivities() {
  return parseContent(
    "content/regular-activities.json",
    regularActivitiesSchema,
    regularActivitiesData,
  );
}
