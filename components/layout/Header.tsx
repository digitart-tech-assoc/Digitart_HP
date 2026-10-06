"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, type MouseEvent } from "react";

import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

const DRAWER_ID = "site-navigation-drawer";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // トップページではヒーロー画像の上に重ねるため、スクロールするまでは背景を透明・文字を白にする
  const isTransparent = pathname === "/" && !isScrolled;

  /*
   * ドロワーはネイティブの <dialog> を showModal() で開く。
   * 背後の要素の操作・フォーカスの無効化と、Esc で閉じる処理をブラウザに任せられる。
   */
  const openDrawer = () => {
    drawerRef.current?.showModal();
    closeButtonRef.current?.focus();
    setIsOpen(true);
  };

  const closeDrawer = () => {
    drawerRef.current?.close();
  };

  // Esc・リンクのクリック・閉じるボタンなど、どの方法で閉じても close イベントで状態をそろえる
  const handleDrawerClose = () => {
    setIsOpen(false);
    setOpenGroups({});
    menuButtonRef.current?.focus();
  };

  // ::backdrop をクリックしたときは、イベントの target が <dialog> 自身になる
  const handleDrawerClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) closeDrawer();
  };

  const toggleGroup = (href: string) => {
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full border-b transition-colors duration-500 ease-out ${
          isTransparent
            ? "border-transparent bg-transparent text-white"
            : "border-brand/20 bg-white/90 text-slate-800 shadow-sm backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* ロゴ */}
          <Link
            href="/"
            className={`flex items-center gap-3 text-xl font-bold tracking-tight transition-colors ${
              isTransparent ? "drop-shadow-md hover:text-white/80" : "hover:text-brand-strong"
            }`}
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
            ref={menuButtonRef}
            onClick={openDrawer}
            aria-label="メニューを開く"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={DRAWER_ID}
            className={`flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 ${
              isTransparent
                ? "hover:bg-white/15 focus-visible:ring-white"
                : "hover:bg-brand/10 focus-visible:ring-brand"
            }`}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-[2px] w-5 rounded-full ${isTransparent ? "bg-white" : "bg-slate-700"}`}
              />
            ))}
          </button>
        </div>
      </header>

      {/* 右サイドドロワー（位置・開閉のアニメーション・背景は globals.css の .nav-drawer） */}
      <dialog
        ref={drawerRef}
        id={DRAWER_ID}
        aria-label="ナビゲーションメニュー"
        onClose={handleDrawerClose}
        onClick={handleDrawerClick}
        className="nav-drawer"
      >
        <div className="flex h-full flex-col">
          {/* ドロワーヘッダー */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <span className="text-base font-semibold tracking-wide text-gray-800">Menu</span>
            <button
              ref={closeButtonRef}
              onClick={closeDrawer}
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
                          onClick={closeDrawer}
                          className="group flex-1 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-100 hover:text-black"
                        >
                          <span>{link.label}</span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={closeDrawer}
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
                          aria-controls={`${DRAWER_ID}-${link.label}`}
                          aria-label={`${link.label} のサブメニューを${openGroups[link.href] ? "閉じる" : "開く"}`}
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
                      <ul
                        id={`${DRAWER_ID}-${link.label}`}
                        className="mt-2 ml-4 flex flex-col gap-1"
                      >
                        {children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeDrawer}
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
      </dialog>
    </>
  );
}
