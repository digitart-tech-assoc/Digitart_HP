import Link from "next/link";
import { getSortedArticlesData } from "@/lib/news";
import { SOCIAL_LINKS } from "@/lib/constants";
import HomeHero from "@/components/home/HomeHero";
import aboutHero from "@/app/about/assets/works_hero.jpg";
import newsHero from "@/app/about/assets/events/sagamihara-fes.jpg";
import joinHero from "@/app/about/assets/supporters_hero.jpg";
import bylawsHero from "@/app/about/assets/history_hero.jpg";

export const metadata = {
  title: "Home",
  description: "Digitartテクノロジー愛好会の公式ホームページ",
};

export default function Home() {
  const latestArticles = getSortedArticlesData().slice(0, 3);
  const pickupItems = [
    {
      href: "/about",
      title: "About",
      desc: "活動内容・イベント・制作物をまとめてチェック",
      image: aboutHero,
      imagePosition: "bg-center",
    },
    {
      href: "/news",
      title: "News",
      desc: "最新のお知らせや活動報告を公開中",
      image: newsHero,
      imagePosition: "bg-center",
    },
    {
      href: "/join",
      title: "Join Us",
      desc: "入会フローとお問い合わせ先はこちら",
      image: joinHero,
      imagePosition: "bg-center",
    },
    {
      href: "/bylaws",
      title: "Bylaws",
      desc: "サークル規約を確認できます",
      image: bylawsHero,
      imagePosition: "bg-center",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 lg:p-16 selection:bg-emerald-200">
      <div>
        <HomeHero />
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Pick Up <span className="text-emerald-600">Pages</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pickupItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className="group relative min-h-[180px] md:min-h-[200px] lg:min-h-[220px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div
                    className={`absolute inset-0 bg-cover ${item.imagePosition} transition-transform duration-500 group-hover:scale-105`}
                    style={{ backgroundImage: `url(${item.image.src})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/62 via-slate-900/48 to-emerald-900/52 group-hover:from-slate-900/56 group-hover:to-emerald-800/45 transition-colors" />
                  <div className="relative flex items-start justify-between gap-4 p-5 md:p-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <svg className="w-5 h-5 text-emerald-200 shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>


          <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Latest <span className="text-emerald-600">News</span>
            </h2>
            <Link href="/news" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              すべて見る
            </Link>
          </div>

          {latestArticles.length > 0 ? (
            <div className="flex flex-col gap-4">
              {latestArticles.map(({ id, date, title, excerpt }) => (
                <Link
                  key={id}
                  href={`/news/${id}`}
                  className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 md:px-6 md:py-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="space-y-2">
                    <time className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600" dateTime={date}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(date).toLocaleDateString("ja-JP")}
                    </time>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {title}
                    </h3>
                    {excerpt && <p className="text-sm md:text-base text-slate-600 font-medium line-clamp-2">{excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 font-medium">
              まだニュース記事はありません。
            </div>
          )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
            <a
              href={SOCIAL_LINKS.twitter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-transparent bg-gray-50 p-4 transition-all duration-300 hover:border-gray-200 hover:bg-white hover:shadow-lg"
            >
              <div className="rounded-xl bg-black p-2.5 text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-900" style={{ fontWeight: 700 }}>{SOCIAL_LINKS.twitter.label}</div>
                <div className="text-sm text-gray-500">{SOCIAL_LINKS.twitter.handle}</div>
              </div>
            </a>
            <a
              href={SOCIAL_LINKS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-transparent bg-gray-50 p-4 transition-all duration-300 hover:border-gray-200 hover:bg-white hover:shadow-lg"
            >
              <div className="rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-2.5 text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round"></line>
                </svg>
              </div>
              <div>
                <div className="text-gray-900" style={{ fontWeight: 700 }}>{SOCIAL_LINKS.instagram.label}</div>
                <div className="text-sm text-gray-500">{SOCIAL_LINKS.instagram.handle}</div>
              </div>
            </a>
            <a
              href={`mailto:${SOCIAL_LINKS.email.address}`}
              className="group flex items-center gap-4 rounded-2xl border border-transparent bg-gray-50 p-4 transition-all duration-300 hover:border-gray-200 hover:bg-white hover:shadow-lg"
            >
              <div className="rounded-xl bg-emerald-500 p-2.5 text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-900" style={{ fontWeight: 700 }}>{SOCIAL_LINKS.email.label}</div>
                <div className="text-sm text-gray-500">{SOCIAL_LINKS.email.address.split("@")[0]}</div>
              </div>
            </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
