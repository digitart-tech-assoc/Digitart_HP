import { z } from "zod";

import { calendarEventKey } from "@/features/events/upcoming";
import { imagePathSchema, optionalUrl, requiredText } from "@/lib/contentSchema";

/** 予定の種類。トップページの「直近のイベント」で、行頭の丸の色に使う */
export const EVENT_TYPES = [
  "welcome",
  "info",
  "activity",
  "study",
  "reserve",
  "event",
  "etc",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/**
 * content/events.json の 1 件分の形式。
 * 種類の打ち間違いや実在しない日付があると、ビルド時にどの予定が間違っているかを表示して失敗する。
 */
export const calendarEventSchema = z.object({
  date: z.iso.date("date は実在する日付を YYYY-MM-DD 形式で書いてください"),
  title: z.string().trim().min(1),
  type: z.enum(EVENT_TYPES),
  time: z.string().optional(),
  location: z.string().optional(),
});

/** 同じ日・時間・タイトルの予定が重複していないか確認する（表示時に予定を見分けるキーにも使う） */
export const calendarEventsSchema = z.array(calendarEventSchema).superRefine((events, ctx) => {
  const seen = new Set<string>();
  events.forEach((event, index) => {
    const key = calendarEventKey(event);
    if (seen.has(key)) {
      ctx.addIssue({
        code: "custom",
        message: "同じ日付・時間・タイトルの予定が重複しています",
        path: [index],
      });
    }
    seen.add(key);
  });
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

/** 年間行事の時期。EventsPage でタグの色分けに使う */
export const SEASONS = [
  "1st Semester",
  "Summer Vacation",
  "2nd Semester",
  "Spring Vacation",
] as const;

export type Season = (typeof SEASONS)[number];

// month の書き方。monthCounts.ts の parseMonths が受け付ける形に合わせ、1〜12 の月だけを全体一致で受け付ける
// （"13月" や "開催は4月ごろ" を通すと、月バーの集計で存在しない月に数えられ、本来の月に表示されない）
/** 1〜12 の月 */
const MONTH_NUMBER = "(?:1[0-2]|[1-9])";
/** "4月" または "4-5月"（年をまたぐ "11-2月" も可） */
const MONTH_PART = `${MONTH_NUMBER}(?:\\s*[-~〜]\\s*${MONTH_NUMBER})?\\s*月`;
/** "4月"・"4-5月"・"12月, 1月" のように、月か月の範囲を , か 、 で区切って並べたもの */
const MONTH_PATTERN = new RegExp(`^${MONTH_PART}(?:\\s*[,、]\\s*${MONTH_PART})*$`);

/** content/annual-events.json の 1 件分（年間行事） */
export const annualEventSchema = z.object({
  /** 開催月。"4月"・"4-5月"・"12月, 1月" のように書く（月ごとの件数の集計に使う） */
  month: z
    .string()
    .regex(MONTH_PATTERN, "month は「4月」「4-5月」「12月, 1月」のように書いてください"),
  season: z.enum(SEASONS),
  title: requiredText,
  desc: requiredText,
  image: imagePathSchema,
  /** 過去のレポートなどの URL。ないときは null */
  url: optionalUrl,
});

export const annualEventsSchema = z.array(annualEventSchema);

export type AnnualEvent = z.infer<typeof annualEventSchema>;

/** 定例活動のアイコン。EventsPage で lucide-react のアイコンに対応させる */
export const ACTIVITY_ICONS = ["calendar", "map-pin", "laptop"] as const;

/** content/regular-activities.json の 1 件分（定例活動） */
export const regularActivitySchema = z.object({
  label: requiredText,
  detail: requiredText,
  icon: z.enum(ACTIVITY_ICONS),
});

export const regularActivitiesSchema = z.array(regularActivitySchema);

export type RegularActivity = z.infer<typeof regularActivitySchema>;
