"use client";

import { ArrowLeft } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import JoinUs from "@/components/about/JoinUs";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
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

const STATS = [
  { label: "メンバー数", value: 105, suffix: "名", note: "2026年5月現在" },
  { label: "創立", value: 7, suffix: "周年", note: "2026年3月現在" },
  { label: "活動回数", value: 54, suffix: "回", note: "2025年度実績" },
  { label: "年間イベント開催数", value: 11, suffix: "件", note: "2025年度実績" },
  { label: "Discord発言数", value: 41200, suffix: "件", note: "2025年度実績(速報値)" },
  { label: "Discord通話参加時間", value: 1504, suffix: "時間", note: "2026年度速報値" },
];

const BREAKDOWNS = [
  {
    title: "所属学部の内訳(2026年5月17日現在)",
    items: [
      { label: "情報テクノロジー学科", pct: 55 },
      { label: "社会情報学部", pct: 17 },
      { label: "理工学部(除 情報テクノロジー)", pct: 14 },
      { label: "その他(相模原キャンパス)", pct: 8 },
      { label: "その他(青山キャンパス)", pct: 5 },
    ],
  },
  {
    title: "学年の分布(2026年5月17日現在)",
    items: [
      { label: "1年生", pct: 27 },
      { label: "2年生", pct: 31 },
      { label: "3年生", pct: 24 },
      { label: "4年生", pct: 13 },
      { label: "院生", pct: 4 },
    ],
  },
];

export default function DataPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 px-6 pt-32 pb-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl">
          <Link
            href="/about"
            className="mb-8 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-5xl md:text-7xl"
            style={{ fontWeight: 700 }}
          >
            活動データ
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
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg leading-relaxed text-gray-600"
          >
            Digitartにまつわるさまざまな「数字」をご紹介します。
            <br />
            団体の規模感や活動の広がりを、データでお伝えします。
          </motion.p>
        </div>
      </section>

      {/* Big Numbers */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-3xl bg-emerald-50 p-6 text-center md:p-10"
              >
                <p className="mb-2 text-sm text-emerald-600" style={{ fontWeight: 600 }}>
                  {stat.label}
                </p>
                <p className="text-4xl text-emerald-700 md:text-6xl" style={{ fontWeight: 700 }}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-xs text-gray-400">{stat.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakdowns */}
      <section className="px-6 py-20 pb-32">
        <div className="mx-auto max-w-5xl space-y-16">
          {BREAKDOWNS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <h3 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
                  {section.title}
                </h3>
              </div>
              <div className="space-y-4">
                {section.items.map((item, ii) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="w-28 shrink-0 text-sm text-gray-600">{item.label}</span>
                    <div className="h-8 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: si * 0.2 + ii * 0.1,
                        }}
                        className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 pr-3"
                      >
                        <span className="text-xs text-white" style={{ fontWeight: 600 }}>
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
