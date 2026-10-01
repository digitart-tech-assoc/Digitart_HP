"use client";

import { ImagePlus, Send, Loader2 } from "lucide-react";
import { useState, useRef, useActionState } from "react";

import { publishArticleAction, ActionState } from "@/app/(admin)/admin/actions";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ARTICLE_CATEGORIES } from "@/features/news/schema";
import { ARTICLE_IMAGES_DIR } from "@/lib/contentPaths";

const initialState: ActionState = {
  error: null,
  success: false,
  prUrl: null,
};

export default function AdminNewsEditor() {
  const [state, formAction, isPending] = useActionState(publishArticleAction, initialState);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("column");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<{ path: string; content: string }[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle image upload via file input or drag & drop
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      const base64Content = base64Data.split(",")[1]; // Remove data URL prefix

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const imagePath = `${ARTICLE_IMAGES_DIR}/${date}/${fileName}`;
      const imageMarkdownUrl = imagePath.replace(/^public/, "");

      setImages((prev) => [...prev, { path: imagePath, content: base64Content }]);

      // Insert markdown into textarea
      const imageMarkdown = `\n![${file.name}](${imageMarkdownUrl})\n`;
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
        setContent(newContent);

        // Reset cursor
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + imageMarkdown.length;
            textareaRef.current.selectionEnd = start + imageMarkdown.length;
            textareaRef.current.focus();
          }
        }, 0);
      } else {
        setContent((prev) => prev + imageMarkdown);
      }
    };
    reader.readAsDataURL(file);
  };

  // まだアップロードしていない画像は、手元にある base64 データでプレビューする
  const resolvePreviewImageSrc = (src: string) => {
    const pendingImage = images.find((img) => img.path === "public" + src);
    return pendingImage ? `data:image/png;base64,${pendingImage.content}` : src;
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      handleImageUpload(e.clipboardData.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  if (state?.success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md space-y-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-20 w-20 rotate-3 items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-100 text-emerald-600 shadow-sm">
            <Send size={36} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            リクエストを送信しました！
          </h1>
          <p className="leading-relaxed font-medium text-slate-500">
            記事の投稿リクエストが作成されました。
            <br />
            管理者が承認次第、記事が公開されます。今しばらくお待ちください。
          </p>
          {state.prUrl && (
            <a
              href={state.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block font-bold text-emerald-600 underline underline-offset-4 hover:text-emerald-700"
            >
              <span title="Organizationへのアクセス権が必要です">リクエストを確認する→</span>
            </a>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500"
          >
            続けて別の記事を書く
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="sticky top-0 z-10 flex flex-nowrap items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
        <h1 className="flex shrink-0 items-center gap-2 text-2xl font-bold whitespace-nowrap text-slate-900">
          記事の作成
        </h1>
        <div className="flex min-w-0 items-center gap-4">
          {state?.error && (
            <span
              className="max-w-md truncate rounded-full border border-red-100 bg-red-50 px-3 py-1 text-sm font-bold text-red-500"
              title={state.error}
            >
              {state.error}
            </span>
          )}
          <button
            onClick={() => {
              const form = document.getElementById("publish-form") as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={isPending}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-bold whitespace-nowrap text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 active:translate-y-0 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {isPending ? "送信中..." : "投稿リクエストを送信"}
          </button>
        </div>
      </header>

      <form id="publish-form" action={formAction} className="hidden">
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="author" value={author} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="excerpt" value={excerpt} />
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="images" value={JSON.stringify(images)} />
      </form>

      <div className="flex h-[calc(100vh-73px)] flex-1 overflow-hidden">
        {/* Left Side: Editor */}
        <div className="flex w-1/2 flex-col border-r border-slate-200 bg-stone-50">
          <div className="space-y-5 overflow-y-auto border-b border-slate-200 bg-white/30 p-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                  タイトル
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="記事のタイトル"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                  著者
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Discord名"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                  公開日
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {Object.entries(ARTICLE_CATEGORIES).map(([id, { label }]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                  ファイル名（URLの一部になります） <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center">
                  <span className="rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-4 py-2.5 font-mono text-sm text-slate-500">
                    {date}-
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
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
                <label className="mb-1.5 ml-1 block text-xs font-bold tracking-widest text-slate-400 uppercase">
                  概要
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  rows={2}
                  placeholder="ニュース一覧に表示される概要文"
                />
              </div>
            </div>
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
                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
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

        {/* Right Side: Preview */}
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
