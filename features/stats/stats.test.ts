import { expect, it } from "vitest";

import { getStats } from "@/features/stats/stats";

it("リポジトリの content/stats.json が正しい形式である", () => {
  const { stats, breakdowns } = getStats();
  expect(stats.length).toBeGreaterThan(0);
  expect(breakdowns.length).toBeGreaterThan(0);
});
