import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
      // server-only はサーバー以外で import すると例外を投げる。テストはサーバー側のコードとして実行するため空にする
      "server-only": path.resolve(import.meta.dirname, "node_modules/server-only/empty.js"),
    },
  },
  test: {
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    environment: "node",
  },
});
