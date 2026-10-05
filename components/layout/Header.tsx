"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const headerVisible = !isHome || isScrolled || isOpen;

  const toggleGroup = (href: string) => {
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-out ${
          headerVisible
            ? "translate-y-0 border-b border-brand/20 bg-white/90 opacity-100 shadow-sm backdrop-blur-md"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* ロゴ */}
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-800 transition-colors hover:text-brand-strong"
          >
            <Image
              src="/images/digitart_white_normal.svg"
              alt={`${SITE_NAME} ロゴ`}
              width={32}
              height={32}
              className="rounded-md"
            />
            {SITE_NAME}
          </Link>

          {/* ハンバーガーボタン */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={isOpen}
            className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg transition-colors hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <span
              className={`block h-[2px] w-5 origin-center rounded-full bg-slate-700 transition-all duration-300 ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 rounded-full bg-slate-700 transition-all duration-300 ${
                isOpen ? "scale-x-0 opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 origin-center rounded-full bg-slate-700 transition-all duration-300 ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* オーバーレイ */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* 右サイドドロワー */}
      <div
        className={`fixed top-0 right-0 z-[58] flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
      >
        {/* ドロワーヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <span className="text-base font-semibold tracking-wide text-gray-800">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="メニューを閉じる"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-slate-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ナビゲーションリンク */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const children = link.children;
              const parentActive =
                pathname === link.href ||
                (children &&
                  children.some((c) => pathname === c.href || pathname.startsWith(c.href)));

              return (
                <li key={link.href}>
                  <div className="flex items-start justify-between gap-3">
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="group flex-1 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-100 hover:text-black"
                      >
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          parentActive
                            ? "bg-brand/10 text-brand-deep hover:bg-brand/15"
                            : "text-gray-700 hover:bg-slate-100 hover:text-black"
                        }`}
                      >
                        <span>{link.label}</span>
                      </Link>
                    )}

                    {children && children.length > 0 && (
                      <button
                        onClick={() => toggleGroup(link.href)}
                        aria-expanded={!!openGroups[link.href]}
                        aria-label={`Expand ${link.label}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-slate-100"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`transform transition-transform duration-200 ${openGroups[link.href] ? "rotate-180" : "rotate-0"}`}
                          aria-hidden="true"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
                            className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                              pathname === child.href
                                ? "bg-brand/10 text-brand-deep"
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
