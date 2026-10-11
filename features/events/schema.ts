import { z } from "zod";

import { calendarEventKey } from "@/features/events/upcoming";

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
