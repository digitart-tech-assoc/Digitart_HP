import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Join Us",
  description: "Digitartテクノロジー愛好会への入会方法や各種お問い合わせ",
  path: "/join",
});

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
