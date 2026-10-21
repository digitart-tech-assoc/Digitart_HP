/**
 * カードの内側の余白。
 * - none: 画像を端まで敷くカードなど、余白を中で付けるとき
 * - sm: 一覧の 1 件・連絡先など、小さなカード
 * - md: Q&A・定例活動など、文章を中心にしたカード
 * - lg: 記事の本文など、大きなカード
 */
export type CardPadding = "none" | "sm" | "md" | "lg";

const BASE = "rounded-2xl border border-slate-100 bg-white shadow-sm";

const PADDINGS: Record<CardPadding, string> = {
  none: "",
  sm: "p-4 md:p-5",
  md: "p-6 md:p-8",
  lg: "p-6 md:p-10",
};

/** リンクになっているカード。ホバーで少し浮き上がる */
const INTERACTIVE = "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

type CardStyleOptions = {
  padding?: CardPadding;
  /** カード全体がリンク・ボタンになっているとき true */
  interactive?: boolean;
  /**
   * レイアウト・文字の配置など、追加のクラス。
   * 角丸・枠線・背景・影・余白は上書きしないこと（クラスの優先順位が保証されないため）。
   */
  className?: string;
};

/** カードのクラス名。<a> や <Link> など、Card を使えない要素に付ける */
export function cardClassName({
  padding = "md",
  interactive = false,
  className = "",
}: CardStyleOptions = {}): string {
  return [BASE, PADDINGS[padding], interactive ? INTERACTIVE : "", className]
    .filter(Boolean)
    .join(" ");
}

type CardProps = CardStyleOptions & {
  /** 出力する要素。記事の本文なら article など */
  as?: "div" | "article" | "section" | "li";
  children: React.ReactNode;
};

/** 白い面のカード。角丸・枠線・影をそろえる */
export function Card({ as: Tag = "div", padding, interactive, className, children }: CardProps) {
  return <Tag className={cardClassName({ padding, interactive, className })}>{children}</Tag>;
}
