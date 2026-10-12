import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

/** 名前を NAV_LINKS から引けるページのパンくずリスト。記事タイトルなどを使うページは、同じパスの page.tsx を別に置く */
export default async function Page({ params }: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await params;
  return <BreadcrumbJsonLd segments={segments} />;
}
