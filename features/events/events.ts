import "server-only";

import { z } from "zod";

import eventsData from "@/content/events.json";
import { type CalendarEvent, calendarEventsSchema } from "@/features/events/schema";
import { filterUpcomingEvents, UPCOMING_EVENTS_LIMIT } from "@/features/events/upcoming";
import { addDays, todayInTokyo } from "@/lib/date";

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
