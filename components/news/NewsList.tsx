"use client";

import Link from "next/link";
import { useState } from "react";

type Article = {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
  image?: string;
  category?: "notice" | "column";
};

type TabType = "all" | "notice" | "column";

const TABS: { id: TabType; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "notice", label: "お知らせ" },
  { id: "column", label: "コラム" },
];

const CAT_META: Record<"notice" | "column", { label: string; color: string; bg: string }> = {
  notice: { label: "お知らせ", color: "#b91c1c", bg: "#fee2e2" },
  column: { label: "コラム", color: "#3d7a18", bg: "#e8f4df" },
};

export default function NewsList({
  articles,
  maxItemsPerTab,
}: {
  articles: Article[];
  maxItemsPerTab?: number;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filtered = articles
    .filter((a) => activeTab === "all" || a.category === activeTab)
    .slice(0, maxItemsPerTab);

  // Count actual total vs capped; show "N+" if more articles exist beyond the cap
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
      {/* Tabs */}
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
          {filtered.map(({ id, date, title, excerpt, category }) => {
            const meta = category ? CAT_META[category] : null;
            return (
              <li key={id} className="group">
                <Link
                  href={`/news/${id}`}
                  className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:flex-row md:items-stretch md:gap-6 md:p-6"
                >
                  {/* Decorative line on the left */}
                  <div
                    className={`absolute top-0 bottom-0 left-0 w-1 transition-colors duration-300 md:w-1.5 ${
                      meta ? "" : "bg-slate-200"
                    } opacity-80 group-hover:opacity-100`}
                    style={meta ? { backgroundColor: meta.color } : {}}
                  />

                  {/* Date and Badge section */}
                  <div className="flex shrink-0 items-center justify-between gap-3 pt-0.5 pl-2 md:w-32 md:flex-col md:items-start md:justify-start md:pl-3">
                    {meta && (
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
                    )}
                    <time
                      dateTime={date}
                      className="font-mono text-sm font-bold text-slate-400 tabular-nums md:text-base"
                    >
                      {new Date(date).toLocaleDateString("ja-JP").replace(/\//g, ".")}
                    </time>
                  </div>

                  {/* Content section */}
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

                  {/* Optional icon/chevron for affordance */}
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
