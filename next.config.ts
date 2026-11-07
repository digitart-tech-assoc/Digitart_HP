import { ADMIN_HEADERS, SECURITY_HEADERS } from "./lib/securityHeaders";

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
      // 値の説明は lib/securityHeaders.ts を参照
      { source: "/:path*", headers: [...SECURITY_HEADERS] },
      { source: "/admin/:path*", headers: [...ADMIN_HEADERS] },
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
