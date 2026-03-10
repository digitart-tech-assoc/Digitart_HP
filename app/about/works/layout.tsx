import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Works",
  description: "Digitartメンバーが生み出したプロジェクト・作品一覧",
  path: "/about/works",
});

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
