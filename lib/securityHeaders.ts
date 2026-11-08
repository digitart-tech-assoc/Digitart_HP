/**
 * レスポンスに付けるセキュリティヘッダー。
 * next.config.ts の headers() で、全ページと管理画面に付ける。
 */
export const SECURITY_HEADERS = [
  // 拡張子と違う形式として解釈させない（画像として置いたファイルを HTML として実行させないため）
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 他サイトへ移動するときに、記事の URL などのパスを送らない
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 他サイトの iframe に埋め込ませない（クリックジャッキング対策）。
  // 記事の Spotify などの埋め込みは「このサイトが他を埋め込む」向きなので影響しない
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // frame-ancestors に対応していない古いブラウザ向け
  { key: "X-Frame-Options", value: "DENY" },
] as const;

/**
 * 管理画面に追加で付けるヘッダー。ページのない URL やリダイレクトにも付くよう、metadata ではなくヘッダーでも指定する。
 * 管理画面も "/:path*" に一致して SECURITY_HEADERS が付くので、ここには管理画面だけのものを書く
 */
export const ADMIN_HEADERS = [
  // 管理画面は検索結果に載せない
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
] as const;
