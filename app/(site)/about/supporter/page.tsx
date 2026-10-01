import { SupportersPage } from "@/features/supporters/components/SupportersPage";
import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Supporter",
  description: "Digitartを支える役員のご紹介",
  path: "/about/supporter",
});

export default function Page() {
  return <SupportersPage />;
}
