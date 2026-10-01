export const dynamic = "force-dynamic";
export const runtime = "edge";

/** 管理画面のレイアウト。公開サイトのヘッダー・フッターは表示しない */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-1 flex-col">{children}</main>;
}
