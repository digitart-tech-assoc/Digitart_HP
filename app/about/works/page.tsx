"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import ai_voicevox from "@/app/about/assets/works/ai-voicevox.png";
import aterna from "@/app/about/assets/works/aterna.png";
import auth_web_app from "@/app/about/assets/works/auth-web-app.png";
import choco_mint from "@/app/about/assets/works/choco-mint.png";
import programmer_recycle from "@/app/about/assets/works/programmer-recycle.png";
import slime_defence from "@/app/about/assets/works/slime-defence.png";
import JoinUs from "@/components/about/JoinUs";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getCustomMetadata } from "@/lib/metadata";

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
    title: "AuthWebApp",
    desc: "サークルのDiscord処理を管理するWebシステム(内部向け)。",
    tech: ["React", "FastAPI", "Supabase"],
    image: auth_web_app,
    url: null,
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
  },
];

export default function WorksPage() {
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
            作品紹介
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90"
          >
            Digitartメンバーが生み出したプロジェクトの数々
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
            プログラミング、デザイン、ハードウェアを横断するメンバーたちが、
            <br className="hidden md:block" />
            チームで生み出したプロジェクトの数々をご紹介します。
          </motion.p>
        </div>
      </section>

      {/* Projects */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-6xl space-y-20">
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
              <div className="w-full flex-1">
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative overflow-hidden rounded-3xl shadow-xl"
                    >
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="aspect-[16/9] w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span
                          className="flex items-center gap-2 text-white"
                          style={{ fontWeight: 600 }}
                        >
                          View Project <ExternalLink className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="absolute top-4 left-4 rounded-full bg-[#8cc63f] px-3 py-1 text-sm font-bold tracking-wider text-white">
                        {project.category}
                      </div>
                    </motion.div>
                  </a>
                ) : (
                  <div className="block">
                    <div className="relative overflow-hidden rounded-3xl shadow-xl">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="aspect-[16/9] w-full object-cover"
                      />
                      <div className="absolute top-4 left-4 rounded-full bg-[#8cc63f] px-3 py-1 text-sm font-bold tracking-wider text-white">
                        {project.category}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="mb-4 text-3xl leading-tight font-black text-slate-900 md:text-4xl">
                  {project.title}
                </h3>
                <p className="mb-6 text-lg leading-relaxed font-medium text-slate-600 md:text-xl">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-600"
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
