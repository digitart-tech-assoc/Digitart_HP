"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import { HomeHeroBase } from "@/features/home/components/HomeHeroBase";
import { HomeHeroIntro, type IntroPhase } from "@/features/home/components/HomeHeroIntro";

const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function subscribeDarkMode(onChange: () => void) {
  const query = window.matchMedia(DARK_MODE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getDarkModeSnapshot() {
  return window.matchMedia(DARK_MODE_QUERY).matches;
}

/** サーバーでは OS の設定が分からないため null を返し、クライアントで判定するまで描画しない */
function getDarkModeServerSnapshot() {
  return null;
}

type HomeHeroProps = {
  /** イントロに表示するロゴ。読み込みを待たずに表示できるよう、サーバーで作った InlineLogo を渡す */
  introLogo: ReactNode;
};

/** トップページのヒーロー。OS のダークモード設定に合わせてイントロの背景色を切り替える */
export function HomeHero({ introLogo }: HomeHeroProps) {
  const isDark = useSyncExternalStore<boolean | null>(
    subscribeDarkMode,
    getDarkModeSnapshot,
    getDarkModeServerSnapshot,
  );

  if (isDark === null) {
    return null;
  }

  const renderIntro = (phase: IntroPhase) => (
    <HomeHeroIntro phase={phase} theme={isDark ? "dark" : "light"} logo={introLogo} />
  );

  return <HomeHeroBase renderIntro={renderIntro} />;
}
