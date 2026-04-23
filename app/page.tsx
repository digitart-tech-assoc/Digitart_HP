import Link from "next/link";
import { getSortedArticlesData } from "@/lib/news";
import HomeHero from "@/components/home/HomeHero";
import EventCalendar from "@/components/home/EventCalendar";
import NewsList from "@/components/news/NewsList";
import PickupPages from "@/components/home/PickupPages";
import JoinUs from "@/components/about/JoinUs";

import aboutHero    from "@/app/about/assets/works_hero.jpg";
import worksHero    from "@/app/about/assets/history_hero.jpg";
import newsHero     from "@/app/about/assets/events/sagamihara-fes.jpg";
import joinHero     from "@/app/about/assets/supporters_hero.jpg";

const PICKUP_ITEMS = [
  {
    href: "/about",
    en: "About",
    ja: "活動内容",
    desc: "プログラミング・ゲーム・デザインを横断するDigitartの活動を紹介します。",
    image: aboutHero,
    imagePosition: "bg-center",
  },
  {
    href: "/about/works",
    en: "Works",
    ja: "制作物",
    desc: "メンバーが生み出した作品・プロジェクトをご覧いただけます。",
    image: worksHero,
    imagePosition: "bg-center",
  },
  {
    href: "/news",
    en: "News",
    ja: "最新情報",
    desc: "サークルの最新情報やコラムをお届けします。",
    image: newsHero,
    imagePosition: "bg-center",
  },
  {
    href: "/join",
    en: "Join Us",
    ja: "入会案内",
    desc: "Digitartへの入会方法や活動日程を確認できます。",
    image: joinHero,
    imagePosition: "bg-center",
  },
];

export default function Home() {
  const allArticles = getSortedArticlesData();

  return (
    <div className="bg-transparent text-slate-900">
      {/* ── Hero ─────────────────────────────────────────── */}
      <HomeHero />

      {/* ── Main Content (slides over fixed hero) ────────── */}
      <main className="relative bg-white z-10 shadow-[0_-16px_40px_rgba(0,0,0,0.22)] overflow-hidden">

        {/* ── Schedule ─────────────────────────────────────── */}
        <section className="py-16 md:py-28 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="mb-10 md:mb-14">
              <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-2 md:mb-3">Events</p>
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 leading-tight">直近のイベント</h2>
            </div>
            <EventCalendar />
          </div>
        </section>

        {/* ── Pick Up Pages ─────────────────────────────────── */}
        <section className="py-16 md:py-28 border-b border-slate-100 bg-slate-50/60">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="mb-10 md:mb-14">
              <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-2 md:mb-3">Topics</p>
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 leading-tight">
                トピックス
              </h2>
            </div>
            <PickupPages items={PICKUP_ITEMS} />
          </div>
        </section>

        {/* ── News ─────────────────────────────────────────── */}
        <section className="py-16 md:py-28 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-10 md:mb-14">
              <div>
                <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-2 md:mb-3">Latest News</p>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 leading-tight">お知らせ</h2>
              </div>
              {/* Desktop "View All" */}
              <Link
                href="/news"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#6a9e2f] border-2 border-[#8cc63f] rounded-full hover:bg-[#8cc63f] hover:text-white transition-all duration-300"
              >
                すべて見る →
              </Link>
            </div>

            <NewsList articles={allArticles} maxItemsPerTab={5} />

            {/* Mobile "View All" */}
            <div className="mt-10 sm:hidden text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-[#6a9e2f] border-2 border-[#8cc63f] rounded-full hover:bg-[#8cc63f] hover:text-white transition-all duration-300"
              >
                すべて見る →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Join Us ──────────────────────────────────────── */}
        <JoinUs />
      </main>
    </div>
  );
}
