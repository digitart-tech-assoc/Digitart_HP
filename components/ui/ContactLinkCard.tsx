import type { ReactNode } from "react";

/**
 * カードの色。Tailwind はクラス名を文字列のまま探すので、色ごとにクラスを書き切っておく。
 * アイコンの丸は最初から色を付ける（ホバーで色が付く表現だとスマホではリンクだと気づきにくいため）
 */
const TONES = {
  brand: {
    icon: "bg-brand",
    card: "hover:border-brand/30",
    label: "group-hover:text-brand-strong",
  },
  x: {
    icon: "bg-black",
    card: "hover:border-black/30",
    label: "group-hover:text-black",
  },
  instagram: {
    icon: "bg-instagram",
    card: "hover:border-instagram/30",
    label: "group-hover:text-instagram",
  },
} as const;

type ContactLinkCardProps = {
  href: string;
  label: string;
  /** ラベルの下に添える補足（SNS のアカウント名など） */
  sub?: string;
  /** 丸の中に表示するアイコン（白で表示される） */
  icon: ReactNode;
  tone: keyof typeof TONES;
};

/** SNS やお問い合わせフォームなど、外部の連絡先へのアイコン付きリンク */
export function ContactLinkCard({ href, label, sub, icon, tone }: ContactLinkCardProps) {
  const t = TONES[tone];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md ${t.card}`}
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white transition-transform group-hover:scale-105 ${t.icon}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className={`block text-lg font-bold text-slate-800 transition-colors ${t.label}`}>
          {label}
        </span>
        {sub && <span className="block text-sm font-medium text-slate-500">{sub}</span>}
      </span>
    </a>
  );
}
