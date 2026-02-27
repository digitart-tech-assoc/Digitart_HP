/** サイト全体で共有する定数 */

export const SITE_NAME = "Digitart";
export const SITE_DESCRIPTION = "Digitart テクノロジー愛好会 公式ホームページ";
export const SITE_URL = "https://digitart.dev"; // 本番URLに差し替え

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
export const NAV_LINKS: readonly {
  href: string;
  label: string;
  accent?: boolean;
}[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/join", label: "Join Us", accent: true },
];
