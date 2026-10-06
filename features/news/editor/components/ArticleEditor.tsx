"use client";

import { AlertCircle, ImagePlus, Loader2, Send } from "lucide-react";
import { useActionState, useRef, useState } from "react";

import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { publishArticleAction } from "@/features/news/editor/actions";
import { ArticleMetaFields } from "@/features/news/editor/components/ArticleMetaFields";
import { PublishSuccess } from "@/features/news/editor/components/PublishSuccess";
import type { ArticleDraft } from "@/features/news/editor/draftStorage";
import type { ArticleFields, PublishState } from "@/features/news/editor/types";
import { useArticleDraft } from "@/features/news/editor/useArticleDraft";
import { useArticleImages } from "@/features/news/editor/useArticleImages";
import { todayInTokyo } from "@/lib/date";

const initialState: PublishState = {
  error: null,
  success: false,
  prUrl: null,
};

const createInitialFields = (): ArticleFields => ({
  title: "",
  author: "",
  date: todayInTokyo(),
  slug: "",
  category: "column",
  excerpt: "",
});

type MobileTab = "edit" | "preview";

const TAB_CLASS = "flex-1 py-2.5 text-sm font-bold transition-colors";

/**
 * 記事エディタ。左で Markdown を書き、右でプレビューを確認する（スマホではタブで切り替える）。
 * 送信すると、記事と画像をコミットしたプルリクエストが GitHub に作成される。
 * 入力内容はブラウザに自動で下書き保存される。
 */
export function ArticleEditor() {
  const [state, formAction, isPending] = useActionState(publishArticleAction, initialState);

  const [fields, setFields] = useState<ArticleFields>(createInitialFields);
  const [content, setContent] = useState("");
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { images, setImages, insertImages, isProcessing, resolvePreviewImageSrc } =
    useArticleImages({ date: fields.date, textareaRef, setContent });

  const { restoredAt, discardDraft } = useArticleDraft({
    fields,
    content,
    images,
    published: state.success,
    restore: (draft: ArticleDraft) => {
      setFields(draft.fields);
      setContent(draft.content);
      setImages(draft.images);
    },
  });

  const updateField = <K extends keyof ArticleFields>(key: K, value: ArticleFields[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleDiscard = async () => {
    if (!window.confirm("下書きを破棄して、新しく書き始めますか？")) return;
    await discardDraft();
    setFields(createInitialFields());
    setContent("");
    setImages([]);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      insertImages(Array.from(e.clipboardData.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      insertImages(Array.from(e.dataTransfer.files));
    }
  };

  if (state.success) {
    return <PublishSuccess prUrl={state.prUrl} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md md:px-6 md:py-4">
        <h1 className="shrink-0 text-xl font-bold whitespace-nowrap text-slate-900 md:text-2xl">
          記事の作成
        </h1>
        <button
          type="submit"
          form="publish-form"
          disabled={isPending || isProcessing}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 active:translate-y-0 disabled:opacity-50 md:px-6 md:text-base"
        >
          {isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          {isPending ? "送信中..." : "投稿リクエストを送信"}
        </button>
      </header>

      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2 border-b border-red-100 bg-red-50 px-4 py-3 text-sm font-bold break-words text-red-600 md:px-6"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>{state.error}</p>
        </div>
      )}

      {restoredAt !== null && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-800 md:px-6">
          <p>
            {new Date(restoredAt).toLocaleString("ja-JP")} に自動保存された下書きを復元しました。
          </p>
          <button type="button" onClick={handleDiscard} className="font-bold underline">
            破棄して新しく書く
          </button>
        </div>
      )}

      {/* 送信用の非表示フォーム。入力欄は画面のあちこちにあるため、値をここに集めて送る */}
      <form id="publish-form" action={formAction} className="hidden">
        {Object.entries(fields).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <input type="hidden" name="content" value={content} />
        <input
          type="hidden"
          name="images"
          value={JSON.stringify(images.map(({ path, content }) => ({ path, content })))}
        />
      </form>

      {/* スマホでは「編集」と「プレビュー」をタブで切り替える */}
      <div className="flex border-b border-slate-200 bg-white md:hidden" role="tablist">
        {(
          [
            ["edit", "編集"],
            ["preview", "プレビュー"],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mobileTab === tab}
            onClick={() => setMobileTab(tab)}
            className={`${TAB_CLASS} ${
              mobileTab === tab
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col md:h-[calc(100dvh-73px)] md:flex-row md:overflow-hidden">
        {/* 左: 入力欄と本文 */}
        <div
          className={`${mobileTab === "edit" ? "flex" : "hidden"} flex-1 flex-col bg-stone-50 md:flex md:w-1/2 md:flex-none md:border-r md:border-slate-200`}
        >
          <div className="space-y-5 border-b border-slate-200 bg-white/30 p-4 md:overflow-y-auto md:p-6">
            <ArticleMetaFields fields={fields} onChange={updateField} />
          </div>

          <div className="relative flex min-h-[60dvh] flex-1 flex-col bg-amber-50/60">
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              {isProcessing && (
                <Loader2
                  className="animate-spin text-slate-400"
                  size={20}
                  aria-label="画像を処理中"
                />
              )}
              <label
                className="group cursor-pointer rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-emerald-600"
                title="画像を挿入"
              >
                <ImagePlus size={20} className="transition-transform group-hover:scale-110" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  aria-label="画像を挿入"
                  onChange={(e) => {
                    if (e.target.files) insertImages(Array.from(e.target.files));
                    // 同じファイルを続けて選んでも onChange が呼ばれるよう、選択をリセットする
                    e.target.value = "";
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
              aria-label="本文（Markdown）"
              className="w-full flex-1 resize-none bg-transparent p-4 pr-16 font-mono text-sm leading-relaxed text-slate-800 outline-none md:p-8"
              placeholder="ここにMarkdownで記事を書いてください... (画像はドラッグ＆ドロップや貼り付けで挿入できます)"
              required
            />
          </div>
        </div>

        {/* 右: プレビュー */}
        <div
          className={`${mobileTab === "preview" ? "block" : "hidden"} max-w-none flex-1 overflow-y-auto bg-white p-4 md:block md:w-1/2 md:flex-none md:border-l md:border-slate-100 md:p-10 md:shadow-inner`}
        >
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
