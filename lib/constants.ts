/** サイト全体で共有する定数 */

export const SITE_NAME = "Digitart";
export const SITE_DESCRIPTION = "Digitart テクノロジー愛好会 公式ホームページ";
export const SITE_URL = "https://www.digitart.jp";

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
  accent?: boolean;
  children?: NavItem[]; // 階層を持たせる
};

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about/history", label: "History" },
      { href: "/about/data", label: "Data" },
      { href: "/about/events", label: "Events" },
      { href: "/about/works", label: "Works" },
      { href: "/about/supporter", label: "Supporter" },
    ],
  },
  { href: "/news", label: "News" },
  { href: "/join", label: "Join Us" },
  { href: "/bylaws", label: "Bylaws" },
];
