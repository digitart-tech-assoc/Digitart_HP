"use client";

import { useEffect, useState } from "react";

import { HomeHeroBase } from "@/features/home/components/HomeHeroBase";
import { HomeHeroIntro, type IntroPhase } from "@/features/home/components/HomeHeroIntro";

/** トップページのヒーロー。OS のダークモード設定に合わせてイントロの背景色を切り替える */
export function HomeHero() {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches);
    setIsLoaded(true);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };
    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  if (!isLoaded) {
    return null;
  }

  const renderIntro = (phase: IntroPhase) => (
    <HomeHeroIntro phase={phase} theme={isDark ? "dark" : "light"} />
  );

  return <HomeHeroBase renderIntro={renderIntro} />;
}
