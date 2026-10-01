import { z } from "zod";

/**
 * 記事のカテゴリ。
 * 表示名と色はここで一元管理し、一覧のバッジや管理画面の選択肢から参照する。
 */
export const ARTICLE_CATEGORIES = {
  notice: { label: "お知らせ", color: "#b91c1c", bg: "#fee2e2" },
  column: { label: "コラム", color: "#3d7a18", bg: "#e8f4df" },
} as const;

export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES;

const categoryIds = Object.keys(ARTICLE_CATEGORIES) as [ArticleCategory, ...ArticleCategory[]];

/**
 * 記事 Markdown の先頭（frontmatter）の形式。
 * 形式が間違っている記事があると、ビルド時にどのファイルの何が間違っているかを表示して失敗する。
 */
export const articleFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date は YYYY-MM-DD 形式で書いてください"),
  category: z.enum(categoryIds),
  author: z.string().optional(),
  excerpt: z.string().optional(),
  /** OGP 画像などに使うサムネイル（/images/... の形式） */
  image: z.string().optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

/** 記事一覧で使う情報（本文を含まない） */
export type ArticleSummary = ArticleFrontmatter & {
  /** ファイル名から .md を除いたもの。URL の /news/[slug] に使う */
  slug: string;
};

/** 記事ページで使う情報（本文を含む） */
export type Article = ArticleSummary & {
  content: string;
};
