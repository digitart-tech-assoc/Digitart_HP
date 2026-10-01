"use client";

import { StaticImageData } from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type Item = {
  href: string;
  en: string;
  ja: string;
  image: StaticImageData;
};

export default function FeaturedCarousel({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % items.length);
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length]);

  return (
    <div className="relative w-full overflow-hidden pt-10 pb-16">
      <div className="relative flex h-[350px] w-full items-center justify-center perspective-[1200px] sm:h-[450px] lg:h-[550px]">
        {items.map((item, i) => {
          let diff = i - active;
          // Normalize diff to be between -1 to 2 when running 4 items
          while (diff <= -2) diff += items.length;
          while (diff > 2) diff -= items.length;

          // Mapping:
          // 0 : Center, Active
          // 1 : Right
          // -1: Left
          // 2 : Hidden

          let x = 0;
          let scale = 0.5;
          let opacity = 0;
          let zIndex = 0;

          if (diff === 0) {
            x = 0;
            scale = 1;
            opacity = 1;
            zIndex = 20;
          } else if (diff === 1) {
            x = 60;
            scale = 0.85;
            opacity = 0.5;
            zIndex = 10;
          } else if (diff === -1) {
            x = -60;
            scale = 0.85;
            opacity = 0.5;
            zIndex = 10;
          } else {
            // Hidden
            x = 0;
            scale = 0.3;
            opacity = 0;
            zIndex = 0;
          }

          const isActive = diff === 0;

          return (
            <div
              key={item.href}
              className="absolute top-1/2 left-1/2 transition-all duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                width: "80vw", // Default mobile
                maxWidth: "650px",
                height: "100%",
                transform: `translate(calc(-50% + ${x}vw), -50%) scale(${scale})`,
                zIndex,
                opacity,
              }}
            >
              <Link
                href={item.href}
                className="group relative block h-full w-full origin-center overflow-hidden rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] md:rounded-3xl"
                onClick={(e) => {
                  if (!isActive) {
                    e.preventDefault();
                    if (timerRef.current) clearInterval(timerRef.current);
                    setActive(i);
                  }
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-linear"
                  style={{
                    backgroundImage: `url(${item.image.src})`,
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                  }}
                />
                <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-12">
                  <p className="mb-2 text-xs font-bold tracking-[0.3em] text-white/80 uppercase md:mb-3 md:text-sm">
                    {item.en}
                  </p>
                  <p className="text-2xl leading-tight font-black text-white md:text-4xl lg:text-5xl">
                    {item.ja}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-3 md:mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              setActive(i);
            }}
            className={`h-2 rounded-full transition-all duration-[600ms] ${
              i === active
                ? "w-8 bg-[#8cc63f] shadow-[0_0_10px_rgba(140,198,63,0.5)]"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`スライド ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
