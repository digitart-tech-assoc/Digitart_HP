'use client';

import Link from 'next/link';
import { useState } from 'react';

type Article = {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
  image?: string;
  category?: 'notice' | 'column';
};

type TabType = 'all' | 'notice' | 'column';

const TABS: { id: TabType; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'notice', label: 'お知らせ' },
  { id: 'column', label: 'コラム' },
];

const CAT_META: Record<'notice' | 'column', { label: string; color: string; bg: string }> = {
  notice: { label: 'お知らせ', color: '#b91c1c', bg: '#fee2e2' },
  column: { label: 'コラム',   color: '#3d7a18', bg: '#e8f4df' },
};

export default function NewsList({
  articles,
  maxItemsPerTab,
}: {
  articles: Article[];
  maxItemsPerTab?: number;
}) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filtered = articles
    .filter((a) => activeTab === 'all' || a.category === activeTab)
    .slice(0, maxItemsPerTab);

  // Count actual total vs capped; show "N+" if more articles exist beyond the cap
  const countFor = (tab: TabType) => {
    const total = tab === 'all' ? articles.length : articles.filter((a) => a.category === tab).length;
    if (maxItemsPerTab !== undefined && total > maxItemsPerTab) {
      return `${maxItemsPerTab}+`;
    }
    return String(total);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center gap-2 md:gap-4 mb-8 md:mb-12">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-bold rounded-full transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-[#8cc63f] text-white shadow-lg shadow-[#8cc63f]/30 scale-105'
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-sm border border-slate-200'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs md:text-sm font-medium ${activeTab === tab.id ? 'text-white/80' : 'text-slate-400'}`}>
              ({countFor(tab.id)})
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <ul className="flex flex-col gap-4 md:gap-6">
          {filtered.map(({ id, date, title, excerpt, category }) => {
            const meta = category ? CAT_META[category] : null;
            return (
              <li key={id} className="group">
                <Link
                  href={`/news/${id}`}
                  className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-6 bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Decorative line on the left */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 transition-colors duration-300 ${
                      meta ? '' : 'bg-slate-200'
                    } group-hover:opacity-100 opacity-80`}
                    style={meta ? { backgroundColor: meta.color } : {}}
                  />

                  {/* Date and Badge section */}
                  <div className="flex items-center justify-between md:flex-col md:items-start md:justify-start gap-3 shrink-0 md:w-32 pl-2 md:pl-3 pt-0.5">
                    {meta && (
                      <span
                        className="inline-flex items-center justify-center text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full border"
                        style={{
                          color: meta.color,
                          backgroundColor: meta.bg,
                          borderColor: `${meta.color}40`,
                        }}
                      >
                        {meta.label}
                      </span>
                    )}
                    <time
                      dateTime={date}
                      className="text-sm md:text-base font-bold text-slate-400 tabular-nums font-mono"
                    >
                      {new Date(date).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                    </time>
                  </div>

                  {/* Content section */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-[#8cc63f] transition-colors leading-snug md:leading-[1.5] mb-2">
                      {title}
                    </h3>
                    {excerpt && (
                      <p className="text-sm md:text-base text-slate-500 leading-relaxed line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  {/* Optional icon/chevron for affordance */}
                  <div className="hidden md:flex items-center justify-center pr-2">
                    <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-[#8cc63f]/10 flex items-center justify-center transition-colors duration-300">
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover:text-[#8cc63f] transition-colors duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-12 text-center text-base md:text-lg font-medium text-slate-400">
          {activeTab === 'all' ? 'まだ記事がありません' : '該当する記事がありません'}
        </p>
      )}
    </div>
  );
}
