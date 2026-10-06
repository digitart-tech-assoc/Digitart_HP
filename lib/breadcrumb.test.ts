import { describe, expect, it } from "vitest";

import { generateBreadcrumbs } from "@/lib/breadcrumb";

const SITE = "https://example.com";

describe("generateBreadcrumbs", () => {
  it("階層の名前を NAV_LINKS から引く", () => {
    expect(generateBreadcrumbs("/about/works", SITE)).toEqual([
      { name: "Home", url: SITE },
      { name: "About", url: `${SITE}/about` },
      { name: "Works", url: `${SITE}/about/works` },
    ]);
  });

  it("最後の項目は currentLabel を優先する", () => {
    expect(generateBreadcrumbs("/news/2026-04-01-hello", SITE, "記事タイトル").at(-1)).toEqual({
      name: "記事タイトル",
      url: `${SITE}/news/2026-04-01-hello`,
    });
  });

  it("NAV_LINKS にない階層はセグメントをそのまま名前にする", () => {
    expect(generateBreadcrumbs("/unknown/", SITE).at(-1)).toEqual({
      name: "unknown",
      url: `${SITE}/unknown`,
    });
  });

  it("トップページは Home だけ", () => {
    expect(generateBreadcrumbs("/", SITE)).toEqual([{ name: "Home", url: SITE }]);
  });
});
