import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { getAllArticles } from "@/features/news/articles";
import { SITE_URL } from "@/lib/constants";

describe("sitemap", () => {
  const entries = sitemap();
  const byUrl = new Map(entries.map((e) => [e.url, e]));
  const articles = getAllArticles();

  it("サイト内のページと全記事を含み、外部リンクは含まない", () => {
    expect(byUrl.has(`${SITE_URL}/`)).toBe(true);
    expect(byUrl.has(`${SITE_URL}/about/works`)).toBe(true);
    for (const article of articles) {
      expect(byUrl.has(`${SITE_URL}/news/${article.slug}`)).toBe(true);
    }
    expect(entries.every((e) => e.url.startsWith(SITE_URL))).toBe(true);
  });

  it("記事の lastModified は公開日で、固定ページには付けない", () => {
    const [latest] = articles;
    expect(byUrl.get(`${SITE_URL}/news/${latest.slug}`)?.lastModified).toBe(latest.date);
    expect(byUrl.get(`${SITE_URL}/`)?.lastModified).toBe(latest.date);
    expect(byUrl.get(`${SITE_URL}/about`)?.lastModified).toBeUndefined();
  });

  it("URL が重複しない", () => {
    expect(byUrl.size).toBe(entries.length);
  });
});
