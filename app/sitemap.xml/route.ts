import { getAllArticles } from "@/features/news/articles";
import { NAV_LINKS, SITE_URL } from "@/lib/constants";

function formatDate(dateStr?: string) {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function urlElement(loc: string, lastmod?: string, changefreq = "monthly", priority = "0.5") {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${formatDate(lastmod)}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET() {
  const articles = getAllArticles();

  const urls: string[] = [];

  // ナビゲーションのページ（外部サイトへのリンクは除く）
  NAV_LINKS.filter((link) => link.href.startsWith("/")).forEach((link) => {
    const loc = `${SITE_URL}${link.href}`;
    urls.push(
      urlElement(
        loc,
        undefined,
        link.href === "/" ? "weekly" : "monthly",
        link.accent ? "0.8" : "0.6",
      ),
    );

    link.children?.forEach((c) => {
      const childLoc = `${SITE_URL}${c.href}`;
      urls.push(urlElement(childLoc, undefined, "monthly", "0.5"));
    });
  });

  // 記事
  articles.forEach((a) => {
    const loc = `${SITE_URL}/news/${a.slug}`;
    urls.push(urlElement(loc, a.date, "never", "0.5"));
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
