"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";

import period1 from "../assets/history/1-period.jpg";
import period4 from "../assets/history/4-period.jpg";
import period5 from "../assets/history/5-period.jpg";
import period6 from "../assets/history/6-period.jpg";
import period7 from "../assets/history/7-period.jpg";



const TIMELINE = [
  {
    year: "第1期(2019-2020)",
    title: "設立",
    desc: "有志の学生によりPiedPiper青山テック愛好会(当時)が設立。プログラミング勉強会からスタート。",
    image: period1,
  },
  {
    year: "第4期(2022-2023)",
    title: "大学公認愛好会に",
    desc: "大学から正式に公認され、サークル活動がステップアップ。",
    image: period4,
  },
  {
    year: "第5期(2023-2024)",
    title: "企業コラボ開始",
    desc: "某プログラミング学習サービス企業様と連携しハッカソンを実施。学生の開発経験が大幅に向上。",
    image: period5,
  },
  {
    year: "第6期(2024-2025)",
    title: "イベント・プロジェクトが活発化",
    desc: "初開催となる夏合宿や、規模を拡大したBBQ、夏休み講座などイベントが大盛況。プロジェクト数も過去最高に。",
    image: period6,
  },
  {
    year: "第7期(2025-2026)",
    title: "現在・そして未来へ",
    desc: "「Digitartテクノロジー愛好会」に改称。テクノロジーとクリエイティビティを融合し、さらなる挑戦を続けています。",
    image: period7,
  },
];

export default function HistoryPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-emerald-400 via-green-600 to-teal-600 text-white">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ABOUT US
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl mb-4"
            style={{ fontWeight: 700 }}
          >
            History
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90"
          >
            Digitartの挑戦の歴史
          </motion.p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            2019年に設立されたDigitartテクノロジー愛好会。
            わずか5名からスタートした団体が、どのように成長し、挑戦を続けてきたのか。
            ターニングポイントとなった出来事をお伝えします。
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-6 pb-32">
        <div className="max-w-5xl mx-auto relative">
          {/* Center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-200 transform md:-translate-x-0.5" />

          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`relative mb-16 flex flex-col md:flex-row items-start gap-8 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-emerald-400 rounded-full border-4 border-white shadow-md transform -translate-x-2 md:-translate-x-2 z-10" />

              {/* Content */}
              <div
                className={`flex-1 ml-14 md:ml-0 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}
              >
                <span
                  className="text-emerald-500 text-sm"
                  style={{ fontWeight: 600 }}
                >
                  {item.year}
                </span>
                <h3
                  className="text-2xl text-gray-900 mt-1 mb-3"
                  style={{ fontWeight: 700 }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>

              {/* Image */}
              <div
                className={`flex-1 ml-14 md:ml-0 ${i % 2 === 0 ? "md:pl-16" : "md:pr-16"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="rounded-2xl overflow-hidden shadow-lg"
                >
                  <ImageWithFallback
                    src={typeof item.image === "string" ? item.image : (item.image?.src ?? String(item.image))}
                    alt={item.title}
                    className="w-full aspect-video object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
