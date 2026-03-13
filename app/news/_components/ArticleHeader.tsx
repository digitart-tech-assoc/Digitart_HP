import type { ArticleData } from '@/lib/news';

interface ArticleHeaderProps {
  article: Pick<ArticleData, 'title' | 'date' | 'author'>;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="space-y-6 flex flex-col items-start">
      <div className="flex flex-wrap items-center gap-3">
        <time
          dateTime={article.date}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(article.date).toLocaleDateString('ja-JP')}
        </time>
        {article.author && (
          <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {article.author}
          </div>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
        {article.title}
      </h1>
    </header>
  );
}
