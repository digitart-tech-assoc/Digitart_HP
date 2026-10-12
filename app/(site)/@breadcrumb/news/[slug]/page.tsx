import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getArticle } from "@/features/news/articles";

/** 記事ページのパンくずリスト。最後の項目に記事タイトルを使う */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return null;

  return <BreadcrumbJsonLd segments={["news", slug]} currentLabel={article.title} />;
}
