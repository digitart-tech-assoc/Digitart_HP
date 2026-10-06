import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { EventsPage } from "@/features/events/components/EventsPage";
import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Events",
  description: "Digitartの年間イベントスケジュール",
  path: "/about/events",
});

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/events" />
      <EventsPage />
    </>
  );
}
