import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* 開発中バナー */}
      <div className="bg-amber-400 text-amber-950 text-center text-sm font-semibold py-1.5 tracking-wide">
        🚧 このサイトは現在開発中です — コンテンツは順次追加されます 🚧
      </div>

      {/* コピーライト */}
      <div className="border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        &copy; {year} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
