import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { SAGAMIHARA_FES_2026 } from "@/features/festival/data";

export default function Page() {
  return (
    <BreadcrumbJsonLd
      segments={["sagamihara-fes", "2026"]}
      currentLabel={SAGAMIHARA_FES_2026.title}
    />
  );
}
