import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";
import { CodeBlock } from "@/components/markdown/CodeBlock";

const LINK_CLASS =
  "font-bold text-emerald-600 underline decoration-emerald-200 underline-offset-4 transition-all hover:text-emerald-700 hover:decoration-emerald-500";

type MarkdownRendererProps = {
  /** 表示する Markdown 文字列 */
  content: string;
  /**
   * すべてのリンクを新しいタブで開く。
   * 管理画面のプレビューで、リンクをクリックして編集中の内容が消えるのを防ぐために使う。
   */
  openLinksInNewTab?: boolean;
  /**
   * 画像の URL を差し替える。
   * 管理画面のプレビューで、まだアップロードされていない画像を表示するために使う。
   */
  resolveImageSrc?: (src: string) => string;
};

/**
 * 記事本文の Markdown を表示する。
 * 公開ページと管理画面のプレビューで同じ見た目になるよう、両方からこのコンポーネントを使う。
 */
export function MarkdownRenderer({
  content,
  openLinksInNewTab = false,
  resolveImageSrc,
}: MarkdownRendererProps) {
  const components: Components = {
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
    h3: ({ node, children, ...props }) => (
      <h3
        className="mt-6 mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 md:text-xl"
        {...props}
      >
        <span className="inline-block h-6 w-1.5 rounded-full bg-emerald-500"></span>
        {children}
      </h3>
    ),
    p: ({ node, ...props }) => (
      <p className="mb-5 text-base leading-relaxed font-medium text-slate-700" {...props} />
    ),
    a: ({ node, href, children, ...props }) => {
      if (!href) {
        return (
          <span className={LINK_CLASS} {...props}>
            {children}
          </span>
        );
      }
      const isExternal = /^https?:\/\//.test(href);
      if (isExternal || openLinksInNewTab) {
        return (
          <a
            href={href}
            className={LINK_CLASS}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={LINK_CLASS} {...props}>
          {children}
        </Link>
      );
    },
    iframe: ({ node, ...props }) => (
      <iframe
        title="埋め込みコンテンツ"
        className="my-6 w-full max-w-full rounded-xl border-0"
        {...props}
      />
    ),
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
    li: ({ node, ...props }) => <li className="pl-1 leading-relaxed" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote
        className="my-4 rounded-r-xl border-l-4 border-emerald-400 bg-emerald-50/50 py-1.5 pl-4 font-medium text-slate-600 italic"
        {...props}
      />
    ),
    code: ({ node, className, children, ref, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <CodeBlock language={match[1]}>{children}</CodeBlock>
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
      const resolvedSrc = typeof src === "string" && resolveImageSrc ? resolveImageSrc(src) : src;
      return (
        <span className="mx-auto my-10 block w-fit max-w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
          {/* 記事画像はサイズが不定のため next/image ではなく img を使う */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="!m-0 h-auto max-h-96 w-auto max-w-full object-cover"
            src={resolvedSrc}
            alt={alt || "記事内画像"}
            {...props}
          />
        </span>
      );
    },
    hr: ({ node, ...props }) => (
      <hr className="my-10 border-t-2 border-dashed border-slate-100" {...props} />
    ),
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
