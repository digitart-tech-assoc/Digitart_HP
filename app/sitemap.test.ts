import { beforeEach, describe, expect, it, vi } from "vitest";

import sitemap from "@/app/sitemap";
import { getAllArticles } from "@/features/news/articles";
import type { ArticleSummary } from "@/features/news/schema";
import { SITE_URL } from "@/lib/constants";

// 記事の追加や実行日によって結果が変わらないよう、記事の一覧と「今日」をテスト用の値にする
vi.mock("@/features/news/articles", () => ({ getAllArticles: vi.fn() }));
vi.mock("@/lib/date", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/date")>()),
  todayInTokyo: () => "2026-10-12",
}));

function article(slug: string, fields: Partial<ArticleSummary> = {}): ArticleSummary {
  return { slug, title: slug, date: slug.slice(0, 10), category: "notice", ...fields };
}

function sitemapWith(articles: ArticleSummary[]) {
  vi.mocked(getAllArticles).mockReturnValue(articles);
  const entries = sitemap();
  return { entries, byUrl: new Map(entries.map((e) => [e.url, e])) };
}

describe("sitemap", () => {
  beforeEach(() => {
    vi.mocked(getAllArticles).mockReset();
  });

  it("サイト内のページ・ナビゲーションにないページ・全記事を含み、外部リンクは含まない", () => {
    const { entries, byUrl } = sitemapWith([article("2026-09-01-a"), article("2026-08-01-b")]);

    expect(byUrl.has(`${SITE_URL}/`)).toBe(true);
    expect(byUrl.has(`${SITE_URL}/about/works`)).toBe(true);
    expect(byUrl.has(`${SITE_URL}/sagamihara-fes/2026`)).toBe(true);
    expect(byUrl.has(`${SITE_URL}/news/2026-09-01-a`)).toBe(true);
    expect(byUrl.has(`${SITE_URL}/news/2026-08-01-b`)).toBe(true);
    // URL は SITE_URL + パスで作るため、外部リンクが混ざると SITE_URL の後ろが "/" 以外になる
    for (const { url } of entries) {
      expect(url.slice(SITE_URL.length)).toMatch(/^\//);
    }
    expect(entries.some((e) => e.url.includes("auth.digitart.jp"))).toBe(false);
  });

  it("記事の lastModified は updated、なければ公開日", () => {
    const { byUrl } = sitemapWith([
      article("2026-09-01-a", { updated: "2026-10-01" }),
      article("2026-08-01-b"),
    ]);

    expect(byUrl.get(`${SITE_URL}/news/2026-09-01-a`)?.lastModified).toBe("2026-10-01");
    expect(byUrl.get(`${SITE_URL}/news/2026-08-01-b`)?.lastModified).toBe("2026-08-01");
  });

  it("/news の lastModified は記事の lastModified のうち最新のもの。トップページ・固定ページには付けない", () => {
    const { byUrl } = sitemapWith([
      article("2026-09-01-a"),
      article("2026-08-01-b", { updated: "2026-09-20" }),
    ]);

    expect(byUrl.get(`${SITE_URL}/news`)?.lastModified).toBe("2026-09-20");
    expect(byUrl.get(`${SITE_URL}/`)?.lastModified).toBeUndefined();
    expect(byUrl.get(`${SITE_URL}/about`)?.lastModified).toBeUndefined();
    expect(byUrl.get(`${SITE_URL}/sagamihara-fes/2026`)?.lastModified).toBeUndefined();
  });

  it("今日より後の日付の記事には lastModified を付けず、そのときは /news にも付けない", () => {
    const { byUrl } = sitemapWith([article("2026-12-01-future"), article("2026-09-01-a")]);

    expect(byUrl.get(`${SITE_URL}/news/2026-12-01-future`)?.lastModified).toBeUndefined();
    expect(byUrl.get(`${SITE_URL}/news/2026-09-01-a`)?.lastModified).toBe("2026-09-01");
    expect(byUrl.get(`${SITE_URL}/news`)?.lastModified).toBeUndefined();
  });

  it("URL が重複しない", () => {
    const { entries, byUrl } = sitemapWith([article("2026-09-01-a")]);
    expect(byUrl.size).toBe(entries.length);
  });
});
