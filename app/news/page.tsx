import { getSortedArticlesData } from '@/lib/news';
import NewsList from '@/components/news/NewsList';

export const dynamic = 'force-static';

export default function NewsPage() {
  const allArticlesData = getSortedArticlesData();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-20 pb-32 selection:bg-emerald-200">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-16 py-20">

        <section className="text-center relative">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8cc63f]/10 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-3">
            Latest News
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
            お知らせ
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            活動記録やお知らせ、技術記事などを発信しています。
          </p>
        </section>

        <NewsList articles={allArticlesData} />

      </div>
    </div>
  );
}
