"use client";

import { animate } from "motion/react";
import { useEffect, useRef } from "react";

function format(value: number, suffix: string) {
  // サーバーと閲覧者の端末でロケールが違っても、同じ表記になるよう固定する
  return value.toLocaleString("ja-JP") + suffix;
}

/**
 * 画面に入ったときに 0 から value までカウントアップする数値。
 * 初期 HTML には最終的な値を出しておき、JS が読み込めない環境や
 * 視差効果を減らす設定のときは、カウントアップせずにその値を表示する。
 */
export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.textContent = format(0, suffix);
    let controls: ReturnType<typeof animate> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls = animate(0, value, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (v) => {
              node.textContent = format(Math.round(v), suffix);
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      controls?.stop();
      node.textContent = format(value, suffix);
    };
  }, [value, suffix]);

  return <span ref={ref}>{format(value, suffix)}</span>;
}
