import { ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";

import { JoinUsSection } from "@/components/sections/JoinUsSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { GuideCardCarousel } from "@/features/about/components/GuideCardCarousel";
import { DOMAIN_CARDS, GUIDE_CARDS } from "@/features/about/data";

// md 以上の画面では最大 5 列で並べる
const GUIDE_COLS = Math.min(GUIDE_CARDS.length, 5);
// Tailwind がクラス名を検出できるよう、完全なクラス名で書く
const MD_GRID_CLASS =
  {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  }[GUIDE_COLS] || "md:grid-cols-5";

export function AboutPage() {
  return (
    <div className="bg-white pt-20">
      {/* Guide Cards Grid */}
      <section className="px-6 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <GuideCardCarousel
            itemCount={GUIDE_CARDS.length}
            className={`-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 md:mx-0 md:grid md:px-0 md:pb-0 ${MD_GRID_CLASS} [scrollbar-width:none] after:w-1 after:shrink-0 md:justify-items-center md:gap-6 md:after:hidden [&::-webkit-scrollbar]:hidden`}
          >
            {[...GUIDE_CARDS, ...GUIDE_CARDS].map((card, i) => (
              <motion.div
                key={`${card.num}-${i}`}
                initial={false}
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
          </GuideCardCarousel>

          <motion.p
            initial={false}
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
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <Eyebrow className="mb-3">Overview</Eyebrow>
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
                initial={false}
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
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}
            >
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-brand uppercase md:text-xs">
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

      <JoinUsSection />
    </div>
  );
}
