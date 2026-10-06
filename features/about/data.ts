import {
  BarChart3,
  Briefcase,
  Calendars,
  Code,
  Gamepad2,
  Heart,
  History,
  Palette,
} from "lucide-react";

/** About 配下の各ページへの案内カード */
export const GUIDE_CARDS = [
  {
    num: "01",
    title: "年間行事",
    subtitle: "Events",
    desc: "作品制作や交流を深める、年間の定例イベントや特別イベントをご紹介します。",
    icon: Calendars,
    to: "/about/events",
    image: "/images/about/events-hero.webp",
    color: "from-lime-700 to-green-950",
  },
  {
    num: "02",
    title: "作品紹介",
    subtitle: "Works",
    desc: "メンバーが生み出した作品の数々をご紹介。",
    icon: Briefcase,
    to: "/about/works",
    image: "/images/about/works-hero.webp",
    color: "from-green-700 to-emerald-950",
  },
  {
    num: "03",
    title: "団体の歩み",
    subtitle: "History",
    desc: "設立からの成長と、団体の挑戦の歴史をご紹介します。",
    icon: History,
    to: "/about/history",
    image: "/images/about/history-hero.webp",
    color: "from-emerald-700 to-teal-950",
  },
  {
    num: "04",
    title: "活動データ",
    subtitle: "Data",
    desc: "メンバー数やプロジェクト数など、数字でDigitartを知る。",
    icon: BarChart3,
    to: "/about/data",
    image: "/images/about/data-hero.webp",
    color: "from-teal-700 to-cyan-950",
  },
  {
    num: "05",
    title: "幹部紹介",
    subtitle: "Supporters",
    desc: "団体を支えるメンバーやサポーターにフォーカス。",
    icon: Heart,
    to: "/about/supporter",
    image: "/images/about/supporters-hero.webp",
    color: "from-lime-700 to-green-950",
  },
];

/** 活動分野の紹介カード */
export const DOMAIN_CARDS = [
  {
    num: "No.01",
    icon: Code,
    title: "プログラミング",
    desc: "Webアプリ開発, AI/機械学習",
    color: "bg-emerald-100",
  },
  {
    num: "No.02",
    icon: Gamepad2,
    title: "ゲーム開発",
    desc: "Unity, Unreal Engineを用いた開発",
    color: "bg-teal-100",
  },
  {
    num: "No.03",
    icon: Palette,
    title: "デザイン",
    desc: "UI/UX, グラフィック, 3Dモデリング",
    color: "bg-cyan-100",
  },
];
