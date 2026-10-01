"use client";

import { ImagePlus, Send, Loader2 } from "lucide-react";
import { useState, useRef, useActionState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { publishArticleAction, ActionState } from "@/app/admin/actions";
import "katex/dist/katex.min.css";

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
      const imagePath = `public/images/articles/${date}/${fileName}`;
      const imageMarkdownUrl = `/images/articles/${date}/${fileName}`;

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
                  <option value="notice">お知らせ</option>
                  <option value="column">コラム</option>
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="mt-6 mb-4 border-b-2 border-slate-100 pb-3 text-2xl font-extrabold text-slate-900 md:text-3xl"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="mt-8 mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900 md:text-2xl"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="mt-6 mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 md:text-xl"
                  {...props}
                >
                  <span className="inline-block h-6 w-1.5 rounded-full bg-emerald-500"></span>
                  {props.children}
                </h3>
              ),
              p: ({ node, ...props }) => (
                <p
                  className="mb-5 text-base leading-relaxed font-medium text-slate-700"
                  {...props}
                />
              ),
              a: ({ node, href, children, ...props }) => {
                const linkClass =
                  "text-emerald-600 hover:text-emerald-700 underline underline-offset-4 decoration-emerald-200 hover:decoration-emerald-500 transition-all font-bold";
                return (
                  <a
                    href={href}
                    className={linkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              ul: ({ node, ...props }) => (
                <ul
                  className="mb-5 ml-6 list-outside list-disc space-y-1.5 font-medium text-slate-700 marker:text-emerald-500"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="mb-5 ml-6 list-outside list-decimal space-y-1.5 font-mono font-medium text-slate-700 marker:text-emerald-600"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="pl-1 leading-relaxed text-slate-700" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="my-4 rounded-r-xl border-l-4 border-emerald-400 bg-emerald-50/50 py-1.5 pl-4 font-medium text-slate-600 italic"
                  {...props}
                />
              ),
              code: ({ node, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 font-mono text-sm break-words text-slate-800"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              img: ({ node, alt, src, ...props }) => {
                // If it's a dropped image, src might be a local path that hasn't been uploaded.
                // We show base64 content instead if we have it in our state.
                const imgState = images.find((img) => img.path === "public" + src);
                const actualSrc = imgState ? `data:image/png;base64,${imgState.content}` : src;

                return (
                  <span className="mx-auto my-10 block w-fit max-w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                    <img
                      className="!m-0 h-auto max-h-96 w-auto max-w-full object-cover"
                      src={actualSrc}
                      alt={alt || "記事内画像"}
                      {...props}
                    />
                  </span>
                );
              },
              hr: ({ node, ...props }) => (
                <hr className="my-10 border-t-2 border-dashed border-slate-100" {...props} />
              ),
            }}
          >
            {content || "*ここにプレビューが表示されます...*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
