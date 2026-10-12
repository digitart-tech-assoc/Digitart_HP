import { describe, expect, it } from "vitest";

import { getAnnualEvents, getRegularActivities } from "@/features/events/events";
import { parseMonths } from "@/features/events/monthCounts";

describe("リポジトリの年間行事・定例活動", () => {
  it("content/annual-events.json が正しく、すべての開催月を集計できる", () => {
    const events = getAnnualEvents();
    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(parseMonths(event.month).length).toBeGreaterThan(0);
    }
  });

  it("content/regular-activities.json が正しい", () => {
    expect(getRegularActivities().length).toBeGreaterThan(0);
  });
});
