import { expect, it } from "vitest";

import { getSupporters } from "@/features/supporters/supporters";

it("リポジトリの content/supporters.json が正しい形式で、画像が存在する", () => {
  const { members, qa } = getSupporters();
  expect(members.length).toBeGreaterThan(0);
  expect(qa.length).toBeGreaterThan(0);
});
