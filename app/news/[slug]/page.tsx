import Link from 'next/link';
import { notFound } from 'next/navigation';
import 'katex/dist/katex.min.css';
import ArticleHeader from '../_components/ArticleHeader';
import ArticleMarkdown from '../_components/ArticleMarkdown';
import { getArticleData, getSortedArticlesData } from '@/lib/news';

export const dynamic = 'force-static';

// 静的パスを生成するための関数
export function generateStaticParams() {
  const articles = getSortedArticlesData();
  return articles.map((article) => ({
    slug: article.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = getArticleData(slug);
  if (!articleData) {
    return { title: '404 - Article Not Found' };
  }
  return {
    title: `${articleData.title} | Digitart News`,
    description: articleData.excerpt || 'Digitartテクノロジー愛好会のニュース記事',
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = getArticleData(slug);

  if (!articleData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 lg:p-16 selection:bg-emerald-200">
      <div className="max-w-3xl mx-auto space-y-6">
        {process.env.NODE_ENV === 'development' && (
          <div className="flex justify-end">
            <Link
              href={`/news/preview/${slug}`}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              開発用ライブプレビューを開く
            </Link>
          </div>
        )}
        <ArticleHeader article={articleData} />
        <ArticleMarkdown content={articleData.content} />
      </div>
    </div>
  );
}
