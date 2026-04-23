"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Code,
  Gamepad2,
  Palette,
  Cpu,
  History,
  Calendars,
  Briefcase,
  BarChart3,
  Heart,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import JoinUs from "@/components/about/JoinUs";

// image imports (place files under app/about/assets/)
import historyHero from "./assets/history_hero.jpg";
import eventHero from "./assets/events_hero.jpg";
import worksHero from "./assets/works_hero.jpg";
import dataHero from "./assets/data_hero.jpg";
import supportersHero from "./assets/supporters_hero.jpg";

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
const MD_GRID_CLASS = {
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
  }
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

    const handleTouchStart = () => { isHovered = true; };
    const handleTouchEnd = () => { 
      setTimeout(() => { isHovered = false; }, 2000); 
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener('touchstart', handleTouchStart, { passive: true });
      el.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      clearInterval(interval);
      if (el) {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  return (
    <div className="bg-white pt-20">
      {/* Guide Cards Grid */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            ref={scrollRef}
            className={`flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6 md:pb-0 md:mx-0 md:px-0 md:grid ${MD_GRID_CLASS} md:gap-6 md:justify-items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden after:w-1 after:shrink-0 md:after:hidden`}
          >
            {[...GUIDE_CARDS, ...GUIDE_CARDS].map((card, i) => (
              <motion.div
                key={`${card.num}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % GUIDE_CARDS.length) * 0.1 }}
                className={`shrink-0 w-[60vw] sm:w-[45vw] md:w-full snap-center ${i >= GUIDE_CARDS.length ? "md:hidden" : ""}`}
              >
                <Link
                  href={card.to}
                  className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 mx-auto w-full h-full"
                >
                  <div className="aspect-[4/3] md:aspect-square relative flex items-end">
                    <ImageWithFallback
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    <div className="relative z-10 w-full p-5 md:p-6 text-left">
                      <h3
                        className="text-white text-xl md:text-2xl font-black mb-1.5 md:mb-2"
                      >
                        {card.title}
                      </h3>
                      <p className="text-white/90 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
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
            className="text-center text-gray-600 mt-12 text-lg leading-relaxed max-w-3xl mx-auto"
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
      <section className="py-24 md:py-32 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p
              className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-3"
            >
              Overview
            </p>
            <h2
              className="text-4xl md:text-5xl font-black text-slate-900 mb-8"
            >
              Digitartについて
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Digitartテクノロジー愛好会は、青山学院大学のあらゆるテクノロジー好きが集まるクリエイター集団です。
              プログラミング、ゲーム開発、デザイン、ハードウェアなど、多様な分野で活動し、
              技術を通じて新しい価値を創造しています。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {DOMAIN_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`${card.color} p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden`}
              >
                <div className="flex items-center md:items-start md:flex-col gap-4 md:gap-0">
                  <card.icon className="w-8 h-8 md:w-12 md:h-12 text-emerald-600 shrink-0 md:mb-4" />
                  <div>
                    <h3
                      className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2"
                    >
                      {card.title}
                    </h3>
                    <p className="text-sm md:text-base font-medium text-slate-600">{card.desc}</p>
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
          className={`py-20 md:py-32 px-6 ${i % 2 === 0 ? "bg-slate-50/60" : "bg-white"}`}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f]">
                    {card.subtitle}
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight"
                >
                  {card.title}
                </h2>
                <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10">
                  {card.desc}
                </p>
                <Link
                  href={card.to}
                  className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold text-slate-900 border-2 border-slate-900 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300 group"
                >
                  詳しく見る
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="flex-1">
                <Link href={card.to} className="block">
                  <motion.div
                    whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? 2 : -2 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                  >
                    <ImageWithFallback
                      src={card.image}
                      alt={card.title}
                      className="w-full aspect-[4/3] object-cover"
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
