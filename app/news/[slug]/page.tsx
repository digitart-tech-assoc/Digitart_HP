import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";
import { getCustomMetadata } from "@/lib/metadata";
import { getArticleData, getSortedArticlesData } from "@/lib/news";

import CodeBlock from "./CodeBlock";

export const dynamic = "force-static";

// 静的パスを生成するための関数
export function generateStaticParams() {
  const articles = getSortedArticlesData();
  return articles.map((article) => ({
    slug: article.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = getArticleData(slug);
  if (!articleData) {
    return { title: "404 - Article Not Found" };
  }
  return getCustomMetadata({
    title: articleData.title,
    description: articleData.excerpt || "Digitartテクノロジー愛好会のニュース記事",
    image: articleData.image,
    path: `/news/${slug}`,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = getArticleData(slug);

  if (!articleData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 selection:bg-emerald-200 md:p-8 lg:p-16">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Article Header */}
        <header className="flex flex-col items-start space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <time
              dateTime={articleData.date}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(articleData.date).toLocaleDateString("ja-JP")}
            </time>
            {articleData.author && (
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {articleData.author}
              </div>
            )}
          </div>
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {articleData.title}
          </h1>
        </header>

        {/* Markdown Content rendered via react-markdown */}
        <article className="prose prose-slate prose-emerald md:prose-lg max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={{
              // Tailwind Typographyがない場合のフォールバック用カスタムスタイリング
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
                if (!href) {
                  return (
                    <span className={linkClass} {...props}>
                      {children}
                    </span>
                  );
                }
                const isExternal = /^https?:\/\//.test(href);
                if (isExternal) {
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
              img: ({ node, alt, ...props }) => (
                <span className="mx-auto my-10 block w-fit max-w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                  <img
                    className="!m-0 h-auto max-h-96 w-auto max-w-full object-cover"
                    alt={alt || "Article image"}
                    {...props}
                  />
                </span>
              ),
              hr: ({ node, ...props }) => (
                <hr className="my-10 border-t-2 border-dashed border-slate-100" {...props} />
              ),
            }}
          >
            {articleData.content}
          </ReactMarkdown>
        </article>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-all duration-300 hover:bg-slate-100 md:px-6 md:py-2.5 md:text-base"
          >
            ← ニュース一覧に戻る
          </Link>
          <Link
            href="/admin/news/login"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#8cc63f] px-4 py-2 text-sm font-bold text-[#6a9e2f] transition-all duration-300 hover:bg-[#8cc63f] hover:text-white md:px-6 md:py-2.5 md:text-base"
          >
            <svg
              className="h-4 w-4 shrink-0 md:h-5 md:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            記事を書く
          </Link>
        </div>
      </div>
    </div>
  );
}
