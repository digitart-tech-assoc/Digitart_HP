import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { SAGAMIHARA_FES_2026 } from "@/features/festival/data";
import { getAllArticles } from "@/features/news/articles";
import {
  ORGANIZATION_ID,
  SAGAMIHARA_FES_2026_PATH,
  SITE_ALTERNATE_NAMES,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
  UNIVERSITY,
} from "@/lib/constants";

/**
 * 団体の構造化データ。検索エンジンや AI が「青山学院大学の、Webアプリ・ゲーム開発などに取り組む学生団体」と結び付けられるよう、
 * 大学（parentOrganization）・活動場所（location）・取り組む分野（knowsAbout）を入れる
 */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: SITE_ALTERNATE_NAMES,
  url: SITE_URL,
  logo: `${SITE_URL}/images/digitart_OGP.jpg`,
  image: `${SITE_URL}/images/digitart_OGP.jpg`,
  sameAs: [SOCIAL_LINKS.twitter.url, SOCIAL_LINKS.instagram.url],
  description: SITE_DESCRIPTION,
  email: SOCIAL_LINKS.email.address,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "入会・取材などのお問い合わせ",
    url: "https://auth.digitart.jp/contact",
    email: SOCIAL_LINKS.email.address,
    availableLanguage: "ja",
  },
  foundingDate: "2019",
  areaServed: "JP",
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: UNIVERSITY.name,
    url: UNIVERSITY.url,
    sameAs: UNIVERSITY.sameAs,
  },
  location: {
    "@type": "Place",
    name: `${UNIVERSITY.name} 相模原キャンパス`,
    address: {
      "@type": "PostalAddress",
      postalCode: "252-5258",
      addressRegion: "神奈川県",
      addressLocality: "相模原市中央区",
      streetAddress: "淵野辺5-10-1",
      addressCountry: "JP",
    },
  },
  knowsAbout: [
    "プログラミング",
    "Webアプリ開発",
    "ゲーム開発",
    "Unity",
    "Unreal Engine",
    "UI/UXデザイン",
    "3Dモデリング",
    "生成AI",
    "人工知能",
    "AI",
    "SI",
    "大規模言語モデル（LLM）",
    "機械学習",
  ],
};

/** サイトの構造化データ。検索結果にサイト名を正しく出してもらうため、サイト名と別名を入れる */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: SITE_ALTERNATE_NAMES,
  url: SITE_URL,
  inLanguage: "ja",
  publisher: { "@id": ORGANIZATION_ID },
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
      <JsonLd data={websiteJsonLd} />
      <BreadcrumbJsonLd pageTitles={getPageTitles()} />
      <Header />
      <main>{children}</main>
      <div className="flex flex-1 flex-col justify-end bg-slate-900">
        <Footer />
      </div>
    </>
  );
}
