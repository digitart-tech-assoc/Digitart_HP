import Link from "next/link";

import JoinUs from "@/components/about/JoinUs";
import EventCalendar from "@/components/home/EventCalendar";
import HomeHero from "@/components/home/HomeHero";
import PickupPages from "@/components/home/PickupPages";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getAllArticles } from "@/features/news/articles";
import { NewsList } from "@/features/news/components/NewsList";

const PICKUP_ITEMS = [
  {
    href: "/about",
    en: "About",
    ja: "活動内容",
    desc: "プログラミング・ゲーム・デザインを横断するDigitartの活動を紹介します。",
    image: "/images/about/works-hero.jpg",
    imagePosition: "bg-center",
  },
  {
    href: "/about/works",
    en: "Works",
    ja: "制作物",
    desc: "メンバーが生み出した作品・プロジェクトをご覧いただけます。",
    image: "/images/about/history-hero.jpg",
    imagePosition: "bg-center",
  },
  {
    href: "/news",
    en: "News",
    ja: "最新情報",
    desc: "サークルの最新情報やコラムをお届けします。",
    image: "/images/events/sagamihara-fes.jpg",
    imagePosition: "bg-center",
  },
  {
    href: "/join",
    en: "Join Us",
    ja: "入会案内",
    desc: "Digitartへの入会方法や活動日程を確認できます。",
    image: "/images/about/supporters-hero.jpg",
    imagePosition: "bg-center",
  },
];

export default function Home() {
  const allArticles = getAllArticles();

  return (
    <div className="bg-transparent text-slate-900">
      <ScrollToTop />
      {/* ── Hero ─────────────────────────────────────────── */}
      <HomeHero />

      {/* ── Main Content (slides over fixed hero) ────────── */}
      <div className="relative z-10 overflow-hidden bg-white shadow-[0_-16px_40px_rgba(0,0,0,0.22)]">
        {/* ── Schedule ─────────────────────────────────────── */}
        <section className="border-b border-slate-100 py-16 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <div className="mb-10 md:mb-14">
              <Eyebrow className="mb-2 md:mb-3">Events</Eyebrow>
              <h2 className="text-2xl leading-tight font-black text-slate-900 md:text-5xl">
                直近のイベント
              </h2>
            </div>
            <EventCalendar />
          </div>
        </section>

        {/* ── Pick Up Pages ─────────────────────────────────── */}
        <section className="border-b border-slate-100 bg-slate-50/60 py-16 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <div className="mb-10 md:mb-14">
              <Eyebrow className="mb-2 md:mb-3">Topics</Eyebrow>
              <h2 className="text-2xl leading-tight font-black text-slate-900 md:text-5xl">
                トピックス
              </h2>
            </div>
            <PickupPages items={PICKUP_ITEMS} />
          </div>
        </section>

        {/* ── News ─────────────────────────────────────────── */}
        <section className="border-b border-slate-100 py-16 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <div className="mb-10 flex items-end justify-between md:mb-14">
              <div>
                <Eyebrow className="mb-2 md:mb-3">Latest News</Eyebrow>
                <h2 className="text-2xl leading-tight font-black text-slate-900 md:text-5xl">
                  お知らせ
                </h2>
              </div>
              {/* Desktop "View All" */}
              <Link
                href="/news"
                className="hidden items-center gap-2 rounded-full border-2 border-brand px-5 py-2.5 text-sm font-bold text-brand-strong transition-all duration-300 hover:bg-brand hover:text-white sm:inline-flex"
              >
                すべて見る →
              </Link>
            </div>

            <NewsList articles={allArticles} maxItemsPerTab={5} />

            <div className="mt-8 flex items-center justify-center gap-3 md:mt-10">
              {/* モバイルビューのみ表示する「すべて見る」ボタン */}
              <Link
                href="/news"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand px-6 py-2.5 text-sm font-bold text-brand-strong transition-all duration-300 hover:bg-brand hover:text-white sm:hidden"
              >
                すべて見る →
              </Link>
              {/* PCビュー：タブ同等サイズの「記事を書く」ボタン / スマホビュー：丸い鉛筆アイコンボタン */}
              <Link
                href="/admin/news/login"
                title="記事を書く"
                aria-label="記事を書く"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand text-brand-strong transition-all duration-300 hover:bg-brand hover:text-white sm:h-auto sm:w-auto sm:px-6 sm:py-2.5 sm:text-base sm:font-bold"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="ml-2 hidden sm:inline">記事を書く</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Join Us ──────────────────────────────────────── */}
        <JoinUs />
      </div>
    </div>
  );
}
