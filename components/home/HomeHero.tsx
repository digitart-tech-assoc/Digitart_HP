"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { SITE_NAME } from "@/lib/constants";

const SLIDE_SRCS = [
  "images/heros/01.jpg",
  "images/heros/02.jpg",
  "images/heros/03.jpg",
  "images/heros/04.jpg",
  "images/heros/05.jpg"
];

type Phase = "intro" | "expand" | "white" | "done";

export default function HomeHero() {
  const [phase, setPhase] = useState<Phase>("intro");
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
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, phase]);

  const contentVisible = phase === "white" || phase === "done";

  return (
    <>
      {/* ── Intro overlay (logo grows & screen goes white) ── */}
      {phase !== "done" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{
            backgroundColor: "#8cc63f",
            opacity: phase === "white" ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          <div
            style={{
              transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease",
              transform:
                phase === "intro"
                  ? "scale(1)"
                  : phase === "expand"
                  ? "scale(20)"
                  : "scale(80)",
              opacity: phase === "white" ? 0 : 1,
            }}
          >
            <Image
              src="/images/digitart_white_normal.svg"
              alt="Digitart logo intro"
              width={120}
              height={120}
              priority
              className="w-20 h-20"
            />
          </div>
        </div>
      )}

      <section className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden -z-10">
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
          style={{ background: "linear-gradient(170deg, rgba(15,30,10,0.28) 0%, rgba(8,20,5,0.50) 100%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 z-10"
          style={{ background: "linear-gradient(to top, rgba(4,12,3,0.65) 0%, transparent 100%)" }}
          aria-hidden="true"
        />

        {/* ── Slide dots ── */}
        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
          {SLIDE_SRCS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (timerRef.current) clearTimeout(timerRef.current);
                setPrev(current);
                setCurrent(i);
                setTransitioning(true);
                setTimeout(() => { setPrev(null); setTransitioning(false); }, 1200);
              }}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: i === current ? "#8cc63f" : "rgba(255,255,255,0.35)",
                transform: i === current ? "scale(1.6)" : "scale(1)",
              }}
              aria-label={`スライド ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Main content ── */}
        <div
          className="relative z-20 px-6 py-10 max-w-5xl mx-auto flex flex-col items-center text-center"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          {/* Logo above eyebrow — always centred, all screen sizes */}
          <div className="mb-5 md:mb-6">
            <div className="relative inline-block">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-40"
                style={{ background: "rgba(140,198,63,0.5)" }}
                aria-hidden="true"
              />
              <Image
                src="/images/digitart_white_normal.svg"
                alt={`${SITE_NAME} logo`}
                width={160}
                height={160}
                className="relative w-30 sm:w-50 md:w-60 h-auto opacity-100 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Eyebrow — break after "UNIVERSITY" on small screens */}
          <p className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.22em] uppercase mb-6 md:mb-8 text-[#8cc63f]">
            <span className="block sm:inline">Aoyama Gakuin University</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">Creator Community</span>
          </p>

          {/* Catchphrase */}
          <h1
            className="text-[clamp(2.5rem,7vw,7rem)] font-black leading-[1.1] tracking-tight text-white mb-8 md:mb-10"
            lang="ja"
          >
            好きを<br className="sm:hidden" /><span style={{ color: "#8cc63f" }}>カタチに</span>しよう
          </h1>

          {/* Description + Buttons */}
          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-medium max-w-xl md:max-w-2xl mb-8 md:mb-10">
            Digitart テクノロジー愛好会は、プログラミング・ゲーム開発・デザインを横断しながら、仲間と一緒にプロダクトをつくる青学生クリエイターコミュニティです。
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 md:px-10 md:py-4 text-sm md:text-base font-bold text-white bg-[#8cc63f] hover:bg-[#7ab135] rounded-full shadow-[0_0_24px_rgba(140,198,63,0.45)] transition-all duration-300 hover:-translate-y-0.5"
            >
              入会する
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-9 md:py-4 text-sm md:text-base font-bold text-white/90 border border-white/45 rounded-full hover:border-white hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              詳しく見る
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
          style={{
            opacity: contentVisible ? Math.max(0, 1 - scrollY / 120) : 0,
            transition: "opacity 0.3s",
          }}
          aria-hidden="true"
        >
          <span className="text-[9px] tracking-[0.28em] text-white/55 uppercase font-bold">Scroll</span>
          <span className="block w-px h-7 bg-white/35" />
        </div>
      </section>

      {/* Spacer */}
      <div className="h-screen w-full relative -z-20" aria-hidden="true" />
    </>
  );
}
