import Image from "next/image";

/** ロゴの正本。ロゴを差し替えるときは、このファイルだけを置き換える */
const LOGO_SRC = "/images/digitart_white_normal.svg";

type LogoProps = {
  /** 表示サイズ（px）。正方形のロゴなので幅と高さに同じ値を使う */
  size: number;
  /** 代替テキスト。装飾として使うときは空文字のままにする */
  alt?: string;
  className?: string;
};

/**
 * サークルのロゴ。
 * SVG はベクターのままブラウザが描画するため、画像の最適化（unoptimized）は使わない。
 */
export function Logo({ size, alt = "", className }: LogoProps) {
  return (
    <Image src={LOGO_SRC} alt={alt} width={size} height={size} className={className} unoptimized />
  );
}
