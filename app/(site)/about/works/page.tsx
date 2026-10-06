import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { WorksPage } from "@/features/works/components/WorksPage";
import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Works",
  description: "Digitartメンバーが生み出したプロジェクト・作品一覧",
  path: "/about/works",
});

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/works" />
      <WorksPage />
    </>
  );
}
