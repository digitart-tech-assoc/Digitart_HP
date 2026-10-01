"use client";

import {
  ArrowRight,
  Code,
  Gamepad2,
  Palette,
  History,
  Calendars,
  Briefcase,
  BarChart3,
  Heart,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import JoinUs from "@/components/about/JoinUs";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// image imports (place files under app/about/assets/)
import dataHero from "./assets/data_hero.jpg";
import eventHero from "./assets/events_hero.jpg";
import historyHero from "./assets/history_hero.jpg";
import supportersHero from "./assets/supporters_hero.jpg";
import worksHero from "./assets/works_hero.jpg";

// ImageWithFallback now accepts StaticImageData and resolves src internally.

const GUIDE_CARDS = [
  {
    num: "01",
    title: "年間行事",
    subtitle: "Events",
    desc: "作品制作や交流を深める、年間の定例イベントや特別イベントをご紹介します。",
    icon: Calendars,
    to: "/about/events",
    image: eventHero,
    color: "from-lime-700 to-green-950",
  },
  {
    num: "02",
    title: "作品紹介",
    subtitle: "Works",
    desc: "メンバーが生み出した作品の数々をご紹介。",
    icon: Briefcase,
    to: "/about/works",
    image: worksHero,
    color: "from-green-700 to-emerald-950",
  },
  {
    num: "03",
    title: "団体の歩み",
    subtitle: "History",
    desc: "設立からの成長と、団体の挑戦の歴史をご紹介します。",
    icon: History,
    to: "/about/history",
    image: historyHero,
    color: "from-emerald-700 to-teal-950",
  },
  {
    num: "04",
    title: "活動データ",
    subtitle: "Data",
    desc: "メンバー数やプロジェクト数など、数字でDigitartを知る。",
    icon: BarChart3,
    to: "/about/data",
    image: dataHero,
    color: "from-teal-700 to-cyan-950",
  },
  {
    num: "05",
    title: "幹部紹介",
    subtitle: "Supporters",
    desc: "団体を支えるメンバーやサポーターにフォーカス。",
    icon: Heart,
    to: "/about/supporter",
    image: supportersHero,
    color: "from-lime-700 to-green-950",
  },
];

// Determine grid columns: up to 5 columns on md+ screens
const GUIDE_COLS = Math.min(GUIDE_CARDS.length, 5);
// Map to explicit Tailwind classes so PurgeCSS/Tailwind can see them
const MD_GRID_CLASS =
  {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  }[GUIDE_COLS] || "md:grid-cols-5";

const DOMAIN_CARDS = [
  {
    num: "No.01",
    icon: Code,
    title: "プログラミング",
    desc: "Webアプリ開発, AI/機械学習",
    color: "bg-emerald-100",
  },
  {
    num: "No.02",
    icon: Gamepad2,
    title: "ゲーム開発",
    desc: "Unity, Unreal Engineを用いた開発",
    color: "bg-teal-100",
  },
  {
    num: "No.03",
    icon: Palette,
    title: "デザイン",
    desc: "UI/UX, グラフィック, 3Dモデリング",
    color: "bg-cyan-100",
  },
];

export default function AboutPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isHovered = false;
    const interval = setInterval(() => {
      // Only auto-scroll on mobile devices
      if (window.innerWidth >= 768) return;

      if (scrollRef.current && !isHovered) {
        const container = scrollRef.current;
        if (container.children.length >= GUIDE_CARDS.length * 2) {
          const originalFirst = container.children[0] as HTMLElement;
          const cloneFirst = container.children[GUIDE_CARDS.length] as HTMLElement;

          if (originalFirst && cloneFirst) {
            const loopPoint = cloneFirst.offsetLeft - originalFirst.offsetLeft;
            const scrollAmount = loopPoint / GUIDE_CARDS.length;

            // If we've reached the second set of cards, seamlessly jump back to the first set
            // before initiating the next scroll step to create a perfect loop.
            if (Math.ceil(container.scrollLeft) >= loopPoint) {
              container.scrollLeft = container.scrollLeft - loopPoint;
            }

            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        }
      }
    }, 3000);

    const handleTouchStart = () => {
      isHovered = true;
    };
    const handleTouchEnd = () => {
      setTimeout(() => {
        isHovered = false;
      }, 2000);
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      clearInterval(interval);
      if (el) {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  return (
    <div className="bg-white pt-20">
      {/* Guide Cards Grid */}
      <section className="px-6 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div
            ref={scrollRef}
            className={`-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 md:mx-0 md:grid md:px-0 md:pb-0 ${MD_GRID_CLASS} [scrollbar-width:none] after:w-1 after:shrink-0 md:justify-items-center md:gap-6 md:after:hidden [&::-webkit-scrollbar]:hidden`}
          >
            {[...GUIDE_CARDS, ...GUIDE_CARDS].map((card, i) => (
              <motion.div
                key={`${card.num}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % GUIDE_CARDS.length) * 0.1 }}
                className={`w-[60vw] shrink-0 snap-center sm:w-[45vw] md:w-full ${i >= GUIDE_CARDS.length ? "md:hidden" : ""}`}
              >
                <Link
                  href={card.to}
                  className="group relative mx-auto block h-full w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative flex aspect-[4/3] items-end md:aspect-square">
                    <ImageWithFallback
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-40 transition-opacity duration-500 group-hover:opacity-60`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    <div className="relative z-10 w-full p-5 text-left md:p-6">
                      <h3 className="mb-1.5 text-xl font-black text-white md:mb-2 md:text-2xl">
                        {card.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-white/90 md:line-clamp-3 md:text-sm">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-12 max-w-3xl text-center text-lg leading-relaxed text-gray-600"
          >
            私たちの活動やモノづくりへの想い、
            <br className="md:hidden" />
            「Digitartは何をやっている団体？」など、
            <br className="md:hidden" />
            さまざまな角度から解説します。
          </motion.p>
        </div>
      </section>

      {/* Domain Overview Section */}
      <section className="border-t border-slate-100 bg-white px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-[10px] font-bold tracking-[0.3em] text-[#8cc63f] uppercase md:text-xs">
              Overview
            </p>
            <h2 className="mb-8 text-4xl font-black text-slate-900 md:text-5xl">
              Digitartについて
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
              Digitartテクノロジー愛好会は、青山学院大学のあらゆるテクノロジー好きが集まるクリエイター集団です。
              プログラミング、ゲーム開発、デザイン、ハードウェアなど、多様な分野で活動し、
              技術を通じて新しい価値を創造しています。
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {DOMAIN_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`${card.color} relative overflow-hidden rounded-2xl p-5 md:rounded-3xl md:p-8`}
              >
                <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-0">
                  <card.icon className="h-8 w-8 shrink-0 text-emerald-600 md:mb-4 md:h-12 md:w-12" />
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-slate-900 md:mb-2 md:text-2xl">
                      {card.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-600 md:text-base">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Guide Sections */}
      {GUIDE_CARDS.map((card, i) => (
        <section
          key={card.num}
          className={`px-6 py-20 md:py-32 ${i % 2 === 0 ? "bg-slate-50/60" : "bg-white"}`}
        >
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}
            >
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#8cc63f] uppercase md:text-xs">
                    {card.subtitle}
                  </span>
                </div>
                <h2 className="mb-8 text-3xl leading-tight font-black text-slate-900 md:text-5xl">
                  {card.title}
                </h2>
                <p className="mb-10 text-lg leading-relaxed font-medium text-slate-600">
                  {card.desc}
                </p>
                <Link
                  href={card.to}
                  className="group inline-flex items-center gap-3 rounded-full border-2 border-slate-900 px-8 py-4 text-sm font-bold text-slate-900 transition-all duration-300 hover:bg-slate-900 hover:text-white"
                >
                  詳しく見る
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="flex-1">
                <Link href={card.to} className="block">
                  <motion.div
                    whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? 2 : -2 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden rounded-2xl border-4 border-white shadow-xl"
                  >
                    <ImageWithFallback
                      src={card.image}
                      alt={card.title}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      <JoinUs />
    </div>
  );
}
