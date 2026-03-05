"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import JoinUs from "@/components/about/JoinUs";

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
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
      { threshold: 0.5 }
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

const STATS = [
  { label: "メンバー数", value: 80, suffix: "名", note: "2026年3月現在" },
  { label: "創立", value: 7, suffix: "周年", note: "2026年3月現在" },
  { label: "活動回数", value: 54, suffix: "回", note: "2025年度実績" },
  { label: "年間イベント開催数", value: 11, suffix: "件", note: "2025年度実績" },
  { label: "Discord発言数", value: 41200, suffix: "件", note: "2025年度実績(速報値)" },
  { label: "Discord通話参加時間", value: 9090,suffix: "時間",note: "2025年度実績(速報値)"}, //9022時間+68時間
];

const BREAKDOWNS = [
  {
    title: "所属学部の内訳(2026年3月現在)",
    items: [
      { label: "情報テクノロジー学科", pct: 51 },
      { label: "社会情報学部", pct: 22 },
      { label: "理工学部(除 情報テクノロジー)", pct: 19 },
      { label: "その他(相模原キャンパス)", pct: 4 },
      { label: "その他(青山キャンパス)", pct: 4 },
    ],
  },
  {
    title: "学年の分布(2026年3月現在)",
    items: [
      { label: "1年生", pct: 37 },
      { label: "2年生", pct: 31 },
      { label: "3年生", pct: 24 },
      { label: "4年生・院生", pct: 8 },
    ],
  },
];

export default function DataPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-teal-400 via-emerald-600 to-green-600 text-white">
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
            Data
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90"
          >
            データで見るDigitart
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
            Digitartにまつわるさまざまな「数字」をご紹介します。
            <br />
            団体の規模感や活動の広がりを、データでお伝えします。
          </motion.p>
        </div>
      </section>

      {/* Big Numbers */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center p-6 md:p-10 bg-emerald-50 rounded-3xl"
              >
                <p
                  className="text-sm text-emerald-600 mb-2"
                  style={{ fontWeight: 600 }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-4xl md:text-6xl text-emerald-700"
                  style={{ fontWeight: 700 }}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-gray-400 mt-2">{stat.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakdowns */}
      <section className="py-20 px-6 pb-32">
        <div className="max-w-5xl mx-auto space-y-16">
          {BREAKDOWNS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <h3
                  className="text-2xl text-gray-900"
                  style={{ fontWeight: 700 }}
                >
                  {section.title}
                </h3>
              </div>
              <div className="space-y-4">
                {section.items.map((item, ii) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="w-28 text-sm text-gray-600 shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: si * 0.2 + ii * 0.1,
                        }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-end pr-3"
                      >
                        <span
                          className="text-white text-xs"
                          style={{ fontWeight: 600 }}
                        >
                          {item.pct}%
                        </span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <JoinUs />
    </div>
  );
}
