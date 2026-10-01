import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SOCIAL_LINKS } from "@/lib/constants";

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

/** 公開サイト共通のレイアウト（ヘッダー・フッター・構造化データ） */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={orgJsonLd} />
      <BreadcrumbJsonLd />
      <Header />
      <main>{children}</main>
      <div className="flex flex-1 flex-col justify-end bg-slate-900">
        <Footer />
      </div>
    </>
  );
}
