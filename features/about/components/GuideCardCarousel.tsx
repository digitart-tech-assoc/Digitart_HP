"use client";

import { useEffect, useRef } from "react";

type GuideCardCarouselProps = {
  /**
   * カードの枚数（複製前）。
   * 無限ループに見せるため、children にはカードを 2 周分並べて渡す。
   */
  itemCount: number;
  className?: string;
  children: React.ReactNode;
};

/** スクロール間隔（ミリ秒） */
const SCROLL_INTERVAL_MS = 3000;
/** タッチ操作のあと、自動スクロールを再開するまでの時間（ミリ秒） */
const RESUME_DELAY_MS = 2000;

/**
 * スマートフォン表示のとき、横並びのカードを一定間隔で自動スクロールする。
 * PC 表示（幅 768px 以上）ではグリッド表示になるため何もしない。
 */
export function GuideCardCarousel({ itemCount, className, children }: GuideCardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isTouching = false;
    const interval = setInterval(() => {
      if (window.innerWidth >= 768) return;

      const container = scrollRef.current;
      if (!container || isTouching) return;
      if (container.children.length < itemCount * 2) return;

      const originalFirst = container.children[0] as HTMLElement;
      const cloneFirst = container.children[itemCount] as HTMLElement;
      const loopPoint = cloneFirst.offsetLeft - originalFirst.offsetLeft;
      const scrollAmount = loopPoint / itemCount;

      // 2 周目の先頭まで来たら、見た目が同じ 1 周目へ瞬時に戻してから次へ進める
      if (Math.ceil(container.scrollLeft) >= loopPoint) {
        container.scrollLeft = container.scrollLeft - loopPoint;
      }
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }, SCROLL_INTERVAL_MS);

    const handleTouchStart = () => {
      isTouching = true;
    };
    const handleTouchEnd = () => {
      setTimeout(() => {
        isTouching = false;
      }, RESUME_DELAY_MS);
    };

    const el = scrollRef.current;
    el?.addEventListener("touchstart", handleTouchStart, { passive: true });
    el?.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      clearInterval(interval);
      el?.removeEventListener("touchstart", handleTouchStart);
      el?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [itemCount]);

  return (
    <div ref={scrollRef} className={className}>
      {children}
    </div>
  );
}
