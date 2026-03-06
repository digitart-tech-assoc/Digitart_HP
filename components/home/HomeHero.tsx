"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { SITE_NAME } from "@/lib/constants";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border  mb-12 md:mb-14 border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pointer-events-none absolute -top-16 -right-14 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="pointer-events-none absolute -bottom-20 -left-14 h-52 w-52 rounded-full bg-teal-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-bold text-emerald-700"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Aoyama Gakuin Creator Community
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900"
          >
            Build with Code,
            <br />
            <span className="text-emerald-600">Create with Heart</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="max-w-2xl text-base md:text-lg text-slate-600 font-medium leading-relaxed"
          >
            {SITE_NAME}テクノロジー愛好会は、プログラミング・ゲーム開発・デザインを横断しながら、
            仲間と一緒にプロダクトをつくる青学生クリエイターコミュニティです。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-wrap gap-3 pt-1"
          >
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              入会する
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            >
              活動を見る
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="flex items-center justify-center lg:justify-end"
        >
          <motion.div
            whileHover={{ rotate: 540, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-300/30 blur-3xl" aria-hidden="true" />
            <Image
              src="/images/digitart_white_normal.svg"
              alt={`${SITE_NAME} logo`}
              width={340}
              height={340}
              className="relative w-52 md:w-64 lg:w-80 h-auto drop-shadow-[0_20px_24px_rgba(15,23,42,0.18)]"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
