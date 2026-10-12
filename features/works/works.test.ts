import { expect, it } from "vitest";

import { getProjects } from "@/features/works/works";

it("リポジトリの content/works.json が正しい形式で、画像が存在する", () => {
  expect(getProjects().length).toBeGreaterThan(0);
});
