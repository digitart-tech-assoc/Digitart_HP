import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Events",
  description: "Digitartの年間イベントスケジュール",
  path: "/about/events",
});

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
