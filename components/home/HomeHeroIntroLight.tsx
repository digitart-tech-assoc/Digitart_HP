"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface HomeHeroIntroProps {
  phase: "intro" | "expand" | "white" | "done";
}

export default function HomeHeroIntroLight({ phase }: HomeHeroIntroProps) {
  return (
    <>
      {phase !== "done" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{
            backgroundColor: "#ffffff",
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
    </>
  );
}
