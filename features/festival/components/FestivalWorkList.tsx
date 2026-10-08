"use client";

import { ExternalLink, Gamepad2, Image as ImageIcon, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { FESTIVAL_WORK_CATEGORIES, type FestivalWork } from "@/features/festival/schema";

const ALL = "all";

/** 出展作品の一覧。カテゴリが 2 種類以上あるときはタブで絞り込める */
export function FestivalWorkList({ works }: { works: FestivalWork[] }) {
  const [active, setActive] = useState<string>(ALL);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [fades, setFades] = useState({ left: false, right: false });

  const updateFades = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setFades({
      left: el.scrollLeft > 1,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  }, []);

  // 画面幅が変わると「はみ出しているか」も変わるので、サイズ変化でも判定し直す
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateFades();
    const observer = new ResizeObserver(updateFades);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateFades]);

  // 作品が 1 件もないカテゴリのタブは出さない
  const categories = FESTIVAL_WORK_CATEGORIES.filter((c) => works.some((w) => w.category === c));
  const tabs = [{ id: ALL, label: "すべて" }, ...categories.map((c) => ({ id: c, label: c }))];
  const filtered = works.filter((w) => active === ALL || w.category === active);

  if (works.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center font-medium text-slate-500">
        出展作品は準備中です。公開までしばらくお待ちください。
      </p>
    );
  }

  return (
    <div>
      {categories.length > 1 && (
        // 折り返さずに 1 行で並べ、入りきらない幅では横スクロールにする。
        // 左右はセクションの余白（px-6 / md:px-12）まではみ出させ、画面端までスワイプできるようにする
        <div className="relative -mx-6 mb-6 md:-mx-12 md:mb-10">
          <div
            ref={scrollerRef}
            onScroll={updateFades}
            className="[scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
          >
            {/* w-max + mx-auto で、収まるときは中央寄せ・はみ出すときは左端から並べる（justify-center だと左端が見切れる） */}
            <div className="mx-auto flex w-max gap-1.5 px-6 py-2 sm:gap-2 md:gap-4 md:px-12">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active === tab.id}
                  onClick={(e) => {
                    setActive(tab.id);
                    // 端のタブを選んだときに、タブ全体が見える位置まで寄せる
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "nearest",
                    });
                  }}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-2.5 md:text-base ${
                    active === tab.id
                      ? "bg-brand text-white shadow-lg shadow-brand/30 md:scale-105"
                      : "border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {/* スクロールできる方向だけ端をフェードさせ、続きがあることを伝える */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-50 to-transparent transition-opacity duration-200 ${fades.left ? "opacity-100" : "opacity-0"}`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-50 to-transparent transition-opacity duration-200 ${fades.right ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      )}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((work) => (
          <li
            key={work.title}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative">
              {work.image ? (
                <ImageWithFallback
                  src={work.image}
                  alt={work.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                // 画像が未用意の作品は、構内マップの「準備中」と同じ見た目のプレースホルダーを出す
                <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 border-b border-dashed border-slate-300 bg-slate-50 text-slate-400">
                  <ImageIcon className="h-10 w-10" />
                  <p className="text-sm font-bold">準備中...</p>
                </div>
              )}
              <span className="absolute top-3 left-3 rounded-full bg-brand px-3 py-1 text-xs font-bold tracking-wider text-white">
                {work.category}
              </span>
              {work.playable && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-strong shadow-sm">
                  <Gamepad2 className="h-3.5 w-3.5" />
                  体験できます
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5 md:p-6">
              <h3 className="text-lg leading-snug font-black text-slate-900 md:text-xl">
                {work.title}
              </h3>
              {work.creators.length > 0 && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <Users className="h-3.5 w-3.5 shrink-0 text-brand-strong" />
                  {work.creators.join(" / ")}
                </p>
              )}
              <p className="mt-3 mb-5 text-sm leading-relaxed font-medium whitespace-pre-line text-slate-600">
                {work.desc}
              </p>

              {/* 技術スタック（左）とリンク（右）は、説明文の長さによらずカードの下端にそろえる */}
              {(work.tech.length > 0 || work.url) && (
                <div className="mt-auto flex items-end gap-3 border-t border-slate-100 pt-4">
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {work.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {work.url && (
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${work.title} を見る（新しいタブで開きます）`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-brand px-3.5 py-1.5 text-xs font-bold text-brand-strong transition-all duration-300 hover:bg-brand hover:text-white"
                    >
                      作品を見る
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
