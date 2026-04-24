"use client";

import { useEffect, useState } from "react";
import HomeHeroBase from "./HomeHeroBase";
import HomeHeroIntroLight from "./HomeHeroIntroLight";
import HomeHeroIntroDark from "./HomeHeroIntroDark";

type Phase = "intro" | "expand" | "white" | "done";

export default function HomeHero() {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check system preference
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches);
    setIsLoaded(true);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };
    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  if (!isLoaded) {
    return null;
  }

  const renderIntro = (phase: Phase) =>
    isDark 
      ? <HomeHeroIntroDark phase={phase} />
      : <HomeHeroIntroLight phase={phase} />;

  return <HomeHeroBase renderIntro={renderIntro} />;
}

