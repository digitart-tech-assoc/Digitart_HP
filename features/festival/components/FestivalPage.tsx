import { ArrowRight, Clock, ExternalLink, Map as MapIcon, MapPin } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";

import { JoinUsSection } from "@/components/sections/JoinUsSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { FestivalHero } from "@/features/festival/components/FestivalHero";
import { FestivalWorkList } from "@/features/festival/components/FestivalWorkList";
import { formatFestivalDate } from "@/features/festival/data";
import type { Festival } from "@/features/festival/schema";
import { SOCIAL_LINKS } from "@/lib/constants";

type FestivalPageProps = {
  festival: Festival;
  /** ヒーローの背景画像（/images/... の形式） */
  heroImage: string;
};

/** トップページと同じ見出しの組み方（英字ラベル + 大見出し） */
function SectionHeading({ en, ja, lead }: { en: string; ja: string; lead?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <Eyebrow className="mb-2 md:mb-3">{en}</Eyebrow>
      <h2 className="text-2xl leading-tight font-black text-slate-900 md:text-5xl">{ja}</h2>
      {lead && (
        <p className="mt-4 text-sm leading-relaxed font-medium text-slate-600 md:text-base">
          {lead}
        </p>
      )}
    </div>
  );
}

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8 },
} as const;

/** 学園祭ポータル（展示場所・作品一覧・SNS・団体紹介） */
export function FestivalPage({ festival, heroImage }: FestivalPageProps) {
  const { venue } = festival;

  return (
    <div className="bg-white text-slate-900">
      <FestivalHero festival={festival} image={heroImage} />

      {/* ── Access ───────────────────────────────────────── */}
      <section id="access" className="scroll-mt-16 border-b border-slate-100 py-16 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <SectionHeading en="Access" ja="開催日時・展示場所" />

          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            <motion.div {...fadeIn} className="space-y-6">
              {/* 開催日 */}
              <ul className="grid grid-cols-2 gap-3">
                {festival.days.map((day, i) => {
                  const { monthDay, weekday } = formatFestivalDate(day.date);
                  return (
                    <li
                      key={day.date}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-5"
                    >
                      <p className="text-[10px] font-bold tracking-[0.25em] text-brand-strong uppercase md:text-xs">
                        Day {i + 1}
                      </p>
                      <p className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
                        {monthDay}
                        <span className="ml-1 text-base font-bold text-slate-500">({weekday})</span>
                      </p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <Clock className="h-4 w-4 text-brand-strong" />
                        {day.open}〜{day.close}
                      </p>
                    </li>
                  );
                })}
              </ul>

              {/* 場所 */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 md:p-6">
                <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <MapPin className="h-4 w-4 text-brand-strong" />
                  {venue.campus}
                </p>
                <p className="text-2xl font-black text-slate-900 md:text-3xl">{venue.place}</p>
                <p className="mt-2 text-sm font-medium text-slate-500">{venue.address}</p>
                {venue.note && (
                  <p className="mt-4 rounded-xl bg-white p-3 text-sm leading-relaxed font-medium whitespace-pre-line text-slate-600">
                    {venue.note}
                  </p>
                )}
                <a
                  href={venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-brand px-5 py-2.5 text-sm font-bold text-brand-strong transition-all duration-300 hover:bg-brand hover:text-white"
                >
                  Google マップで開く
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            {/* 構内マップ */}
            <motion.div {...fadeIn} transition={{ duration: 0.8, delay: 0.15 }}>
              {venue.mapImage ? (
                <a
                  href={venue.mapImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-2xl border border-slate-100 shadow-sm transition-shadow hover:shadow-lg"
                  title="構内マップを拡大して見る"
                >
                  <ImageWithFallback
                    src={venue.mapImage}
                    alt={`${venue.campus} 構内マップ（展示場所: ${venue.place}）`}
                    className="h-full w-full object-contain"
                  />
                </a>
              ) : (
                <div className="flex aspect-[4/3] h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                  <MapIcon className="h-10 w-10" />
                  <p className="text-sm font-bold">構内マップは準備中です</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Works ────────────────────────────────────────── */}
      <section
        id="works"
        className="scroll-mt-16 border-b border-slate-100 bg-slate-50/60 py-16 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            en="Works"
            ja="展示作品"
            lead="メンバーが制作したゲーム・Webアプリ・ハードウェア作品を展示しています。「体験できます」の作品は会場で実際に遊べます。"
          />
          <FestivalWorkList works={festival.works} />
        </div>
      </section>

      {/* ── SNS ──────────────────────────────────────────── */}
      <section className="border-b border-slate-100 py-16 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <SectionHeading
            en="Follow Us"
            ja="最新情報"
            lead="展示の最新情報は SNS で発信しています。"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={SOCIAL_LINKS.twitter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-black/30 hover:shadow-md"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-700 transition-colors group-hover:bg-black group-hover:text-white">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
              <span>
                <span className="block text-lg font-bold text-slate-800 transition-colors group-hover:text-black">
                  {SOCIAL_LINKS.twitter.label}
                </span>
                <span className="block text-sm font-medium text-slate-500">
                  {SOCIAL_LINKS.twitter.handle}
                </span>
              </span>
            </a>
            <a
              href={SOCIAL_LINKS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-instagram/30 hover:shadow-md"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-700 transition-colors group-hover:bg-instagram group-hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2" />
                  <line
                    x1="17.5"
                    y1="6.5"
                    x2="17.51"
                    y2="6.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-lg font-bold text-slate-800 transition-colors group-hover:text-instagram">
                  {SOCIAL_LINKS.instagram.label}
                </span>
                <span className="block text-sm font-medium text-slate-500">
                  {SOCIAL_LINKS.instagram.handle}
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────── */}
      <section className="bg-slate-50/60 py-16 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <SectionHeading en="About Us" ja="Digitart について" />
          <motion.div {...fadeIn}>
            <p className="mb-8 max-w-3xl text-base leading-relaxed font-medium text-slate-600 md:text-lg">
              Digitart テクノロジー愛好会は青山学院大学公認の学生団体です。
              <br />
              プログラミング・ゲーム開発・デザインを横断しながら、仲間と一緒にプロダクトをつくっています。
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand px-6 py-2.5 text-sm font-bold text-brand-strong transition-all duration-300 hover:bg-brand hover:text-white md:text-base"
            >
              活動内容を見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <JoinUsSection />
    </div>
  );
}
