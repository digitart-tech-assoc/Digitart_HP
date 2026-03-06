import { SITE_URL } from '@/lib/constants';
import { getSortedArticlesData } from '@/lib/news';
import { NAV_LINKS } from '@/lib/constants';

function formatDate(dateStr?: string) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function urlElement(loc: string, lastmod?: string, changefreq = 'monthly', priority = '0.5') {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${formatDate(lastmod)}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET() {
  const articles = getSortedArticlesData();

  const urls: string[] = [];

  // Top-level NAV_LINKS (and children)
  NAV_LINKS.forEach((link) => {
    const loc = `${SITE_URL}${link.href}`;
    urls.push(urlElement(loc, undefined, link.href === '/' ? 'weekly' : 'monthly', link.accent ? '0.8' : '0.6'));

    const children = (link as any).children as Array<any> | undefined;
    if (children && children.length > 0) {
      children.forEach((c) => {
        const childLoc = `${SITE_URL}${c.href}`;
        urls.push(urlElement(childLoc, undefined, 'monthly', '0.5'));
      });
    }
  });

  // Articles
  articles.forEach((a: any) => {
    const loc = `${SITE_URL}/news/${a.id}`;
    urls.push(urlElement(loc, a.date, 'never', '0.5'));
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
