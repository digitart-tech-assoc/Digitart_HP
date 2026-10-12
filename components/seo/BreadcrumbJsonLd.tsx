import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbs } from "@/lib/breadcrumb";
import { SITE_URL } from "@/lib/constants";

type BreadcrumbJsonLdProps = {
  /** ページのパスを "/" で分けたもの（例: ["about", "works"]） */
  segments: string[];
  /** 最後の項目の名前。記事タイトルなど、NAV_LINKS にない名前を出したいときに渡す */
  currentLabel?: string;
};

/** パンくずリストの構造化データを出力する。app/(site)/@breadcrumb から呼ぶ */
export function BreadcrumbJsonLd({ segments, currentLabel }: BreadcrumbJsonLdProps) {
  const breadcrumbItems = generateBreadcrumbs(segments, SITE_URL, currentLabel);

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
