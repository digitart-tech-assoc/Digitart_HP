import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { SAGAMIHARA_FES_2026 } from "@/features/festival/data";
import { getAllArticles } from "@/features/news/articles";
import {
  SAGAMIHARA_FES_2026_PATH,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/constants";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "デジタルト テクノロジー愛好会",
  url: SITE_URL,
  logo: `${SITE_URL}/images/digitart_OGP.jpg`,
  sameAs: [SOCIAL_LINKS.twitter.url, SOCIAL_LINKS.instagram.url],
  description: SITE_DESCRIPTION,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    url: "https://auth.digitart.jp/contact",
  },
  foundingDate: "2020",
  areaServed: "JP",
  additionalType: "StudentOrganization",
};

/**
 * パンくずリストの最後の項目に、NAV_LINKS の名前の代わりに使うページのタイトル（パス → タイトル）。
 * 記事や学園祭のページのように、名前をデータから取るページはここに加える
 */
function getPageTitles(): Record<string, string> {
  return {
    ...Object.fromEntries(
      getAllArticles().map((article) => [`/news/${article.slug}`, article.title]),
    ),
    [SAGAMIHARA_FES_2026_PATH]: SAGAMIHARA_FES_2026.title,
  };
}

/** 公開サイト共通のレイアウト（ヘッダー・フッター・構造化データ） */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={orgJsonLd} />
      <BreadcrumbJsonLd pageTitles={getPageTitles()} />
      <Header />
      <main>{children}</main>
      <div className="flex flex-1 flex-col justify-end bg-slate-900">
        <Footer />
      </div>
    </>
  );
}
