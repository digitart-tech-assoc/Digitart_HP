import "server-only";

import fs from "node:fs";
import path from "node:path";

import { LOGO_SRC } from "@/components/ui/Logo";

// ロゴの正本（public/images の SVG）をビルド時に読み込み、HTML に直接埋め込む
const LOGO_SVG = fs.readFileSync(path.join(process.cwd(), "public", LOGO_SRC), "utf8");

/**
 * サークルのロゴを <svg> として直接描画する（装飾用。読み上げの対象にしない）。
 * 画像の読み込みを待たずに表示でき、どれだけ拡大してもベクターのまま描画される。
 * Server Component なので、Client Component では props（ReactNode）として受け取って使う。
 */
export function InlineLogo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block [&>svg]:size-full ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
    />
  );
}
