"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Gamepad2,
  Palette,
  Cpu,
  History,
  Briefcase,
  BarChart3,
  Heart,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// image imports (place files under app/about/assets/)
import historyHero from "./assets/history_hero.jpg";
import worksHero from "./assets/works_hero.jpg";
import dataHero from "./assets/data_hero.jpg";
import supportersHero from "./assets/supporters_hero.jpg";

// ImageWithFallback now accepts StaticImageData and resolves src internally.

const GUIDE_CARDS = [
  {
    num: "01",
    title: "History",
    subtitle: "Digitartの歩み",
    desc: "設立からの成長と、団体の挑戦の歴史をご紹介します。",
    icon: History,
    to: "/about/history",
    image: historyHero,
    color: "from-emerald-700 to-teal-950",
  },
  {
    num: "02",
    title: "Works",
    subtitle: "作品・プロジェクト",
    desc: "メンバーが生み出した革新的なプロジェクトをご紹介。",
    icon: Briefcase,
    to: "/about/works",
    image: worksHero,
    color: "from-green-700 to-emerald-950",
  },
  {
    num: "03",
    title: "Data",
    subtitle: "データで見るDigitart",
    desc: "メンバー数やプロジェクト数など、数字でDigitartを知る。",
    icon: BarChart3,
    to: "/about/data",
    image: dataHero,
    color: "from-teal-700 to-cyan-950",
  },
  {
    num: "04",
    title: "Supporter",
    subtitle: "Digitartを支える人たち",
    desc: "団体を支えるメンバーやサポーターにフォーカス。",
    icon: Heart,
    to: "/about/supporter",
    image: supportersHero,
    color: "from-lime-700 to-green-950",
  },
];

const DOMAIN_CARDS = [
  {
    num: "No.01",
    icon: Code,
    title: "Programming",
    desc: "Web app (React, Vue.js), AI/ML",
    color: "bg-emerald-100",
  },
  {
    num: "No.02",
    icon: Gamepad2,
    title: "Games",
    desc: "Unity, Unreal Engine",
    color: "bg-teal-100",
  },
  {
    num: "No.03",
    icon: Palette,
    title: "Design",
    desc: "UI/UX, Graphics, 3D",
    color: "bg-cyan-100",
  }
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Guide Cards Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-emerald-300/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {GUIDE_CARDS.map((card, i) => (
              <motion.div
                key={card.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  href={card.to}
                  className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-square relative">
                    <ImageWithFallback
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}
                    />
                    <div
                      className="absolute top-3 right-3 bg-white/90 text-emerald-700 px-2 py-0.5 rounded-full text-xs"
                      style={{ fontWeight: 600 }}
                    >
                      {card.num}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3
                        className="text-white text-lg md:text-xl"
                        style={{ fontWeight: 700 }}
                      >
                        {card.title}
                      </h3>
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
      <section className="py-24 px-6 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl text-gray-900 mb-6"
              style={{ fontWeight: 700 }}
            >
              About Us
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Digitartテクノロジー愛好会は、あらゆるテクノロジー好きが集まるクリエイター集団です。
              webアプリやゲーム制作を通じたプログラミング、デザイン、ハードウェアなど、多様な分野で活動し、
              技術を通じて新しい価値を創造しています。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {DOMAIN_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`${card.color} p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden`}
              >
                <span
                  className="absolute top-4 right-4 text-xs text-emerald-600/60"
                  style={{ fontWeight: 600 }}
                >
                  {card.num}
                </span>
                <card.icon className="w-12 h-12 text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3
                  className="text-2xl text-gray-900 mb-2"
                  style={{ fontWeight: 700 }}
                >
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Guide Sections */}
      {GUIDE_CARDS.map((card, i) => (
        <section
          key={card.num}
          className={`py-20 px-6 ${i % 2 === 0 ? "bg-white" : "bg-emerald-50/50"}`}
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
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span
                    className="text-emerald-600"
                    style={{ fontWeight: 600 }}
                  >
                    {card.subtitle}
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-4xl text-gray-900 mb-6"
                  style={{ fontWeight: 700 }}
                >
                  {card.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {card.desc}
                </p>
                <Link
                  href={card.to}
                  className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 group"
                >
                  VIEW MORE
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="flex-1">
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
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-6xl mb-6"
              style={{ fontWeight: 700 }}
            >
              Join Us
            </h2>
            <p className="text-xl mb-10 text-white/90 leading-relaxed">
              経験やスキルは問いません。
              <br />
              テクノロジーに興味があれば、誰でも歓迎します。
            </p>
            <Link
              href="/join"
              className="inline-flex items-center gap-3 bg-white text-emerald-600 px-8 py-4 rounded-full text-lg hover:shadow-2xl transition-shadow duration-300"
              style={{ fontWeight: 700 }}
            >
              Show More
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
