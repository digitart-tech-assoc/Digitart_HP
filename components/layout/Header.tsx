"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
              src="/images/digitart_white_normal.svg"
              alt={`${SITE_NAME} ロゴ`}
              width={36}
              height={36}
              className="rounded-md"
            />
            {SITE_NAME}
          </Link>

          {/* ハンバーガーボタン */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={isOpen}
            className="relative z-[60] flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <span
              className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
                isOpen ? "rotate-45 translate-y-[7px] bg-white" : "bg-gray-700"
              }`}
            />
            <span
              className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${
                isOpen ? "opacity-0 scale-x-0 bg-white" : "bg-gray-700"
              }`}
            />
            <span
              className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
                isOpen ? "-rotate-45 -translate-y-[7px] bg-white" : "bg-gray-700"
              }`}
            />
          </button>
        </div>
      </header>

      {/* オーバーレイ */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* 右サイドドロワー */}
      <div
        className={`fixed top-0 right-0 z-[58] h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
      >
        {/* ドロワーヘッダー */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <span className="text-base font-semibold text-gray-800 tracking-wide">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="メニューを閉じる"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-slate-100 hover:text-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ナビゲーションリンク */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors group ${
                    pathname === link.href
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-gray-700 hover:bg-slate-100 hover:text-black"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
