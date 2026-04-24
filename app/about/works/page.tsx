"use client";

import { getCustomMetadata } from "@/lib/metadata";

import { motion } from "motion/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import JoinUs from "@/components/about/JoinUs";

import choco_mint from "../assets/works/choco-mint.png";
import circle from "../assets/works/CIRCLE.png";
import aterna from "../assets/works/aterna.png";
import programmer_recycle from "../assets/works/programmer-recycle.png";
import slime_defence from "../assets/works/slime-defence.png";
import ai_voicevox from "../assets/works/ai-voicevox.png";


const PROJECTS = [
  {
    title: "チョコミント よりも あ・な・た♡【非公式】",
    desc: "ルビィちゃんが好きなものを「矛盾なく」発表するゲーム。",
    tech: ["Unity", "Figma"],
    image: choco_mint,
    url: "https://unityroom.com/games/chocomint_yorimo_anata",
    category: "Game",
  },
  {
    title: "CIRCLE",
    desc: "サークルの会計処理を効率的に管理,可視化するWebシステム。",
    tech: ["Vue.js", "FastAPI", "Supabase"],
    image: circle,
    url: "https://www.chrom.jp/CIRCLE/",
    category: "Web app",
  },
  {
    title: "Aeterna",
    desc: "ゴシックファンタジーをテーマにした音楽ゲーム。",
    tech: ["Unity", "C#", "Cubase"],
    image: aterna,
    url: "https://unityroom.com/games/aeterna",
    category: "Game",
  },
  {
    title: "プログラマーはrecycle()されました",
    desc: "ロジックを構築し、実行して敵を倒すローグライクゲーム。",
    tech: ["React", "Tailwind CSS", "PostgreSQL"],
    image: programmer_recycle,
    url: null,
    category: "Web app",
  },
  {
    title: "引き放て！スライムディフェンス！",
    desc: "スライムが弓とスキルを駆使して迫りくる敵を迎え撃つタワーディフェンスゲーム。",
    tech: ["Unity", "C#"],
    image: slime_defence,
    url: "https://unityroom.com/games/slimedefence",
    category: "Game",
  },
  {
    title: "AI-VOICEVOX",
    desc: "LLM（生成AI）同士を討論させたり、質問したりできるWebアプリです。",
    tech: ["Next.js", "JavaScript", "Tailwind CSS"],
    image: ai_voicevox,
    url: "https://ai-voicevox.vercel.app/",
    category: "Web app",
  }
];


export default function WorksPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#8cc63f] mb-8 transition-colors font-bold tracking-wider text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            ABOUT US
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#8cc63f] mb-3">
              Projects
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
              制作物
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium"
          >
            プログラミング、デザイン、ハードウェアを横断するメンバーたちが、
            チームで生み出したプロジェクトの数々をご紹介します。
          </motion.p>
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
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="rounded-3xl overflow-hidden shadow-xl relative group"
                    >
                      <ImageWithFallback
                        src={project.image}
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
                        className="absolute top-4 left-4 bg-[#8cc63f] text-white px-3 py-1 rounded-full text-sm font-bold tracking-wider"
                      >
                        {project.category}
                      </div>
                    </motion.div>
                  </a>
                ) : (
                  <div className="block">
                    <div className="rounded-3xl overflow-hidden shadow-xl relative">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full aspect-[16/9] object-cover"
                      />
                      <div
                        className="absolute top-4 left-4 bg-[#8cc63f] text-white px-3 py-1 rounded-full text-sm font-bold tracking-wider"
                      >
                        {project.category}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3
                  className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight"
                >
                  {project.title}
                </h3>
                <p className="text-slate-600 font-medium text-lg md:text-xl leading-relaxed mb-6">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold"
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

      <JoinUs />
    </div>
  );
}
