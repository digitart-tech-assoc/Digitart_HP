"use client";

import { usePathname } from "next/navigation";
import { generateBreadcrumbs } from "@/lib/breadcrumb";
import { SITE_URL } from "@/lib/constants";
import JsonLd from "./JsonLd";

export default function BreadcrumbJsonLd() {
  const pathname = usePathname();
  const breadcrumbItems = generateBreadcrumbs(pathname, SITE_URL);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return <JsonLd data={breadcrumbJsonLd} />;
}
