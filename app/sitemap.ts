import { getAllArticles } from "@/features/news/articles";
import { NAV_LINKS, type NavItem, SITE_URL } from "@/lib/constants";

import type { MetadataRoute } from "next";

/** NAV_LINKS から、サイト内のページのパスを子ページも含めて集める（外部サイトへのリンクは除く） */
function collectPaths(items: NavItem[]): string[] {
  return items.flatMap((item) => [
    ...(item.href.startsWith("/") ? [item.href] : []),
    ...(item.children ? collectPaths(item.children) : []),
  ]);
}

/**
 * /sitemap.xml を生成する。
 * lastModified は、正しい値が分かるページにだけ付ける（間違った日付を付けると、検索エンジンが lastmod 全体を信用しなくなるため）。
 * - 記事：公開日
 * - トップページ・ニュース一覧：最新の記事の公開日（記事の一覧を表示しているため）
 * - その他の固定ページ：付けない
 * changefreq と priority は Google が使っていないため出力しない。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const latestArticleDate = articles[0]?.date;
  const pagesWithArticles = new Set(["/", "/news"]);

  const pages = collectPaths(NAV_LINKS).map((path) => ({
    url: `${SITE_URL}${path}`,
    ...(pagesWithArticles.has(path) && latestArticleDate
      ? { lastModified: latestArticleDate }
      : {}),
  }));

  const articlePages = articles.map((article) => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: article.date,
  }));

  return [...pages, ...articlePages];
}
