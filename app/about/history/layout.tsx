import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "History",
  description: "Digitartの設立からの歴史と歩み",
  path: "/about/history",
});

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
