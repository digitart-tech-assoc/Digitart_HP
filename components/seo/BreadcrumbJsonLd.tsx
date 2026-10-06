import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbs } from "@/lib/breadcrumb";
import { SITE_URL } from "@/lib/constants";

type BreadcrumbJsonLdProps = {
  /** ページのパス（例: "/about/works"） */
  path: string;
  /** 最後の項目の名前。記事ページの記事タイトルなど、NAV_LINKS にない名前を出したいときに渡す */
  currentLabel?: string;
};

/** パンくずリストの構造化データを出力する。各ページの page.tsx から呼ぶ */
export function BreadcrumbJsonLd({ path, currentLabel }: BreadcrumbJsonLdProps) {
  const breadcrumbItems = generateBreadcrumbs(path, SITE_URL, currentLabel);

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
