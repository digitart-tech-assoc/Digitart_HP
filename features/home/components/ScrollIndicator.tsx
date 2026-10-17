"use client";

import { useEffect, useState } from "react";

const SCROLL_HINT_FADE_PX = 120;

export function ScrollIndicator() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const nextOpacity = Math.max(0, 1 - window.scrollY / SCROLL_HINT_FADE_PX);
      setOpacity((currentOpacity) =>
        currentOpacity === nextOpacity ? currentOpacity : nextOpacity,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5"
      style={{ opacity, transition: "opacity 0.3s" }}
      aria-hidden="true"
    >
      <span className="text-[9px] font-bold tracking-[0.28em] text-white/55 uppercase">Scroll</span>
      <span className="block h-7 w-px bg-white/35" />
    </div>
  );
}
