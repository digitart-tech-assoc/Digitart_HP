"use client";

import { motion } from "motion/react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  ExternalLink,
  Laptop,
} from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import JoinUs from "@/components/about/JoinUs";

import WelcomeEvent_img from "../assets/events/welcome-event.jpg";
import WelcomeLecture_img from "../assets/events/welcome-lecture.jpg";
import WakabaStudy_img from "../assets/events/wakaba-study.jpg";
import BBQ_img from "../assets/events/bbq.jpg";
import WakabaCreate_img from "../assets/events/wakaba-create.jpg";
import SummerLecture_img from "../assets/events/summer-lecture.jpg";
import SummerCamp_img from "../assets/events/summer-camp.jpg";
import SagamiharaFes_img from "../assets/events/sagamihara-fes.jpg";
import AoyamaFes_img from "../assets/events/aoyama-fes.jpg";
import Hackathon_img from "../assets/events/hackathon.jpg";
import LT_img from "../assets/events/lt.jpg";
import Graduation_img from "../assets/events/graduation.jpg";

const ANNUAL_EVENTS = [
  {
    month: "4月",
    season: "1st Semester",
    title: "新歓イベント",
    desc: "新入生を歓迎し、Digitartの活動内容を紹介する最初のイベント。ゲーム大会や交流会を通じて、同級生や先輩メンバーと仲良くなれる機会です。",
    image: WelcomeEvent_img,
    tagColor: "bg-green-100 text-green-700",
    url: null,
  },
  {
    month: "4-5月",
    season: "1st Semester",
    title: "新入生向け講座",
    desc: "プログラミングやチーム開発の基礎を学ぶ新入生向けの集中講座。数週間にわたり、実際に手を動かしながら学べる内容で、初心者が安心して参加できるようサポート体制も充実させています。",
    image: WelcomeLecture_img,
    tagColor: "bg-green-100 text-green-700",
    url: null,
  },
  {
    month: "6月",
    season: "1st Semester",
    title: "BBQ",
    desc: "新入生歓迎と親睦を兼ねたBBQイベント。メンバー同士の交流を深める絶好の機会となっています。食事を楽しみながら、サークル活動や趣味の話で盛り上がります。",
    image: BBQ_img,
    tagColor: "bg-green-100 text-green-700",
    url: null,
  },
  {
    month: "6-7月",
    season: "1st Semester",
    title: "わかば創作会",
    desc: "学習会で得たスキルを活かして、実際に作品を作ることに挑戦するイベント。チームで協力して作品を制作します。完成した作品は学園祭やオンラインで発表します。",
    image: WakabaCreate_img,
    color: "from-green-300 to-lime-300",
    tagColor: "bg-green-100 text-green-700",
    url: null,
  },
  {
    month: "8-9月",
    season: "Summer Vacation",
    title: "夏季輪講",
    desc: "メンバーが持ち寄りで趣味や専門知識を紹介する輪講イベント。テーマはAI、Web開発、ゲームなど多岐にわたり、オンラインで開催されるため家から気軽に参加できます。",
    image: SummerLecture_img,
    tagColor: "bg-sky-100 text-sky-700",
    url: null,
  },
  {
    month: "9月",
    season: "Summer Vacation",
    title: "夏合宿",
    desc: "サークル最大のイベントの一つ。数日間の合宿を通じて、メンバー同士の親睦を深めます。過去には伊豆半島で開催し、リフレッシュしながら交流を行いました。",
    image: SummerCamp_img,
    tagColor: "bg-sky-100 text-sky-700",
    url: null,
  },
  {
    month: "10月",
    season: "2nd Semester",
    title: "学園祭出展(相模原祭)",
    desc: "大学の学園祭「相模原祭」での展示イベント。メンバーが制作した作品を展示し、来場者に体験してもらいます。過去にはVRゲームやオリジナルゲームなどを出展し、好評を博しました。",
    image: SagamiharaFes_img,
    tagColor: "bg-amber-100 text-amber-700",
    url: null,
  },
  {
    month: "11月",
    season: "2nd Semester",
    title: "学園祭出展(青山祭)",
    desc: "大学の学園祭「青山祭」での展示イベント。相模原祭で展示した作品をさらにブラッシュアップして出展することが多いです。来場者からのフィードバックを得る貴重な機会となっています。",
    image: AoyamaFes_img,
    tagColor: "bg-amber-100 text-amber-700",
    url: null,
  },
  {
    month: "11-12月",
    season: "2nd Semester",
    title: "ハッカソン",
    desc: "テーマを決めて、1ヶ月で作品を作るハッカソンイベント。個人参加もチーム参加も歓迎。過去には「circle」をテーマにしたハッカソンを開催し、斬新なアイデアが多数生まれました。",
    image: Hackathon_img,
    tagColor: "bg-amber-100 text-amber-700",
    url: null,
  },
  {
    month: "1月",
    season: "2nd Semester",
    title: "LT会",
    desc: "ライトニングトーク形式で、メンバーが自由なテーマで5分間のプレゼンを行う年末恒例イベント。技術ネタからポエム、趣味の話まで何でもOK。",
    image: LT_img,
    tagColor: "bg-amber-100 text-amber-700",
    url: null,
  },
  {
    month: "2月",
    season: "Spring Vacation",
    title: "追い出し会",
    desc: "年度末の総まとめ。1年間の活動成果を振り返り、卒業するメンバーを送り出す感謝のイベント。",
    image: Graduation_img,
    tagColor: "bg-pink-100 text-pink-700",
    url: null,
  },
];

const REGULAR_ACTIVITIES = [
  {
    label: "対面活動",
    detail: "毎週月曜･木曜 18:45-21:00",
    icon: CalendarDays,
  },
  {
    label: "活動場所",
    detail: "相模原キャンパスF棟 + オンライン",
    icon: MapPin,
  },
  {
    label: "オンライン(Discord)",
    detail: "24時間いつでも活動中！",
    icon: Laptop,
  },
];

/** Parse a month field like "4月", "5-7月", "12月, 1月" into an array of month numbers */
function parseMonths(month: string): number[] {
  const nums: number[] = [];
  // Handle comma-separated parts first (e.g. "12月, 1月")
  for (const part of month.split(/[,、]/)) {
    const rangeMatch = part.match(/(\d+)\s*[-~〜]\s*(\d+)/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start <= end) {
        for (let i = start; i <= end; i++) nums.push(i);
      } else {
        // Wrap around year boundary (e.g. 12-2)
        for (let i = start; i <= 12; i++) nums.push(i);
        for (let i = 1; i <= end; i++) nums.push(i);
      }
    } else {
      const single = part.match(/(\d+)/);
      if (single) nums.push(parseInt(single[1], 10));
    }
  }
  return nums;
}

// Precompute counts per month (1-12) from ANNUAL_EVENTS
const MONTH_COUNTS: Record<string, number> = (() => {
  const counts: Record<string, number> = {};
  for (let i = 1; i <= 12; i++) counts[String(i)] = 0;
  for (const e of ANNUAL_EVENTS) {
    for (const m of parseMonths(e.month)) {
      const key = String(m);
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return counts;
})();

// Map event counts to Tailwind background classes (more events -> darker green)
function monthBgClass(count: number) {
  if (count <= 0) return "bg-gray-100";
  if (count === 1) return "bg-emerald-200";
  if (count === 2) return "bg-emerald-400";
  if (count === 3) return "bg-emerald-600";
  return "bg-emerald-800"; // 4 or more
}

// Map event counts to text color for month label
function monthTextClass(count: number) {
  if (count <= 0) return "text-gray-400";
  if (count === 1) return "text-emerald-600";
  if (count === 2) return "text-emerald-700";
  return "text-emerald-900";
}

export default function EventsPage() {

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] " />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
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
            Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90"
          >
            年間スケジュール
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
            Digitartでは年間を通じてさまざまなイベントを開催しています。
            <br />
            ハッカソンから学園祭出展、LT大会まで、
            <br className="hidden md:block" />
            テクノロジーを楽しむ機会が盛りだくさんです。
          </motion.p>
        </div>
      </section>

      {/* Annual Timeline Visual */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-12"
          >
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <h2
              className="text-3xl md:text-4xl text-gray-900"
              style={{ fontWeight: 700 }}
            >
              Annual Schedule
            </h2>
          </motion.div>

          {/* Month Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex items-center gap-1 mb-16 px-4"
          >
            {["4","5","6","7","8","9","10","11","12","1","2","3"].map((m) => {
              const count = MONTH_COUNTS[String(parseInt(m, 10))] || 0;
              const barClass = monthBgClass(count);
              const textClass = monthTextClass(count);
              return (
                <div key={m} className="flex-1 text-center">
                  <div className={`h-2 rounded-full mx-0.5 ${barClass}`} />
                  <span className={`text-xs mt-2 block ${textClass}`} style={count > 0 ? { fontWeight: 600 } : {}}>
                    {m}月
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Event Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {ANNUAL_EVENTS.map((event, i) => (
            <motion.div
              key={`${event.month}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="group"
            >
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                {/* Collapsed View */}
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-72 lg:w-80 flex-shrink-0 relative overflow-hidden">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* removed color overlay to keep original image colors */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                      <span
                        className="text-2xl text-gray-900"
                        style={{ fontWeight: 700 }}
                      >
                        {event.month}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs mb-3 ${event.tagColor}`}
                          style={{ fontWeight: 600 }}
                        >
                          {event.season}
                        </span>
                        <h3
                          className="text-xl md:text-2xl text-gray-900 mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {event.desc}
                        </p>
                        {event.url && event.url !== "null" && (
                          <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors mt-3"
                            style={{ fontWeight: 600 }}
                          >
                            過去のレポート
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Regular Activities */}
      <section className="py-20 px-6 bg-emerald-50/60">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl text-gray-900 mb-4"
              style={{ fontWeight: 700 }}
            >
              定例活動
            </h2>
            <p className="text-gray-600">
              イベント以外にも、日常的に活動しています。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {REGULAR_ACTIVITIES.map((act, i) => (
              <motion.div
                key={act.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <act.icon className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                <h4
                  className="text-lg text-gray-900 mb-2"
                  style={{ fontWeight: 700 }}
                >
                  {act.label}
                </h4>
                <p className="text-sm text-gray-500">{act.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <JoinUs />
    </div>
  );
}
