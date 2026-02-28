import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { getArticleData, getSortedArticlesData } from '@/lib/news';

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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 lg:p-16 selection:bg-emerald-200">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link href="/news" className="inline-flex items-center text-slate-500 hover:text-emerald-600 font-bold transition-colors group">
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ニュース一覧へ戻る
        </Link>
        
        {/* Article Header */}
        <header className="space-y-6 flex flex-col items-start">
          <div className="flex flex-wrap items-center gap-3">
            <time dateTime={articleData.date} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(articleData.date).toLocaleDateString('ja-JP')}
            </time>
            {articleData.author && (
              <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {articleData.author}
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {articleData.title}
          </h1>
        </header>

        {/* Markdown Content rendered via react-markdown */}
        <article className="prose prose-slate prose-emerald md:prose-lg max-w-none bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Tailwind Typographyがない場合のフォールバック用カスタムスタイリング
              h1: ({node, ...props}) => <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-6 mb-4 pb-3 border-b-2 border-slate-100" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-100" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-6 mb-3 flex items-center gap-2" {...props}><span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>{props.children}</h3>,
              p: ({node, ...props}) => <p className="leading-relaxed text-slate-700 font-medium mb-5 text-base" {...props} />,
              a: ({node, ...props}) => <a className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4 decoration-emerald-200 hover:decoration-emerald-500 transition-all font-bold" target="_blank" rel="noopener noreferrer" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-5 space-y-1.5 text-slate-700 font-medium marker:text-emerald-500" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-5 space-y-1.5 text-slate-700 font-medium font-mono marker:text-emerald-600" {...props} />,
              li: ({node, ...props}) => <li className="pl-1 leading-relaxed" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-400 pl-4 py-1.5 my-4 bg-emerald-50/50 rounded-r-xl italic text-slate-600 font-medium" {...props} />,
              code: ({node, className, children, ref, ...props}) => {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <CodeBlock language={match[1]}>
                    {children}
                  </CodeBlock>
                ) : (
                  <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-sm font-mono border border-slate-200 wrap-break-word" {...props}>
                    {children}
                  </code>
                )
              },
              img: ({node, alt, ...props}) => (
                <span className="block my-10 rounded-2xl overflow-hidden shadow-md border border-slate-200">
                  <img className="w-full h-auto object-cover" alt={alt || 'Article image'} {...props} />
                </span>
              ),
              hr: ({node, ...props}) => <hr className="my-10 border-t-2 border-slate-100 border-dashed" {...props} />
            }}
          >
            {articleData.content}
          </ReactMarkdown>
        </article>

      </div>
    </main>
  );
}
