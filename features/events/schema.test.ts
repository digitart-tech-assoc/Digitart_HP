import { describe, expect, it } from "vitest";

import eventsData from "@/content/events.json";
import { calendarEventsSchema } from "@/features/events/schema";
import { todayInTokyo } from "@/lib/date";

describe("calendarEventsSchema", () => {
  it("リポジトリの content/events.json が正しい形式である", () => {
    expect(calendarEventsSchema.safeParse(eventsData).success).toBe(true);
  });

  it.each([
    ["実在しない日付", { date: "2026-02-30" }],
    ["スラッシュ区切りの日付", { date: "2026/04/01" }],
    ["未定義の種類", { type: "infp" }],
    ["空のタイトル", { title: " " }],
  ])("%s を拒否する", (_, override) => {
    const event = { date: "2026-04-01", title: "説明会", type: "info", ...override };
    expect(calendarEventsSchema.safeParse([event]).success).toBe(false);
  });
});

describe("todayInTokyo", () => {
  it("UTC では前日でも、日本時間の日付を返す", () => {
    expect(todayInTokyo(new Date("2026-10-06T15:30:00Z"))).toBe("2026-10-07");
    expect(todayInTokyo(new Date("2026-10-06T14:59:59Z"))).toBe("2026-10-06");
  });
});
