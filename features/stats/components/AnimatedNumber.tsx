"use client";

import { animate, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

/** 画面に入ったときに 0 から value までカウントアップする数値 */
export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(motionValue, value, { duration: 2, ease: "easeOut" });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [motionValue, value]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = v.toLocaleString() + suffix;
      }
    });
    return unsub;
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
