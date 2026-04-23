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
      <div className="flex justify-center gap-4 md:gap-8 border-b border-slate-200 mb-8 md:mb-12">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 md:pb-4 text-sm md:text-base font-bold tracking-wider border-b-[3px] transition-colors ${
              activeTab === tab.id
                ? 'border-[#8cc63f] text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs md:text-sm opacity-60">({countFor(tab.id)})</span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {filtered.map(({ id, date, title, excerpt, category }) => {
            const meta = category ? CAT_META[category] : null;
            return (
              <li key={id} className="group py-5 md:py-8">
                <Link href={`/news/${id}`} className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8">
                  {/* Left part: Date and Badge */}
                  <div className="flex items-center md:flex-col md:items-start gap-2 md:gap-2 shrink-0 md:w-36 pt-0.5">
                    <time dateTime={date} className="text-xs md:text-base font-bold text-slate-400 tabular-nums">
                      {new Date(date).toLocaleDateString('ja-JP')}
                    </time>
                    {meta && (
                      <span
                        className="inline-flex items-center justify-center text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        {meta.label}
                      </span>
                    )}
                  </div>

                  {/* Right part: Title and Excerpt */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-bold text-slate-800 group-hover:text-[#8cc63f] transition-colors leading-snug md:leading-[1.4]">
                      {title}
                    </h3>
                    {excerpt && (
                      <p className="mt-1 md:mt-3 text-sm md:text-base text-slate-500 leading-relaxed line-clamp-2">
                        {excerpt}
                      </p>
                    )}
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
