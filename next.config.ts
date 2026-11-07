import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 記事投稿で画像を base64 で送るため既定（1MB）より大きくする。
      // ログイン前のリクエストにも適用されるので、必要以上には上げない（画像 1 枚の上限は publishInput.ts で 10MB）
      bodySizeLimit: "25mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // 拡張子と違う形式として解釈させない（画像として置いたファイルを HTML として実行させないため）
          { key: "X-Content-Type-Options", value: "nosniff" },
          // 他サイトへ移動するときに、記事の URL などのパスを送らない
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 他サイトの iframe に埋め込ませない（クリックジャッキング対策）。
          // 記事の Spotify などの埋め込みは「このサイトが他を埋め込む」向きなので影響しない
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          // frame-ancestors に対応していない古いブラウザ向け
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        // 管理画面は検索結果に載せない。ページのない URL やリダイレクトにも付くよう、metadata ではなくヘッダーでも指定する
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      // 年ごとのページしかないので、/sagamihara-fes は最新年のページへ送る（年が変わったら更新する）
      { source: "/sagamihara-fes", destination: "/sagamihara-fes/2026", permanent: false },
    ];
  },
};

export default nextConfig;
