import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const runtime = "edge";

// 管理画面は検索結果に載せない（next.config.ts の X-Robots-Tag と同じ指定）
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** 管理画面のレイアウト。公開サイトのヘッダー・フッターは表示しない */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-1 flex-col">{children}</main>;
}
