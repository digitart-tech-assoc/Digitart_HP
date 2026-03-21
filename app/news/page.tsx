import { getSortedArticlesData } from '@/lib/news';
import NewsList from '@/components/news/NewsList';

export const dynamic = 'force-static';

export default function NewsPage() {
  const allArticlesData = getSortedArticlesData();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 lg:p-16 selection:bg-emerald-200">
      <div className="max-w-4xl mx-auto space-y-10">

        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            Latest <span className="text-emerald-600">News</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium mt-2">
            活動記録やお知らせ、技術記事などを発信しています。
          </p>
        </section>

        <NewsList articles={allArticlesData} />

      </div>
    </div>
  );
}
