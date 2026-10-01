"use client";

import { ImagePlus, Loader2, Send } from "lucide-react";
import { useActionState, useRef, useState } from "react";

import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { publishArticleAction } from "@/features/news/editor/actions";
import { ArticleMetaFields } from "@/features/news/editor/components/ArticleMetaFields";
import { PublishSuccess } from "@/features/news/editor/components/PublishSuccess";
import type { ArticleFields, PublishState } from "@/features/news/editor/types";
import { useArticleImages } from "@/features/news/editor/useArticleImages";

const initialState: PublishState = {
  error: null,
  success: false,
  prUrl: null,
};

const initialFields: ArticleFields = {
  title: "",
  author: "",
  date: new Date().toISOString().split("T")[0],
  slug: "",
  category: "column",
  excerpt: "",
};

/**
 * 記事エディタ。左で Markdown を書き、右でプレビューを確認する。
 * 送信すると、記事と画像をコミットしたプルリクエストが GitHub に作成される。
 */
export function ArticleEditor() {
  const [state, formAction, isPending] = useActionState(publishArticleAction, initialState);

  const [fields, setFields] = useState<ArticleFields>(initialFields);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { images, insertImage, resolvePreviewImageSrc } = useArticleImages({
    date: fields.date,
    textareaRef,
    content,
    setContent,
  });

  const updateField = <K extends keyof ArticleFields>(key: K, value: ArticleFields[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      insertImage(e.clipboardData.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      insertImage(e.dataTransfer.files[0]);
    }
  };

  if (state.success) {
    return <PublishSuccess prUrl={state.prUrl} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="sticky top-0 z-10 flex flex-nowrap items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
        <h1 className="flex shrink-0 items-center gap-2 text-2xl font-bold whitespace-nowrap text-slate-900">
          記事の作成
        </h1>
        <div className="flex min-w-0 items-center gap-4">
          {state.error && (
            <span
              className="max-w-md truncate rounded-full border border-red-100 bg-red-50 px-3 py-1 text-sm font-bold text-red-500"
              title={state.error}
            >
              {state.error}
            </span>
          )}
          <button
            type="submit"
            form="publish-form"
            disabled={isPending}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-bold whitespace-nowrap text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 active:translate-y-0 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {isPending ? "送信中..." : "投稿リクエストを送信"}
          </button>
        </div>
      </header>

      {/* 送信用の非表示フォーム。入力欄は画面のあちこちにあるため、値をここに集めて送る */}
      <form id="publish-form" action={formAction} className="hidden">
        {Object.entries(fields).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="images" value={JSON.stringify(images)} />
      </form>

      <div className="flex h-[calc(100vh-73px)] flex-1 overflow-hidden">
        {/* 左: 入力欄と本文 */}
        <div className="flex w-1/2 flex-col border-r border-slate-200 bg-stone-50">
          <div className="space-y-5 overflow-y-auto border-b border-slate-200 bg-white/30 p-6">
            <ArticleMetaFields fields={fields} onChange={updateField} />
          </div>

          <div className="relative flex flex-1 flex-col bg-amber-50/60">
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <label
                className="group cursor-pointer rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-emerald-600"
                title="画像を挿入"
              >
                <ImagePlus size={20} className="transition-transform group-hover:scale-110" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) insertImage(e.target.files[0]);
                  }}
                />
              </label>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="w-full flex-1 resize-none bg-transparent p-8 font-mono text-sm leading-relaxed text-slate-800 outline-none"
              placeholder="ここにMarkdownで記事を書いてください... (画像はドラッグ＆ドロップや貼り付けで挿入できます)"
              required
            />
          </div>
        </div>

        {/* 右: プレビュー */}
        <div className="w-1/2 max-w-none overflow-y-auto border-l border-slate-100 bg-white p-10 shadow-inner">
          <MarkdownRenderer
            content={content || "*ここにプレビューが表示されます...*"}
            openLinksInNewTab
            resolveImageSrc={resolvePreviewImageSrc}
          />
        </div>
      </div>
    </div>
  );
}
