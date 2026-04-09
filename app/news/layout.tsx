import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "ニュース",
  description: "Digitartテクノロジー愛好会の最新ニュースや活動報告。プログラミング、ゲーム開発、技術に関する情報などを発信しています。",
  keywords: ["青学", "サークル", "ニュース", "活動報告", "プログラミング", "ゲーム", "イベント"],
  path: "/news",
});

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
