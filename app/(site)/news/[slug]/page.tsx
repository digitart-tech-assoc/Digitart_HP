import { notFound } from "next/navigation";

import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { getAllArticles, getArticle } from "@/features/news/articles";
import { getCustomMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

// 静的パスを生成するための関数
export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return { title: "404 - Article Not Found" };
  }
  return getCustomMetadata({
    title: article.title,
    description: article.excerpt || "Digitartテクノロジー愛好会のニュース記事",
    image: article.image,
    path: `/news/${slug}`,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 selection:bg-emerald-200 md:p-8 lg:p-16">
      <BreadcrumbJsonLd path={`/news/${slug}`} currentLabel={article.title} />
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Article Header */}
        <header className="flex flex-col items-start space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <time
              dateTime={article.date}
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
              {new Date(article.date).toLocaleDateString("ja-JP")}
            </time>
            {article.author && (
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
                {article.author}
              </div>
            )}
          </div>
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
        </header>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <MarkdownRenderer content={article.content} />
        </article>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <ButtonLink href="/news" variant="neutral" size="sm">
            ← ニュース一覧に戻る
          </ButtonLink>
          <ButtonLink href="/admin/news/login" variant="outline" size="sm">
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
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
