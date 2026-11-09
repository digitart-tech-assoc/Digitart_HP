import { z } from "zod";

/**
 * 記事のカテゴリ。
 * 表示名と色はここで一元管理し、一覧のバッジや管理画面の選択肢から参照する。
 * 色は Tailwind のクラスで書く（クラス名を組み立てると Tailwind が検出できないため、完全な形で書く）。
 * - badgeClassName: カテゴリ名のバッジ（文字・背景・枠線）
 * - barClassName: 一覧のカードの左端の線
 */
export const ARTICLE_CATEGORIES = {
  notice: {
    label: "お知らせ",
    badgeClassName: "border-red-700/25 bg-red-100 text-red-700",
    barClassName: "bg-red-700",
  },
  column: {
    label: "コラム",
    badgeClassName: "border-brand-700/25 bg-brand-50 text-brand-700",
    barClassName: "bg-brand-700",
  },
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
  /** 公開後に内容を直した日。サイトマップの lastmod に使う */
  updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "updated は YYYY-MM-DD 形式で書いてください")
    .optional(),
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
