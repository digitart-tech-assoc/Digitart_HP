"use client";

import type { ArticleFields } from "@/features/news/editor/types";
import { ARTICLE_CATEGORIES } from "@/features/news/schema";

const LABEL_CLASS = "mb-1.5 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase";
const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

type ArticleMetaFieldsProps = {
  fields: ArticleFields;
  onChange: <K extends keyof ArticleFields>(key: K, value: ArticleFields[K]) => void;
};

/** 記事のタイトル・著者・公開日・カテゴリ・ファイル名・概要の入力欄 */
export function ArticleMetaFields({ fields, onChange }: ArticleMetaFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div>
        <label className={LABEL_CLASS}>タイトル</label>
        <input
          type="text"
          value={fields.title}
          onChange={(e) => onChange("title", e.target.value)}
          className={INPUT_CLASS}
          placeholder="記事のタイトル"
          required
        />
      </div>
      <div>
        <label className={LABEL_CLASS}>著者</label>
        <input
          type="text"
          value={fields.author}
          onChange={(e) => onChange("author", e.target.value)}
          className={INPUT_CLASS}
          placeholder="Discord名"
          required
        />
      </div>
      <div>
        <label className={LABEL_CLASS}>公開日</label>
        <input
          type="date"
          value={fields.date}
          onChange={(e) => onChange("date", e.target.value)}
          className={INPUT_CLASS}
          required
        />
      </div>
      <div>
        <label className={LABEL_CLASS}>カテゴリ</label>
        <select
          value={fields.category}
          onChange={(e) => onChange("category", e.target.value)}
          className={`${INPUT_CLASS} appearance-none`}
        >
          {Object.entries(ARTICLE_CATEGORIES).map(([id, { label }]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2">
        <label className={LABEL_CLASS}>
          ファイル名（URLの一部になります） <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center">
          <span className="rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-4 py-2.5 font-mono text-sm text-slate-500">
            {fields.date}-
          </span>
          <input
            type="text"
            value={fields.slug}
            onChange={(e) => onChange("slug", e.target.value)}
            pattern="^[a-z0-9-]+$"
            title="半角英小文字、数字、ハイフンのみ使用できます"
            className="flex-1 rounded-r-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-slate-900 transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="snake-case-title"
            required
          />
          <span className="ml-2 font-mono text-sm text-slate-500">.md</span>
        </div>
        <p className="mt-1.5 ml-1 text-xs font-medium text-slate-400">
          半角英小文字、数字、ハイフンのみ使用可能
        </p>
      </div>
      <div className="col-span-2">
        <label className={LABEL_CLASS}>概要</label>
        <textarea
          value={fields.excerpt}
          onChange={(e) => onChange("excerpt", e.target.value)}
          className={`${INPUT_CLASS} resize-none`}
          rows={2}
          placeholder="ニュース一覧に表示される概要文"
        />
      </div>
    </div>
  );
}
