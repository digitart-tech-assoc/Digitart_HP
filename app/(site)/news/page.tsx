import Link from "next/link";

import NewsList from "@/components/news/NewsList";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSortedArticlesData } from "@/lib/news";

export const dynamic = "force-static";

export default function NewsPage() {
  const allArticlesData = getSortedArticlesData();

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32 font-sans text-slate-900 selection:bg-emerald-200">
      {/* Decorative background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-brand/15 blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] h-[50%] w-[30%] rounded-full bg-emerald-400/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[40%] w-[40%] rounded-full bg-cyan-400/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-12 px-6 py-12 md:space-y-16 md:px-12 md:py-20">
        <section className="relative text-center">
          {/* Background decoration */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />

          <Eyebrow className="mb-3">Latest News</Eyebrow>
          <h1 className="mb-6 text-4xl leading-tight font-black text-slate-900 md:text-6xl">
            お知らせ
          </h1>
          <p className="mx-auto max-w-2xl text-base font-medium text-slate-600 md:text-lg">
            活動記録やお知らせ、技術記事などを発信しています。
          </p>
        </section>

        <NewsList articles={allArticlesData} />

        <div className="flex justify-center pt-6">
          <Link
            href="/admin/news/login"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand px-4 py-2 text-sm font-bold text-brand-strong transition-all duration-300 hover:bg-brand hover:text-white md:px-6 md:py-2.5 md:text-base"
          >
            <svg
              className="h-4 w-4 shrink-0 md:h-5 md:w-5"
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
            記事を書く
          </Link>
        </div>
      </div>
    </div>
  );
}
