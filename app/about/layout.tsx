import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "About",
  description: "Digitartの活動内容、歴史、イベント、制作物などのご紹介",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
