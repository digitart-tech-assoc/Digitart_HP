"use client";

import { ArrowLeft, Quote } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import icon_banetu from "@/app/(site)/about/assets/supporter/icon_banetu.jpg";
import icon_bell from "@/app/(site)/about/assets/supporter/icon_bell.jpg";
import icon_chrom from "@/app/(site)/about/assets/supporter/icon_chrom.jpg";
import icon_kuzumochi from "@/app/(site)/about/assets/supporter/icon_kuzumochi.png";
import icon_mimisuke from "@/app/(site)/about/assets/supporter/icon_mimisuke.png";
import JoinUs from "@/components/about/JoinUs";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

const MEMBERS = [
  {
    name: "くろむ",
    role: "代表",
    year: "社会情報学部社会情報学科 3年",
    quote: "テクノロジーで何かを作りたい。Digitartはその夢を形にできる場所です。",
    image: icon_chrom,
  },
  {
    name: "Banetu",
    role: "副代表",
    year: "情報テクノロジー学科 3年",
    quote: "Digitartの作曲&ゲーム（プレイ）担当。コード書けなくても居場所はあるよ！",
    image: icon_banetu,
  },
  {
    name: "ベル",
    role: "副代表",
    year: "情報テクノロジー学科 3年",
    quote: "Welcome to the underground!",
    image: icon_bell,
  },
  {
    name: "葛餅",
    role: "会計",
    year: "情報テクノロジ学科 2年",
    quote: "興味があるなら飛び込んでみませんか！歓迎しますよ！",
    image: icon_kuzumochi,
  },
  {
    name: "みみすけ",
    role: "広報",
    year: "情報テクノロジー学科 3年",
    quote: "エラーはトモダチ！赤文字が出るたびワクワクする体質になりませんか？^o^",
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
            幹部紹介
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
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg leading-relaxed text-gray-600"
          >
            Digitartにはどんなメンバーが集まっているのか？
            <br />
            Digitartを支える「人」にフォーカスします。
          </motion.p>
        </div>
      </section>

      {/* Member Profiles */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl text-gray-900 md:text-4xl" style={{ fontWeight: 700 }}>
              第7期役員
            </h2>
          </div>
          {MEMBERS.map((member: any, i) => {
            const resolvedImage =
              member.image == null
                ? null
                : typeof member.image === "string"
                  ? member.image
                  : (member.image?.src ?? String(member.image));

            return (
              <motion.div
                key={`${member.name ?? "member"}-${i}`}
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
                    className="h-48 w-48 overflow-hidden rounded-full border-4 border-emerald-100 shadow-xl md:h-64 md:w-64"
                  >
                    {resolvedImage ? (
                      <ImageWithFallback
                        src={resolvedImage}
                        alt={member.name ?? member.role ?? "Supporter"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                        <span className="text-sm">画像なし</span>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <span className="text-sm text-emerald-500" style={{ fontWeight: 600 }}>
                    {member.year}
                  </span>
                  <h3 className="mt-1 mb-1 text-3xl text-gray-900" style={{ fontWeight: 700 }}>
                    {member.name}
                  </h3>
                  <p className="mb-6 text-emerald-600" style={{ fontWeight: 500 }}>
                    {member.role}
                  </p>
                  <div className="relative rounded-2xl bg-emerald-50 p-6">
                    <Quote className="absolute top-4 left-4 h-8 w-8 text-emerald-300" />
                    <p className="pt-2 pl-8 leading-relaxed text-gray-700 italic">{member.quote}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Q&A Section */}
      <section className="bg-emerald-50/60 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl text-gray-900" style={{ fontWeight: 700 }}>
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
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex items-start gap-4">
                  <span className="text-2xl text-emerald-500" style={{ fontWeight: 700 }}>
                    Q.{String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-xl text-gray-900" style={{ fontWeight: 600 }}>
                    {item.q}
                  </h4>
                </div>
                <p className="ml-14 leading-relaxed text-gray-600">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <JoinUs />
    </div>
  );
}
