import { expect, it } from "vitest";

import { getTimeline } from "@/features/history/history";

it("リポジトリの content/history.json が正しい形式で、画像が存在する", () => {
  expect(getTimeline().length).toBeGreaterThan(0);
});
