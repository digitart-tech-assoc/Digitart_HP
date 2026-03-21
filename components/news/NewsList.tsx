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

const CATEGORY_BADGE: Record<string, { label: string; className: string }> = {
  notice: {
    label: 'お知らせ',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
  column: {
    label: 'コラム',
    className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
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

  const countFor = (tab: TabType) => {
    const base =
      tab === 'all' ? articles.length : articles.filter((a) => a.category === tab).length;
    return maxItemsPerTab !== undefined ? Math.min(base, maxItemsPerTab) : base;
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs rounded-full px-1.5 py-0.5 leading-none font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {countFor(tab.id)}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map(({ id, date, title, excerpt, author, category }) => {
            const badge = category ? CATEGORY_BADGE[category] : null;
            return (
              <Link
                href={`/news/${id}`}
                key={id}
                className="group bg-white rounded-2xl p-5 md:px-6 md:py-5 shadow-sm hover:shadow-md border border-slate-200 transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

                <div className="flex flex-col grow text-left space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    {badge && (
                      <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    )}
                    <time dateTime={date} className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(date).toLocaleDateString('ja-JP')}
                    </time>
                    {author && (
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
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

                <div className="shrink-0 md:w-28 flex items-center justify-end text-sm font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors mt-1 md:mt-0">
                  記事を読む
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {activeTab === 'notice' ? 'お知らせ' : activeTab === 'column' ? 'コラム' : '記事'}がありません
          </h3>
          <p className="text-slate-600 font-medium">
            {activeTab === 'all'
              ? 'サークルの新しいニュースが投稿されるのをお待ちください。'
              : '他のタブもご覧ください。'}
          </p>
        </div>
      )}
    </div>
  );
}
