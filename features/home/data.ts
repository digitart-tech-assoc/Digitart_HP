/**
 * トップページのヒーローに出す期間限定のお知らせ（学園祭の出展など）。
 * 出さないときは null にする
 */
export const HERO_NOTICE: { href: string; label: string; detail: string } | null = {
  href: "/sagamihara-fes/2026",
  label: "相模原祭 2026 に出展します",
  detail: "10/10(土)・10/11(日) D210教室",
};

/** トップページの「トピックス」に並べるページ */
export const PICKUP_ITEMS = [
  {
    href: "/sagamihara-fes/2026",
    en: "Sagamihara Festival 2026",
    ja: "相模原祭 2026 展示案内",
    desc: "10/10(土)・10/11(日)の相模原祭に出展します。展示場所や作品一覧はこちら。",
    image: "/images/events/sagamihara-fes.jpg",
    imagePosition: "bg-center",
    wide: true,
  },
  {
    href: "/about",
    en: "About",
    ja: "活動内容",
    desc: "プログラミング・ゲーム・デザインを横断するDigitartの活動を紹介します。",
    image: "/images/about/works-hero.jpg",
    imagePosition: "bg-center",
  },
  {
    href: "/about/works",
    en: "Works",
    ja: "制作物",
    desc: "メンバーが生み出した作品・プロジェクトをご覧いただけます。",
    image: "/images/about/history-hero.jpg",
    imagePosition: "bg-center",
  },
  {
    href: "/news",
    en: "News",
    ja: "最新情報",
    desc: "サークルの最新情報やコラムをお届けします。",
    image: "/images/events/sagamihara-fes.jpg",
    imagePosition: "bg-center",
  },
  {
    href: "/join",
    en: "Join Us",
    ja: "入会案内",
    desc: "Digitartへの入会方法や活動日程を確認できます。",
    image: "/images/about/supporters-hero.jpg",
    imagePosition: "bg-center",
  },
];
