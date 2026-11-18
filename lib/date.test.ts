import { describe, expect, it } from "vitest";

import { todayInTokyo } from "@/lib/date";

describe("todayInTokyo", () => {
  it("UTC では前日でも、日本時間の日付を返す", () => {
    expect(todayInTokyo(new Date("2026-10-06T15:30:00Z"))).toBe("2026-10-07");
    expect(todayInTokyo(new Date("2026-10-06T14:59:59Z"))).toBe("2026-10-06");
  });
});
