import { ArrowDown, CalendarDays, MapPin } from "lucide-react";
import * as motion from "motion/react-client";

import { SmoothScrollLink } from "@/features/festival/components/SmoothScrollLink";
import { formatFestivalDate } from "@/features/festival/data";
import type { Festival } from "@/features/festival/schema";

type FestivalHeroProps = {
  festival: Festival;
  /** 背景画像（/images/... の形式） */
  image: string;
};

/** 学園祭ポータルの見出し。トップページのヒーローと同じ配色・タイポグラフィに揃えている */
export function FestivalHero({ festival, image }: FestivalHeroProps) {
  const days = festival.days.map((d) => {
    const { monthDay, weekday } = formatFestivalDate(d.date);
    return `${monthDay}(${weekday})`;
  });
  // 「相模原祭 2026」の年だけをブランドカラーにする
  const titleMatch = festival.title.match(/^(.*?)(\d{4})$/);

  return (
    <section className="relative flex min-h-[88svh] items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(170deg, rgba(15,30,10,0.45) 0%, rgba(8,20,5,0.68) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: "linear-gradient(to top, rgba(4,12,3,0.7) 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center"
      >
        <p className="mb-6 text-[10px] font-bold tracking-[0.22em] text-brand uppercase sm:text-xs md:mb-8 md:text-sm">
          <span className="block sm:inline">Digitart</span>
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">Sagamihara Festival Exhibition</span>
        </p>

        <h1
          className="mb-6 text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] font-black tracking-tight text-white"
          lang="ja"
        >
          {titleMatch ? (
            <>
              {titleMatch[1]}
              <span style={{ color: "var(--color-brand)" }}>{titleMatch[2]}</span>
            </>
          ) : (
            festival.title
          )}
        </h1>

        <p className="mb-8 text-lg font-bold whitespace-pre-line text-white md:text-2xl">
          {festival.catchphrase}
        </p>

        <p className="mb-10 max-w-xl text-sm leading-relaxed font-medium whitespace-pre-line text-white/85 sm:text-base md:max-w-2xl md:text-lg">
          {festival.lead}
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-white md:text-base">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <CalendarDays className="h-4 w-4 text-brand" />
            {days.join(" / ")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-brand" />
            {festival.venue.place}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <SmoothScrollLink
            targetId="works"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(140,198,63,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover md:px-10 md:py-4 md:text-base"
          >
            展示作品を見る
            <ArrowDown className="h-4 w-4 md:h-5 md:w-5" />
          </SmoothScrollLink>
          <SmoothScrollLink
            targetId="access"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-6 py-3 text-sm font-bold text-white/90 transition-all duration-300 hover:border-white hover:bg-white/10 hover:text-white md:px-9 md:py-4 md:text-base"
          >
            展示場所
            <ArrowDown className="h-4 w-4 md:h-5 md:w-5" />
          </SmoothScrollLink>
        </div>
      </motion.div>
    </section>
  );
}
