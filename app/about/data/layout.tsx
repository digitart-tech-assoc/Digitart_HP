import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Data",
  description: "数字で見るDigitartの規模や活動状況",
  path: "/about/data",
});

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
