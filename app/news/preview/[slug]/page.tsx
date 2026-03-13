import { notFound } from 'next/navigation';
import 'katex/dist/katex.min.css';
import PreviewArticleClient from '../../[slug]/PreviewArticleClient';
import { getArticleData } from '@/lib/news';

export const dynamic = 'force-dynamic';

export default async function PreviewArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const { slug } = await params;
  const articleData = getArticleData(slug);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 lg:p-16 selection:bg-emerald-200">
      <div className="max-w-3xl mx-auto">
        <PreviewArticleClient initialArticle={articleData} slug={slug} />
      </div>
    </div>
  );
}
