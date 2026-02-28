import Link from 'next/link';
import { getSortedArticlesData } from '@/lib/news';

export const metadata = {
  title: 'ニュース | Digitart',
  description: 'Digitartテクノロジー愛好会の最新ニュースや活動報告',
};

export default function NewsPage() {
  const allArticlesData = getSortedArticlesData();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 lg:p-16 selection:bg-emerald-200">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            Latest <span className="text-emerald-600">News</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium mt-2">
            サークルの最新情報や活動記録、お知らせなどを発信しています。
          </p>
        </section>

        {/* News List Section */}
        <section>
          {allArticlesData.length > 0 ? (
            <div className="flex flex-col gap-4">
              {allArticlesData.map(({ id, date, title, excerpt, author }) => (
                <Link 
                  href={`/news/${id}`} 
                  key={id}
                  className="group bg-white rounded-2xl p-5 md:px-6 md:py-5 shadow-sm hover:shadow-md border border-slate-200 transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300"></div>
                  
                  {/* コンテンツ部分 (縦並び) */}
                  <div className="flex flex-col grow text-left space-y-2">
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                      <time dateTime={date} className="flex items-center gap-1.5 text-emerald-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(date).toLocaleDateString('ja-JP')}
                      </time>
                      {author && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {author}
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="text-slate-600 font-medium text-sm leading-snug line-clamp-2 md:mt-0.5">
                        {excerpt}
                      </p>
                    )}
                  </div>
                    
                  {/* ボタン部分 (右寄せ or 下寄せ) */}
                  <div className="shrink-0 md:w-28 flex items-center justify-end text-sm font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors mt-1 md:mt-0">
                    記事を読む
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">公開された記事がありません</h3>
              <p className="text-slate-600 font-medium">サークルの新しいニュースが投稿されるのをお待ちください。</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
