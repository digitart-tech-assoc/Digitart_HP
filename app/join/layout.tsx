import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Join Us",
  description: "青山学院大学のDigitartテクノロジー愛好会への入会方法。プログラミングやゲーム開発の初心者も大歓迎です。仮入会フォームから参加できます。",
  keywords: ["青学", "サークル", "入会", "プログラミング", "ゲーム", "募集", "学生団体"],
  path: "/join",
});

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
