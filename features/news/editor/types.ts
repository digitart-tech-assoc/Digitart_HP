/** 記事の Markdown の先頭（frontmatter）に書く項目と、ファイル名の一部 */
export type ArticleFields = {
  title: string;
  author: string;
  /** 公開日（YYYY-MM-DD）。ファイル名の先頭にも使う */
  date: string;
  /** ファイル名の日付より後ろの部分（半角英小文字・数字・ハイフン） */
  slug: string;
  category: string;
  excerpt: string;
};

/** エディタに挿入したが、まだリポジトリに追加していない画像 */
export type PendingImage = {
  /** リポジトリ上の保存先（public/images/articles/... の形式） */
  path: string;
  /** data URL の接頭辞を除いた base64 文字列 */
  content: string;
};

/** 記事投稿（プルリクエスト作成）の結果 */
export type PublishState = {
  error: string | null;
  success: boolean;
  prUrl: string | null;
};
