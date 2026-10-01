/**
 * コンテンツファイルの置き場所（リポジトリルートからの相対パス）。
 * 読み込み側（サイト表示）と書き込み側（管理画面からの PR 作成）で同じ値を使うため、ここで一元管理する。
 */

/** 記事 Markdown を置くディレクトリ */
export const ARTICLES_DIR = "content/news";

/** サークル規約の Markdown */
export const BYLAWS_FILE = "content/bylaws.md";

/**
 * 記事内の画像を置くディレクトリ。実際のファイルは `<このパス>/<公開日>/` に置く。
 * public/ 配下のファイルは、先頭の public を除いたパス（/images/articles/...）で参照できる。
 */
export const ARTICLE_IMAGES_DIR = "public/images/articles";
