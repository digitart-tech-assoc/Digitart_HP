"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ARTICLE_CATEGORIES,
  type ArticleCategory,
  type ArticleSummary,
} from "@/features/news/schema";

type TabType = "all" | ArticleCategory;

const TABS: { id: TabType; label: string }[] = [
  { id: "all", label: "すべて" },
  ...(Object.entries(ARTICLE_CATEGORIES) as [ArticleCategory, { label: string }][]).map(
    ([id, { label }]) => ({ id, label }),
  ),
];

/** 記事一覧。カテゴリのタブで絞り込める */
export function NewsList({
  articles,
  maxItemsPerTab,
}: {
  articles: ArticleSummary[];
  /** 各タブに表示する最大件数（トップページなどで件数を絞るときに指定） */
  maxItemsPerTab?: number;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filtered = articles
    .filter((a) => activeTab === "all" || a.category === activeTab)
    .slice(0, maxItemsPerTab);

  // 上限より多く記事がある場合は「5+」のように表示する
  const countFor = (tab: TabType) => {
    const total =
      tab === "all" ? articles.length : articles.filter((a) => a.category === tab).length;
    if (maxItemsPerTab !== undefined && total > maxItemsPerTab) {
      return `${maxItemsPerTab}+`;
    }
    return String(total);
  };

  return (
    <div>
      {/* カテゴリのタブ */}
      <div className="mb-8 flex justify-center gap-2 md:mb-12 md:gap-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 md:px-6 md:py-2.5 md:text-base ${
              activeTab === tab.id
                ? "scale-105 bg-brand text-white shadow-lg shadow-brand/30"
                : "border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 text-xs font-medium md:text-sm ${activeTab === tab.id ? "text-white/80" : "text-slate-400"}`}
            >
              ({countFor(tab.id)})
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <ul className="flex flex-col gap-4 md:gap-6">
          {filtered.map(({ slug, date, title, excerpt, category }) => {
            const meta = ARTICLE_CATEGORIES[category];
            return (
              <li key={slug} className="group">
                <Link
                  href={`/news/${slug}`}
                  className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:flex-row md:items-stretch md:gap-6 md:p-6"
                >
                  {/* 左端のカテゴリ色の線 */}
                  <div
                    className="absolute top-0 bottom-0 left-0 w-1 opacity-80 transition-colors duration-300 group-hover:opacity-100 md:w-1.5"
                    style={{ backgroundColor: meta.color }}
                  />

                  {/* カテゴリと日付 */}
                  <div className="flex shrink-0 items-center justify-between gap-3 pt-0.5 pl-2 md:w-32 md:flex-col md:items-start md:justify-start md:pl-3">
                    <span
                      className="inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[10px] font-bold md:text-xs"
                      style={{
                        color: meta.color,
                        backgroundColor: meta.bg,
                        borderColor: `${meta.color}40`,
                      }}
                    >
                      {meta.label}
                    </span>
                    <time
                      dateTime={date}
                      className="font-mono text-sm font-bold text-slate-400 tabular-nums md:text-base"
                    >
                      {new Date(date).toLocaleDateString("ja-JP").replace(/\//g, ".")}
                    </time>
                  </div>

                  {/* タイトルと概要 */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="mb-2 text-lg leading-snug font-bold text-slate-800 transition-colors group-hover:text-brand md:text-xl md:leading-[1.5]">
                      {title}
                    </h3>
                    {excerpt && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 md:text-base">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  {/* クリックできることを示す矢印 */}
                  <div className="hidden items-center justify-center pr-2 md:flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 transition-colors duration-300 group-hover:bg-brand/10">
                      <svg
                        className="h-5 w-5 text-slate-400 transition-colors duration-300 group-hover:text-brand"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-12 text-center text-base font-medium text-slate-400 md:text-lg">
          {activeTab === "all" ? "まだ記事がありません" : "該当する記事がありません"}
        </p>
      )}
    </div>
  );
}
