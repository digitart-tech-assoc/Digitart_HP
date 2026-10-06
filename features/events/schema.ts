import { z } from "zod";

import { imagePathSchema, requiredText } from "@/lib/contentSchema";

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

export const calendarEventsSchema = z.array(calendarEventSchema);

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

/** 年間行事の時期。EventsPage でタグの色分けに使う */
export const SEASONS = [
  "1st Semester",
  "Summer Vacation",
  "2nd Semester",
  "Spring Vacation",
] as const;

export type Season = (typeof SEASONS)[number];

/** content/annual-events.json の 1 件分（年間行事） */
export const annualEventSchema = z.object({
  /** 開催月。"4月"・"4-5月"・"12月, 1月" のように書く（月ごとの集計に使う） */
  month: z.string().regex(/\d+\s*月/, "month は「4月」「4-5月」のように書いてください"),
  season: z.enum(SEASONS),
  title: requiredText,
  desc: requiredText,
  image: imagePathSchema,
  /** 過去のレポートなどの URL（任意） */
  url: z.url().optional(),
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
