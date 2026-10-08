import { FestivalPage } from "@/features/festival/components/FestivalPage";
import { SAGAMIHARA_FES_2026 } from "@/features/festival/data";
import { getCustomMetadata } from "@/lib/metadata";

const HERO_IMAGE = "/images/events/sagamihara-fes.jpg";

export const metadata = getCustomMetadata({
  title: SAGAMIHARA_FES_2026.title,
  description: `${SAGAMIHARA_FES_2026.title}でのDigitart テクノロジー愛好会の展示案内。展示場所・開催日時・出展作品をご覧いただけます。`,
  keywords: ["相模原祭", "相模原祭2026", "青山学院大学", "学園祭", "Digitart"],
  image: HERO_IMAGE,
  path: "/sagamihara-fes/2026",
});

export default function Page() {
  return <FestivalPage festival={SAGAMIHARA_FES_2026} heroImage={HERO_IMAGE} />;
}
