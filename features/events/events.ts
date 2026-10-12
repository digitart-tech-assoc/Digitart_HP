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
import { filterUpcomingEvents, UPCOMING_EVENTS_LIMIT } from "@/features/events/upcoming";
import { parseContent } from "@/lib/content";
import { addDays, todayInTokyo } from "@/lib/date";

/** content/events.json を検証し、日付順に並べて返す */
function loadEvents(): CalendarEvent[] {
  return parseContent("content/events.json", calendarEventsSchema, eventsData).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/**
 * 再ビルドせずに表示し続ける最大の日数。
 * main への変更がなくても、管理者パスワードの更新（毎週日曜）で週に 1 回は再デプロイされる
 * （.github/workflows/rotate-password.yml）。デプロイの遅れを見込み、1 日多くしている。
 */
const MAX_DAYS_BETWEEN_BUILDS = 8;

/**
 * トップページに渡す予定を返す。
 * ページは静的に生成され、表示時にクライアント側で「今日以降」に絞り込み直すため、
 * 次に再ビルドされるまでのどの日に見ても表示する件数分を出せるよう、
 * その期間中の予定と、期間後の予定を表示する件数分だけ含める。
 */
export function getUpcomingEvents(): CalendarEvent[] {
  const buildDate = todayInTokyo();
  const upcoming = filterUpcomingEvents(loadEvents(), buildDate);
  const lastDisplayDate = addDays(buildDate, MAX_DAYS_BETWEEN_BUILDS);
  const countUntilLastDisplayDate = upcoming.filter((event) => event.date < lastDisplayDate).length;
  return upcoming.slice(0, countUntilLastDisplayDate + UPCOMING_EVENTS_LIMIT);
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
