import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  return (
    <>
      {/* 開発中バナー */}
      <div className="bg-amber-400 text-amber-950 text-center text-sm font-semibold py-1.5 tracking-wide">
        🚧 このサイトは現在開発中です — デザイン・機能は予告なく変更される場合があります 🚧
      </div>

      <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          {/* ロゴ */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-700 hover:text-black transition-colors"
          >
            <Image
              src="/images/digitart_white_normal.jpg"
              alt={`${SITE_NAME} ロゴ`}
              width={36}
              height={36}
              className="rounded-md"
            />
            {SITE_NAME}
          </Link>

          {/* ナビゲーション */}
          <nav>
          </nav>
        </div>
      </header>
    </>
  );
}
