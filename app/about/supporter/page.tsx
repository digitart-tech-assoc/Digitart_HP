"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import JoinUs from "@/components/about/JoinUs";

import icon_chrom from "../assets/supporter/icon_chrom.jpg";
import icon_mimisuke from "../assets/supporter/icon_mimisuke.png";

const MEMBERS = [
  {
    name: "くろむ",
    role: "代表",
    year: "社会情報学部社会情報学科 2年",
    quote:
      "テクノロジーで人の生活を豊かにしたい。Digitartはその夢を形にできる場所です。",
    image: icon_chrom,
  },
  {
    name: null,
    role: "副代表",
    year: null,
    quote:
      null,
    image: null,
  },
  {
    name: null,
    role: "副代表",
    year: null,
    quote:
      null,
    image: null,
  },
  {
    name: null,
    role: "会計",
    year: null,
    quote:
      null,
    image: null,
  },
  {
    name: "みみすけ",
    role: "広報",
    year: "情報テクノロジー学科 2年",
    quote:
      "エラーはトモダチ！赤文字が出るたびワクワクする体質になりませんか？^o^",
    image: icon_mimisuke,
  },
];

const QA = [
  {
    q: "Digitartの雰囲気ってどんなもの？",
    a: "和気あいあいとした雰囲気です。技術レベルに関係なく、お互いに教え合い、学び合う文化があります。初心者から上級者まで、全員がフラットに議論できる環境を大切にしています。",
  },
  {
    q: "未経験者ですがサークルに入れますか？",
    a: "スキルは一切不要です！プログラミング未経験の方でも、経験者の方も大歓迎。好奇心と学ぶ意欲があれば、先輩メンバーがサポートします。",
  },
  {
    q: "他のサークルとの掛け持ちはできますか？",
    a: "もちろんです。プロジェクトへの参加は自由で、自分のペースで活動できます。テスト期間中は対面活動を行わないなど、学業との両立も応援しています。",
  },
];

export default function SupporterPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-lime-400 via-green-600 to-emerald-600 text-white">
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
            Supporter
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90"
          >
            Digitartを支える人たち
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
            Digitartにはどんなメンバーが集まっているのか？
            <br />
            Digitartを支える「人」にフォーカスします。
          </motion.p>
        </div>
      </section>

      {/* Member Profiles */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-gray-900" style={{ fontWeight: 700 }}>
              第7期役員
            </h2>
          </div>
          {MEMBERS.map((member: any, i) => {
            const resolvedImage =
              member.image == null
                ? null
                : typeof member.image === "string"
                ? member.image
                : member.image?.src ?? String(member.image);

            return (
            <motion.div
              key={`${member.name ?? 'member'}-${i}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12`}
            >
              <div className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl border-4 border-emerald-100"
                >
                  {resolvedImage ? (
                    <ImageWithFallback
                      src={resolvedImage}
                      alt={member.name ?? member.role ?? 'Supporter'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                      <span className="text-sm">画像なし</span>
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <span
                  className="text-emerald-500 text-sm"
                  style={{ fontWeight: 600 }}
                >
                  {member.year}
                </span>
                <h3
                  className="text-3xl text-gray-900 mt-1 mb-1"
                  style={{ fontWeight: 700 }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-emerald-600 mb-6"
                  style={{ fontWeight: 500 }}
                >
                  {member.role}
                </p>
                <div className="relative bg-emerald-50 p-6 rounded-2xl">
                  <Quote className="w-8 h-8 text-emerald-300 absolute top-4 left-4" />
                  <p className="text-gray-700 leading-relaxed pl-8 pt-2 italic">
                    {member.quote}
                  </p>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </section>

      {/* Q&A Section */}
      <section className="py-20 px-6 bg-emerald-50/60">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl text-gray-900 mb-4"
              style={{ fontWeight: 700 }}
            >
              Q&A
            </h2>
            <p className="text-gray-600">よくある質問</p>
          </motion.div>

          <div className="space-y-6">
            {QA.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span
                    className="text-emerald-500 text-2xl"
                    style={{ fontWeight: 700 }}
                  >
                    Q.{String(i + 1).padStart(2, "0")}
                  </span>
                  <h4
                    className="text-xl text-gray-900"
                    style={{ fontWeight: 600 }}
                  >
                    {item.q}
                  </h4>
                </div>
                <p className="text-gray-600 leading-relaxed ml-14">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <JoinUs />
    </div>
  );
}
