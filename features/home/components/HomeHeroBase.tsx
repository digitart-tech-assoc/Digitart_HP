"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useState, useRef, useSyncExternalStore } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ScrollIndicator } from "@/features/home/components/ScrollIndicator";
import { HERO_NOTICE, HERO_SLIDES } from "@/features/home/data";
import { INTRO_SEEN_STORAGE_KEY } from "@/features/home/introSeen";
import { SITE_NAME } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

const SLIDE_INTERVAL_MS = 5000;
const FADE_MS = 1200;

const INTRO_SELECTOR = ".home-intro";

/** イントロ（HomeHeroIntro）の CSS アニメーションが終わったら知らせる */
function subscribeIntroEnd(onChange: () => void) {
  const intro = document.querySelector(INTRO_SELECTOR);
  intro?.addEventListener("animationend", onChange);
  return () => intro?.removeEventListener("animationend", onChange);
}

/**
 * イントロが終わっているか。表示しない場合（表示済み・視差効果を減らす設定）は display: none、
 * 表示した場合はフェードアウトの最後に visibility: hidden になる（globals.css の .home-intro）
 */
function getIntroDoneSnapshot() {
  const intro = document.querySelector(INTRO_SELECTOR);
  if (!intro) return true;
  const style = getComputedStyle(intro);
  return style.display === "none" || style.visibility === "hidden";
}

/** トップページのヒーロー本体（背景スライドショー・キャッチコピー） */
export function HomeHeroBase() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  // 利用者が再生・一時停止を選んだら、その選択を優先する（null は未操作）
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /*
   * これまでに表示した（または表示しようとした）スライド。画像を描画する（＝読み込む）対象になる。
   * 最初は 1 枚目だけで、一度入れたスライドは外さない（切り替えのたびに読み込み直さないため）
   */
  const [requestedSlides, setRequestedSlides] = useState<readonly number[]>([0]);
  // 読み込みが終わったスライド。1 枚目は最初から表示しているので、読み込み済みとして扱う
  const loadedSlidesRef = useRef(new Set([0]));
  // 読み込みが終わるのを待っている切り替え先（待っていないときは null）
  const pendingSlideRef = useRef<number | null>(null);
  const introSeenSavedRef = useRef(false);

  // サーバーではイントロが終わっていないものとして描画し、クライアントで CSS アニメーションの状態を読む
  const introDone = useSyncExternalStore(subscribeIntroEnd, getIntroDoneSnapshot, () => false);

  // 視差効果を減らす設定のときは、自動では切り替えない（サーバーでは自動再生として描画する）
  const reducedMotion = usePrefersReducedMotion();
  const isPlaying = userPaused === null ? !reducedMotion : !userPaused;

  /*
   * イントロは 1 セッションに 1 回だけ表示する。
   * 表示したことは表示し始めた時点で sessionStorage に保存し（再読み込みでは出さない）、
   * イントロが終わったら <html> にも印を付けて、同じタブ内で戻ってきたとき（クライアント側の遷移）にも出さない。
   * 印はページを離れるときではなく、イントロの終了時に付ける（開発時の Strict Mode が最初に一度アンマウントしても、
   * 再生中のイントロが消えないようにするため）。
   * sessionStorage が使えない環境（プライベートブラウズの一部など）では印を付けず、毎回表示する。
   */
  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_STORAGE_KEY, "1");
      introSeenSavedRef.current = true;
    } catch {
      // 印を付けない
    }
  }, []);

  useEffect(() => {
    if (introDone && introSeenSavedRef.current) {
      document.documentElement.dataset.introSeen = "";
    }
  }, [introDone]);

  useEffect(() => () => clearTimeout(fadeTimerRef.current ?? undefined), []);

  /** スライドの画像を描画する対象に加える */
  const requestSlide = (index: number) =>
    setRequestedSlides((slides) => (slides.includes(index) ? slides : [...slides, index]));

  /** 指定したスライドへクロスフェードする */
  const fadeTo = (next: number) => {
    // 前の切り替えのフェードが終わる前に次へ進んだときは、前の終了処理を取り消す
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    requestSlide(next);
    setPrev(current);
    setCurrent(next);
    setTransitioning(true);
    fadeTimerRef.current = setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, FADE_MS);
  };

  /**
   * 指定したスライドを表示する。表示中のスライドを選んだときは何もしない。
   * 画像がまだ読み込めていないときは、読み込みが終わってから切り替える（何もない背景にフェードしないため）
   */
  const showSlide = (next: number) => {
    if (next === current) {
      pendingSlideRef.current = null;
      return;
    }
    if (loadedSlidesRef.current.has(next)) {
      pendingSlideRef.current = null;
      fadeTo(next);
    } else {
      pendingSlideRef.current = next;
      requestSlide(next);
    }
  };

  /** 画像の読み込みが終わった（または失敗した）ときに呼ぶ。そのスライドへの切り替えを待っていたら切り替える */
  const handleSlideSettled = (index: number) => {
    loadedSlidesRef.current.add(index);
    // 先読みしただけのスライドも、読み込んだあとは描画したままにする
    requestSlide(index);
    if (pendingSlideRef.current === index) {
      pendingSlideRef.current = null;
      fadeTo(index);
    }
  };

  const showNextSlide = useEffectEvent(() => showSlide((current + 1) % HERO_SLIDES.length));

  /*
   * 自動スライドショー。スライドが変わるたび（ドットでの切り替えを含む）に、次の切り替えまでの時間を数え直す。
   * イントロがヒーローを覆っている間は数え始めず、最初のスライドもイントロが消えてから SLIDE_INTERVAL_MS 表示する
   */
  useEffect(() => {
    if (!isPlaying || !introDone) return;
    const timer = setTimeout(showNextSlide, SLIDE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [current, isPlaying, introDone]);

  /*
   * 次に表示するスライドだけを先に読み込む。
   * イントロが終わるまでは、最初の表示に必要なもの（1 枚目・フォントなど）と帯域を取り合わないよう読み込まない
   */
  const upcomingSlide = introDone ? (current + 1) % HERO_SLIDES.length : null;

  return (
    <>
      <section className="fixed top-0 left-0 z-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden text-center">
        {/* ── Slides: crossfade with layered approach ── */}
        <div className="absolute inset-0">
          {/*
           * 読み込むスライドだけを描画し、重なり順と透明度で表示を切り替える。
           * 画像は用意した大きさのまま配信するので unoptimized にする。
           * 1 枚目は最初の画面に出るので先読みし（preload）、残りは描画した時点で読み込む
           */}
          {HERO_SLIDES.map((src, i) => {
            if (!requestedSlides.includes(i) && i !== upcomingSlide) return null;
            const isCurrent = i === current;
            const isPrev = i === prev;
            return (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                sizes="100vw"
                unoptimized
                preload={i === 0}
                fetchPriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? undefined : "eager"}
                onLoad={() => handleSlideSettled(i)}
                onError={() => handleSlideSettled(i)}
                className="object-cover object-center"
                style={{
                  opacity: isCurrent ? 1 : isPrev && transitioning ? 1 : 0,
                  zIndex: isCurrent ? 2 : isPrev ? 1 : 0,
                  transition: isCurrent ? `opacity ${FADE_MS}ms ease-in-out` : "none",
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

        {/* ── Slide controls ── */}
        <div className="absolute right-4 bottom-2 z-20 flex items-center md:right-6">
          <button
            type="button"
            onClick={() => setUserPaused(isPlaying)}
            aria-label={isPlaying ? "スライドショーを一時停止" : "スライドショーを再生"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />
            )}
          </button>
          {/* 見た目のドットは小さいまま、タップできる範囲を 24px 以上にする */}
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => showSlide(i)}
              aria-label={`スライド ${i + 1}`}
              aria-current={i === current}
              className="flex h-8 w-6 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <span
                className="block h-1.5 w-1.5 rounded-full transition-all duration-300"
                style={{
                  background: i === current ? "var(--color-brand)" : "rgba(255,255,255,0.35)",
                  transform: i === current ? "scale(1.6)" : "scale(1)",
                }}
              />
            </button>
          ))}
        </div>

        {/* ── Main content ── */}
        <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-6 py-10 text-center">
          {/* Logo above eyebrow — always centred, all screen sizes */}
          <div className="mb-5 md:mb-6">
            <div className="relative inline-block">
              <div
                className="absolute inset-0 rounded-full bg-brand/50 opacity-40 blur-3xl"
                aria-hidden="true"
              />
              <Logo
                size={160}
                alt={`${SITE_NAME} ロゴ`}
                className="relative block h-auto w-40 drop-shadow-2xl"
                preload
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
            <span className="text-brand">カタチに</span>しよう
          </h1>

          {/* Description + Buttons */}
          <p className="mb-8 max-w-xl text-sm leading-relaxed font-medium text-white/85 sm:text-base md:mb-10 md:max-w-2xl md:text-lg">
            Digitart
            テクノロジー愛好会は、プログラミング・ゲーム開発・デザインを横断しながら、仲間と一緒にプロダクトをつくる青学生クリエイターコミュニティです。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/join" variant="primary" size="md">
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
            </ButtonLink>
            <ButtonLink href="/about" variant="outline-light" size="md">
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
            </ButtonLink>
          </div>

          {/* 期間限定のお知らせ（学園祭の出展など） */}
          {HERO_NOTICE && (
            <Link
              href={HERO_NOTICE.href}
              className="group mt-8 inline-flex max-w-full items-center gap-3 rounded-full border border-white/25 bg-white/10 py-1.5 pr-4 pl-1.5 text-left text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 md:mt-10"
            >
              <span className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold tracking-wider text-white md:text-xs">
                NEWS
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold md:text-sm">{HERO_NOTICE.label}</span>
                <span className="block text-[10px] font-medium text-white/70 md:text-xs">
                  {HERO_NOTICE.detail}
                </span>
              </span>
              <svg
                className="h-4 w-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator />
      </section>

      {/* Spacer */}
      <div className="relative -z-10 h-screen w-full" aria-hidden="true" />
    </>
  );
}
