"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggleGroup = (href: string) => {
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <>
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
            {NAV_LINKS.map((link) => {
              const children = (link as any).children as Array<any> | undefined;
              const parentActive =
                pathname === link.href || (children && children.some((c) => pathname === c.href || pathname.startsWith(c.href)));

              return (
                <li key={link.href}>
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors group ${
                        parentActive
                          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                          : "text-gray-700 hover:bg-slate-100 hover:text-black"
                      }`}
                    >
                      <span>{link.label}</span>
                    </Link>

                    {children && children.length > 0 && (
                      <button
                        onClick={() => toggleGroup(link.href)}
                        aria-expanded={!!openGroups[link.href]}
                        aria-label={`Expand ${link.label}`}
                        className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-slate-100 transition-colors"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`transform transition-transform duration-200 ${openGroups[link.href] ? "rotate-180" : "rotate-0"}`}
                          aria-hidden="true"
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {children && children.length > 0 && openGroups[link.href] && (
                    <ul className="mt-2 ml-4 flex flex-col gap-1">
                      {children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => {
                              setIsOpen(false);
                              setOpenGroups({});
                            }}
                            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                              pathname === child.href
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-700 hover:bg-slate-100 hover:text-black"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
