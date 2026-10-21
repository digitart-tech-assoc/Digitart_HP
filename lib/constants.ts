/** サイト全体で共有する定数 */

export const SITE_NAME = "Digitart テクノロジー愛好会";
export const SITE_DESCRIPTION =
  "青山学院大学（青学）公認の技術系サークル Digitart テクノロジー愛好会。Webアプリ開発とゲーム開発を中心に、AI（生成AI・機械学習）やデザインにも、未経験から取り組めます。";
export const SITE_URL = "https://www.digitart.jp";

/**
 * 団体の別名（略称・旧称など）。構造化データの alternateName に使い、検索エンジンや AI がどの名前でも同じ団体だと分かるようにする。
 * SNS のアカウント名（PiedPiper_AGU など）は旧称に由来するため、旧称も必ず入れておく
 */
export const SITE_ALTERNATE_NAMES = [
  "Digitart",
  "Digitartテクノロジー愛好会",
  "デジタルト テクノロジー愛好会",
  "PiedPiper青山テック愛好会",
];

/** 構造化データで団体を指す ID。ページごとの構造化データからは、この ID で団体を参照する */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** 所属する大学（構造化データの parentOrganization に使う） */
export const UNIVERSITY = {
  name: "青山学院大学",
  url: "https://www.aoyama.ac.jp/",
  sameAs: ["https://www.wikidata.org/wiki/Q616359", "https://ja.wikipedia.org/wiki/青山学院大学"],
} as const;

/** SNS / 連絡先 */
export const SOCIAL_LINKS = {
  twitter: {
    label: "X (Twitter)",
    url: "https://x.com/PiedPiper_AGU",
    handle: "@PiedPiper_AGU",
  },
  instagram: {
    label: "Instagram",
    url: "https://www.instagram.com/piedpiper_aoyama",
    handle: "@piedpiper_aoyama",
  },
  email: {
    label: "メールアドレス",
    address: "aoyama.tech.exe@gmail.com",
  },
} as const;

/** ナビゲーションリンク */
export type NavItem = {
  href: string;
  label: string;
  children?: NavItem[];
};

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about/events", label: "Events" },
      { href: "/about/works", label: "Works" },
      { href: "/about/history", label: "History" },
      { href: "/about/data", label: "Data" },
      { href: "/about/supporter", label: "Supporter" },
    ],
  },
  { href: "/news", label: "News" },
  { href: "/join", label: "Join Us" },
  { href: "/bylaws", label: "Bylaws" },
  { href: "https://auth.digitart.jp/contact", label: "Contact" },
];

/**
 * 相模原祭のページのパス。ナビゲーションには載せていないため、サイトマップ・パンくずリスト・トップページのリンクはここから参照する。
 * 年が変わったら、next.config.ts の /sagamihara-fes のリダイレクト先も更新する
 */
export const SAGAMIHARA_FES_2026_PATH = "/sagamihara-fes/2026";

/** NAV_LINKS のうちサイト内のページを、子ページも含めて平らに並べて返す（外部サイトへのリンクは除く） */
export function getInternalNavLinks(items: NavItem[] = NAV_LINKS): NavItem[] {
  return items.flatMap((item) => [
    ...(item.href.startsWith("/") ? [item] : []),
    ...(item.children ? getInternalNavLinks(item.children) : []),
  ]);
}
