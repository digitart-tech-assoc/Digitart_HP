"use client";

import { Logo } from "@/components/ui/Logo";

/**
 * トップページを開いたときのロゴアニメーションの段階。
 * intro（ロゴ表示）→ expand（ロゴが拡大）→ white（フェードアウト）→ done（終了）の順に進む。
 */
export type IntroPhase = "intro" | "expand" | "white" | "done";

interface HomeHeroIntroProps {
  phase: IntroPhase;
  /** OS のダークモード設定に合わせた背景色 */
  theme: "light" | "dark";
}

const BACKGROUND_COLOR = { light: "#ffffff", dark: "#222" } as const;

/** トップページを開いたときに全画面で表示するロゴアニメーション */
export function HomeHeroIntro({ phase, theme }: HomeHeroIntroProps) {
  return (
    <>
      {phase !== "done" && (
        <div
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            backgroundColor: BACKGROUND_COLOR[theme],
            opacity: phase === "white" ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          <div
            style={{
              transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease",
              transform:
                phase === "intro" ? "scale(1)" : phase === "expand" ? "scale(20)" : "scale(80)",
              opacity: phase === "white" ? 0 : 1,
              willChange: "transform, opacity",
            }}
          >
            {/* イントロの演出なので、読み上げの対象にしない（alt を空にする） */}
            <Logo size={120} className="block" />
          </div>
        </div>
      )}
    </>
  );
}
