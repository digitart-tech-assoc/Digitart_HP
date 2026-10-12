import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";
import { CodeBlock } from "@/components/markdown/CodeBlock";

import type { Heading as MdastHeading, Root, RootContent } from "mdast";
import type { ReactNode } from "react";

const LINK_CLASS = {
  article:
    "font-bold text-emerald-600 underline decoration-emerald-200 underline-offset-4 transition-all hover:text-emerald-700 hover:decoration-emerald-500",
  document:
    "text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-600",
};

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

/**
 * 記事の見出しを、ページの記事タイトル（h1）の下にレベルを飛ばさずに並ぶよう割り当てる remark プラグイン。
 * 本文で使われている見出しのレベルを、上から順に h2・h3・h4… と詰めて割り当てる。
 * - `#` から書く記事も、`##`・`###` から書く記事も、一番上の見出しは h2 になる
 * - 使っていないレベルは詰める（`#` の次が `###` でも h2 → h3）
 * - 6 種類すべてを使ったときだけ、最も深い 2 つが h6 になる（h1 の下に 6 段は収まらないため）
 * 割り当てたレベルは見出しの dataHeadingLevel に入れ、見た目（クラス）は Markdown のレベルのまま変えない。
 */
function remarkArticleHeadingLevels() {
  return (tree: Root) => {
    const headings: MdastHeading[] = [];
    const collect = (node: Root | RootContent) => {
      if (node.type === "heading") headings.push(node);
      if ("children" in node) node.children.forEach(collect);
    };
    collect(tree);

    const levels = [...new Set(headings.map((heading) => heading.depth))].sort((a, b) => a - b);
    for (const heading of headings) {
      const outputLevel = Math.min(levels.indexOf(heading.depth) + 2, HEADING_TAGS.length);
      heading.data = {
        ...heading.data,
        hProperties: { ...heading.data?.hProperties, dataHeadingLevel: outputLevel },
      };
    }
  };
}

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
  /**
   * 見た目の種類。
   * - article（既定）: ニュース記事。見出しの装飾やブランドカラーのマーカーを付ける
   * - document: 規約などの文書。ブランドカラーや装飾を使わず、条文の見出し（h4）と番号付きリストを読みやすくする
   */
  variant?: "article" | "document";
};

/**
 * 記事本文の Markdown を表示する。
 * 公開ページと管理画面のプレビューで同じ見た目になるよう、両方からこのコンポーネントを使う。
 */
export function MarkdownRenderer({
  content,
  openLinksInNewTab = false,
  resolveImageSrc,
  variant = "article",
}: MarkdownRendererProps) {
  const linkClass = LINK_CLASS[variant];

  /**
   * Markdown の見出し（# の数が level）を描画する部品を作る。クラスは Markdown のレベルで決める。
   * 記事では、ページ側で記事タイトルを h1 にしているため、remarkArticleHeadingLevels が割り当てたレベルのタグで出力する。
   * 規約などの文書は本文の # がページの見出しになるので、Markdown のレベルのまま出力する
   */
  const heading = (level: number, className?: string, marker?: ReactNode): Components["h1"] =>
    function Heading({ node, children, ...props }) {
      const outputLevel = Number(node?.properties.dataHeadingLevel ?? level);
      // 割り当て用の属性は HTML に出さない
      const { "data-heading-level": _outputLevel, ...rest } = props as typeof props & {
        "data-heading-level"?: unknown;
      };
      const Tag = HEADING_TAGS[outputLevel - 1];
      return (
        <Tag className={className} {...rest}>
          {marker}
          {children}
        </Tag>
      );
    };

  const components: Components = {
    h1: heading(
      1,
      "mt-6 mb-4 border-b-2 border-slate-100 pb-3 text-2xl font-extrabold text-slate-900 md:text-3xl",
    ),
    h2: heading(
      2,
      "mt-8 mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900 md:text-2xl",
    ),
    h3: heading(
      3,
      "mt-6 mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 md:text-xl",
      <span className="inline-block h-6 w-1.5 rounded-full bg-emerald-500"></span>,
    ),
    // h4〜h6 は記事では装飾しないが、出力するレベルを変えるために登録する
    h4: heading(4),
    h5: heading(5),
    h6: heading(6),
    p: ({ node, ...props }) => (
      <p className="mb-5 text-base leading-relaxed font-medium text-slate-700" {...props} />
    ),
    a: ({ node, href, children, ...props }) => {
      if (!href) {
        return (
          <span className={linkClass} {...props}>
            {children}
          </span>
        );
      }
      const isExternal = /^https?:\/\//.test(href);
      if (isExternal || openLinksInNewTab) {
        return (
          <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={linkClass} {...props}>
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

  /*
   * 文書向けでは、ブランドカラーや装飾（h3 のバー・引用の背景など）を使わず、番号付きリストを等幅フォントにしない。
   * 入れ子のリストは親の項目の中に収まるよう、下の余白をなくして項目の間隔だけ空ける
   */
  if (variant === "document") {
    components.h3 = heading(3, "mt-8 mb-3 text-lg font-bold text-slate-900 md:text-xl");
    // 規約では条の見出しに h4 を使うため、スマートフォンでも本文より大きくする
    components.h4 = heading(4, "mt-6 mb-2 text-lg font-bold text-slate-900");
    components.p = ({ node, ...props }) => (
      <p className="mb-3 text-base leading-relaxed text-slate-700" {...props} />
    );
    components.ul = ({ node, ...props }) => (
      <ul
        className="mb-3 ml-6 list-outside list-disc space-y-1.5 text-slate-700 marker:text-slate-500 in-[li]:mt-1.5 in-[li]:mb-0"
        {...props}
      />
    );
    components.ol = ({ node, ...props }) => (
      <ol
        className="mb-3 ml-6 list-outside list-decimal space-y-1.5 text-slate-700 marker:text-slate-500 in-[li]:mt-1.5 in-[li]:mb-0"
        {...props}
      />
    );
    components.blockquote = ({ node, ...props }) => (
      <blockquote className="my-4 border-l-4 border-slate-200 pl-4 text-slate-600" {...props} />
    );
    components.hr = ({ node, ...props }) => (
      <hr className="my-8 border-t border-slate-200" {...props} />
    );
  }

  return (
    <ReactMarkdown
      remarkPlugins={
        variant === "article"
          ? [remarkGfm, remarkMath, remarkArticleHeadingLevels]
          : [remarkGfm, remarkMath]
      }
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
