"use client";

import { motion } from "motion/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";

import choco_mint from "../assets/works/choco-mint.png";
import circle from "../assets/works/CIRCLE.png";
import aterna from "../assets/works/aterna.png";
import programmer_recycle from "../assets/works/programmer-recycle.png";

const PROJECTS = [
  {
    title: "チョコミント よりも あ・な・た♡【非公式】",
    desc: "ルビィちゃんが好きなものを「矛盾なく」発表するゲーム。",
    tech: ["Unity", "Figma"],
    image: choco_mint,
    category: "Game",
  },
  {
    title: "CIRCLE",
    desc: "サークルの会計処理を効率的に管理,可視化するWebシステム。",
    tech: ["Vue.js", "FastAPI", "Supabase"],
    image: circle,
    category: "Web app",
  },
  {
    title: "Aterna",
    desc: "ゴシックファンタジーをテーマにした音楽ゲーム。",
    tech: ["Unity", "C#", "Cubase"],
    image: aterna,
    category: "Game",
  },
  {
    title: "プログラマーはrecycle()されました",
    desc: "ロジックを構築し、実行して敵を倒すローグライクゲーム。",
    tech: ["React", "Tailwind CSS", "PostgreSQL"],
    image: programmer_recycle,
    category: "Web app",
  },
];

export default function WorksPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-green-400 via-emerald-600 to-teal-600 text-white">
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
            Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90"
          >
            作品・プロジェクト
          </motion.p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="border-2 border-gray-300 rounded-full px-6 py-3 text-gray-700">
                テクノロジーの追求
              </div>
              <div className="border-2 border-gray-300 rounded-full px-6 py-3 text-gray-700">
                クリエイティブの実現
              </div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              プログラミング、デザイン、ハードウェアを横断するメンバーたちが、
              チームで生み出した革新的なプロジェクトの数々をご紹介します。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12`}
            >
              <div className="flex-1 w-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-3xl overflow-hidden shadow-xl relative group"
                >
                  <ImageWithFallback
                    src={typeof project.image === "string" ? project.image : (project.image?.src ?? String(project.image))}
                    alt={project.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span
                      className="text-white flex items-center gap-2"
                      style={{ fontWeight: 600 }}
                    >
                      View Project <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                  <div
                    className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    {project.category}
                  </div>
                </motion.div>
              </div>

              <div className="flex-1">
                <h3
                  className="text-3xl text-gray-900 mb-4"
                  style={{ fontWeight: 700 }}
                >
                  {project.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                      style={{ fontWeight: 500 }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
