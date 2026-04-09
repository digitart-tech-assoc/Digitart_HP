import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "About",
  description: "青山学院大学の学生サークルDigitartの活動内容をご紹介。プログラミング、ゲーム開発、AI・機械学習など、最新のテクノロジーを学べます。年間イベントや制作物、メンバー情報も掲載。",
  keywords: ["青学", "青山学院大学", "サークル", "プログラミング", "ゲーム", "ゲーム開発", "AI", "機械学習", "テクノロジー", "学生団体"],
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
