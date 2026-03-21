import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "ニュース",
  description: "Digitartテクノロジー愛好会の最新ニュースや活動報告",
  path: "/news",
});

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
