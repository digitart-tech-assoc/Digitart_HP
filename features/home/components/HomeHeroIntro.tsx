"use client";

import type { ReactNode } from "react";

/**
 * トップページを開いたときのロゴアニメーションの段階。
 * intro（ロゴ表示）→ expand（ロゴが拡大）→ white（フェードアウト）→ done（終了）の順に進む。
 */
export type IntroPhase = "intro" | "expand" | "white" | "done";

interface HomeHeroIntroProps {
  phase: IntroPhase;
  /** OS のダークモード設定に合わせた背景色 */
  theme: "light" | "dark";
  /** 表示するロゴ（InlineLogo）。<svg> を直接描画するもので、読み込みを待たずに表示できる */
  logo: ReactNode;
}

const BACKGROUND_COLOR = { light: "#ffffff", dark: "#222" } as const;

/** 段階ごとのロゴの大きさ（px） */
const LOGO_SIZE: Record<Exclude<IntroPhase, "done">, number> = {
  intro: 120,
  expand: 2400,
  white: 9600,
};

const EASE_OUT = "1.4s cubic-bezier(0.16,1,0.3,1)";

/** トップページを開いたときに全画面で表示するロゴアニメーション */
export function HomeHeroIntro({ phase, theme, logo }: HomeHeroIntroProps) {
  if (phase === "done") return null;

  const size = LOGO_SIZE[phase];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: BACKGROUND_COLOR[theme],
        opacity: phase === "white" ? 0 : 1,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      {/*
       * transform: scale() で拡大すると、ブラウザは一度描いた画像を引き伸ばすため、ロゴがぼやける。
       * 大きさ（width・height）を変えて、毎フレームをベクターのまま描き直させる。
       */}
      <div
        className="shrink-0"
        style={{
          width: size,
          height: size,
          opacity: phase === "white" ? 0 : 1,
          transition: `width ${EASE_OUT}, height ${EASE_OUT}, opacity 0.5s ease`,
        }}
      >
        {logo}
      </div>
    </div>
  );
}
