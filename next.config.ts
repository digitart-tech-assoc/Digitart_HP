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
        // public/images/ の画像は、表示のたびに再検証させず、ブラウザと Cloudflare のエッジにキャッシュさせる。
        // 同じファイル名のまま画像を差し替えることがあるため、古い画像が残っても困らない 1 日にとどめる。
        // 期限が切れた後も 1 週間は、古い画像をすぐ表示しつつ裏で取り直す（stale-while-revalidate）
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
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
