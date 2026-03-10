import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Supporter",
  description: "Digitartを支える役員のご紹介",
  path: "/about/supporter",
});

export default function SupporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
