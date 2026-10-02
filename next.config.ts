import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 記事投稿で画像を base64 で送るため既定（1MB）より大きくする。
      // ログイン前のリクエストにも適用されるので、必要以上には上げない（画像 1 枚の上限は publishInput.ts で 10MB）
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
