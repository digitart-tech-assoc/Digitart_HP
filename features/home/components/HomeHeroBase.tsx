"use client";

import Link from "next/link";
import { useEffect, useState, useRef, ReactNode } from "react";

import { Logo } from "@/components/ui/Logo";
import type { IntroPhase } from "@/features/home/components/HomeHeroIntro";
import { SITE_NAME } from "@/lib/constants";

const SLIDE_SRCS = [
  "images/heros/01.jpg",
  "images/heros/02.jpg",
  "images/heros/03.jpg",
  "images/heros/04.jpg",
  "images/heros/05.jpg",
];

interface HomeHeroBaseProps {
  /** イントロアニメーションの描画（段階ごとに呼ばれる） */
  renderIntro: (phase: IntroPhase) => ReactNode;
}

/** トップページのヒーロー本体（イントロの進行・背景スライドショー・キャッチコピー） */
export function HomeHeroBase({ renderIntro }: HomeHeroBaseProps) {
  const [phase, setPhase] = useState<IntroPhase>("intro");
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Intro animation sequence
  useEffect(() => {
    // intro → expand (logo starts growing after 0.8s)
    const t1 = setTimeout(() => setPhase("expand"), 800);
    // expand → white (logo fills screen at ~2s)
    const t2 = setTimeout(() => setPhase("white"), 2200);
    // white → done (fade in content at ~2.8s)
    const t3 = setTimeout(() => setPhase("done"), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Scroll listener
  useEffect(() => {
    if (phase !== "done") return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [phase]);

  // Auto slideshow — crossfade by layering
  useEffect(() => {
    if (phase !== "done") return;
    timerRef.current = setTimeout(() => {
      const next = (current + 1) % SLIDE_SRCS.length;
      setPrev(current);
      setCurrent(next);
      setTransitioning(true);
      setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
      }, 1200);
    }, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, phase]);

  const contentVisible = phase === "white" || phase === "done";

  return (
    <>
      {/* ── Intro overlay (theme-specific) ── */}
      {renderIntro(phase)}

      <section className="fixed top-0 left-0 z-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden text-center">
        {/* ── Slides: crossfade with layered approach ── */}
        <div className="absolute inset-0">
          {/* Always render all slides, control visibility via z-index + opacity */}
          {SLIDE_SRCS.map((src, i) => {
            const isCurrent = i === current;
            const isPrev = i === prev;
            return (
              <div
                key={src}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${src})`,
                  opacity: isCurrent ? 1 : isPrev && transitioning ? 1 : 0,
                  zIndex: isCurrent ? 2 : isPrev ? 1 : 0,
                  transition: isCurrent ? "opacity 1.2s ease-in-out" : "none",
                }}
              />
            );
          })}
        </div>

        {/* ── Overlay ── */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(170deg, rgba(15,30,10,0.28) 0%, rgba(8,20,5,0.50) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 z-10 h-2/3"
          style={{ background: "linear-gradient(to top, rgba(4,12,3,0.65) 0%, transparent 100%)" }}
          aria-hidden="true"
        />

        {/* ── Slide dots ── */}
        <div className="absolute right-8 bottom-6 z-20 flex gap-2">
          {SLIDE_SRCS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (timerRef.current) clearTimeout(timerRef.current);
                setPrev(current);
                setCurrent(i);
                setTransitioning(true);
                setTimeout(() => {
                  setPrev(null);
                  setTransitioning(false);
                }, 1200);
              }}
              className="h-1.5 w-1.5 rounded-full transition-all duration-300"
              style={{
                background: i === current ? "var(--color-brand)" : "rgba(255,255,255,0.35)",
                transform: i === current ? "scale(1.6)" : "scale(1)",
              }}
              aria-label={`スライド ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Main content ── */}
        <div
          className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-6 py-10 text-center"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          {/* Logo above eyebrow — always centred, all screen sizes */}
          <div className="mb-5 md:mb-6">
            <div className="relative inline-block">
              <div
                className="absolute inset-0 rounded-full opacity-40 blur-3xl"
                style={{ background: "rgba(140,198,63,0.5)" }}
                aria-hidden="true"
              />
              <Logo
                size={160}
                alt={`${SITE_NAME} ロゴ`}
                className="relative block h-auto w-40 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Eyebrow — break after "UNIVERSITY" on small screens */}
          <p className="mb-6 text-[10px] font-bold tracking-[0.22em] text-brand uppercase sm:text-xs md:mb-8 md:text-sm">
            <span className="block sm:inline">Aoyama Gakuin University</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">Creator Community</span>
          </p>

          {/* Catchphrase */}
          <h1
            className="mb-8 text-[clamp(2.5rem,5vw,6rem)] leading-[1.1] font-black tracking-tight text-white md:mb-10"
            lang="ja"
          >
            好きを
            <br className="sm:hidden" />
            <span style={{ color: "var(--color-brand)" }}>カタチに</span>しよう
          </h1>

          {/* Description + Buttons */}
          <p className="mb-8 max-w-xl text-sm leading-relaxed font-medium text-white/85 sm:text-base md:mb-10 md:max-w-2xl md:text-lg">
            Digitart
            テクノロジー愛好会は、プログラミング・ゲーム開発・デザインを横断しながら、仲間と一緒にプロダクトをつくる青学生クリエイターコミュニティです。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(140,198,63,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover md:px-10 md:py-4 md:text-base"
            >
              入会する
              <svg
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-6 py-3 text-sm font-bold text-white/90 transition-all duration-300 hover:border-white hover:bg-white/10 hover:text-white md:px-9 md:py-4 md:text-base"
            >
              詳しく見る
              <svg
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5"
          style={{
            opacity: contentVisible ? Math.max(0, 1 - scrollY / 120) : 0,
            transition: "opacity 0.3s",
          }}
          aria-hidden="true"
        >
          <span className="text-[9px] font-bold tracking-[0.28em] text-white/55 uppercase">
            Scroll
          </span>
          <span className="block h-7 w-px bg-white/35" />
        </div>
      </section>

      {/* Spacer */}
      <div className="relative -z-10 h-screen w-full" aria-hidden="true" />
    </>
  );
}
