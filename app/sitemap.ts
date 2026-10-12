import { getAllArticles } from "@/features/news/articles";
import { getInternalNavLinks, SAGAMIHARA_FES_2026_PATH, SITE_URL } from "@/lib/constants";
import { todayInTokyo } from "@/lib/date";

import type { MetadataRoute } from "next";

/**
 * /sitemap.xml を生成する。
 * lastModified は、正しい値が分かるページにだけ付ける（間違った日付を付けると、検索エンジンが lastmod 全体を信用しなくなるため）。
 * - 記事：内容を直した日（frontmatter の updated）、なければ公開日。ビルド日より後の日付（予告の記事など）は付けない
 * - ニュース一覧：記事の lastModified のうち最新のもの。lastModified のない記事があるときは、一覧の更新日が分からないので付けない
 * - トップページ・その他の固定ページ：付けない（トップページは記事のほかにイベントなども表示していて、更新日が分からないため）
 * changefreq と priority は Google が使っていないため出力しない。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const today = todayInTokyo();

  const articlePages = getAllArticles().map((article) => {
    const lastModified = article.updated ?? article.date;
    return {
      url: `${SITE_URL}/news/${article.slug}`,
      ...(lastModified <= today ? { lastModified } : {}),
    };
  });

  const articleDates = articlePages.map((page) => page.lastModified);
  const newsLastModified = articleDates.every((date) => date !== undefined)
    ? articleDates.reduce<string | undefined>(
        (latest, date) => (!latest || date > latest ? date : latest),
        undefined,
      )
    : undefined;

  const pages = getInternalNavLinks().map(({ href }) => ({
    url: `${SITE_URL}${href}`,
    ...(href === "/news" && newsLastModified ? { lastModified: newsLastModified } : {}),
  }));

  // ナビゲーションに載せていないページ
  const unlistedPages = [{ url: `${SITE_URL}${SAGAMIHARA_FES_2026_PATH}` }];

  return [...pages, ...unlistedPages, ...articlePages];
}
