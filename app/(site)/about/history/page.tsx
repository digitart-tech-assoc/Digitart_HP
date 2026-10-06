import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { HistoryPage } from "@/features/history/components/HistoryPage";
import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "History",
  description: "Digitartの設立からの歴史と歩み",
  path: "/about/history",
});

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/history" />
      <HistoryPage />
    </>
  );
}
