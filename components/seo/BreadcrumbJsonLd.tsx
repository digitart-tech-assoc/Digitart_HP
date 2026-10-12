"use client";

import { usePathname } from "next/navigation";

import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbs } from "@/lib/breadcrumb";
import { SITE_URL } from "@/lib/constants";

type BreadcrumbJsonLdProps = {
  /** パス → 最後の項目の名前。記事タイトルなど、NAV_LINKS にない名前を出したいページだけ入れる */
  pageTitles: Record<string, string>;
};

/**
 * 表示中のパスに合わせたパンくずリストの構造化データを出力する。レイアウトから呼ぶ。
 * Client Component だが、静的生成のときにパスが決まるので HTML に含まれる
 */
export function BreadcrumbJsonLd({ pageTitles }: BreadcrumbJsonLdProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  // トップページは項目が Home だけになり意味がないため出力しない
  if (segments.length === 0) return null;

  const breadcrumbItems = generateBreadcrumbs(segments, SITE_URL, pageTitles[pathname]);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={breadcrumbJsonLd} />;
}
