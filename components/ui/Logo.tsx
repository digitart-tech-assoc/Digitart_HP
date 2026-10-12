import Image from "next/image";

/** ロゴの正本。ロゴを差し替えるときは、このファイルだけを置き換える */
export const LOGO_SRC = "/images/digitart_white_normal.svg";

type LogoProps = {
  /** 表示サイズ（px）。正方形のロゴなので幅と高さに同じ値を使う */
  size: number;
  /** 代替テキスト。装飾として使うときは空文字のままにする */
  alt?: string;
  className?: string;
  /** 最初の画面に表示するときに true にする。後回しにせずに読み込み、サーバーで描画される場合は先読みもする */
  preload?: boolean;
};

/**
 * サークルのロゴ。
 * SVG はベクターのままブラウザが描画するため、画像の最適化（unoptimized）は使わない。
 * 画像の読み込みを待てない場面や、大きく拡大する場面では InlineLogo を使う。
 */
export function Logo({ size, alt = "", className, preload = false }: LogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt={alt}
      width={size}
      height={size}
      className={className}
      preload={preload}
      unoptimized
    />
  );
}
