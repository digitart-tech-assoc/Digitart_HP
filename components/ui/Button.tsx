import Link from "next/link";

/**
 * ボタンの見た目の種類。
 * - primary: 最も押してほしい操作（入会するなど）。ブランドカラーの塗り
 * - outline: 白・薄い背景の上の通常の操作。ブランドカラーの枠線
 * - outline-dark: 白・薄い背景の上で、ブランドカラーを使わない操作（詳しく見るなど）
 * - outline-light: 写真や濃い色の背景の上の操作。白の枠線
 * - neutral: 戻るなど、目立たせなくてよい操作
 */
export type ButtonVariant = "primary" | "outline" | "outline-dark" | "outline-light" | "neutral";

export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-[0_0_24px_rgba(140,198,63,0.45)] hover:-translate-y-0.5 hover:bg-brand-hover",
  outline: "border-2 border-brand text-brand-strong hover:bg-brand hover:text-white",
  "outline-dark":
    "border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-900 hover:text-white",
  "outline-light": "border-2 border-white/30 text-white hover:border-white hover:bg-white/10",
  neutral: "border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-100",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base",
  md: "px-7 py-3 text-sm md:px-10 md:py-4 md:text-base",
  lg: "min-w-52 px-8 py-4 text-lg",
};

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * 余白・幅など、追加のクラス。
   * 色・大きさ・display（hidden など）は上書きしないこと（クラスの優先順位が保証されないため）。
   * 画面幅で表示を切り替えたいときは、親要素で切り替える。
   */
  className?: string;
};

/** ボタンのクラス名。<button> や、ButtonLink を使えない要素に付ける */
export function buttonClassName({
  variant = "outline",
  size = "sm",
  className = "",
}: ButtonStyleOptions = {}): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
}

type ButtonLinkProps = ButtonStyleOptions & {
  href: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

/**
 * ボタンの見た目のリンク。
 * http(s) で始まる外部リンクは新しいタブで開き、サイト内のリンクは next/link を使う。
 */
export function ButtonLink({ href, children, variant, size, className, ...rest }: ButtonLinkProps) {
  const classes = buttonClassName({ variant, size, className });
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
