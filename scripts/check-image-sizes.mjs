/**
 * PR で追加・変更された public/ の画像のうち、大きすぎるものを GitHub Actions の警告として表示する。
 * CI を失敗させはしない（記事の画像など、どうしても大きくなるものがあるため）。
 *
 *   node scripts/check-image-sizes.mjs <比較元のブランチ>   # 例: origin/main
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const LIMIT_KB = 500;
const base = process.argv[2];
if (!base) {
  console.error("比較元のブランチを指定してください（例: origin/main）");
  process.exit(1);
}

const changed = execFileSync(
  "git",
  ["diff", "--name-only", "--diff-filter=AM", `${base}...HEAD`, "--", "public/"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter((file) => /\.(jpe?g|png|gif|webp|avif)$/i.test(file) && fs.existsSync(file));

const large = changed
  .map((file) => ({ file, kb: Math.round(fs.statSync(file).size / 1024) }))
  .filter(({ kb }) => kb > LIMIT_KB);

for (const { file, kb } of large) {
  const hint = /\.(jpe?g|png)$/i.test(file)
    ? "node scripts/optimize-images.mjs --write で縮小・WebP 化できます"
    : "画像の大きさ（px）を小さくするか、画質を下げて保存し直してください";
  console.log(
    `::warning file=${file}::画像が ${kb}KB あります（目安は ${LIMIT_KB}KB 以下）。${hint}`,
  );
}
console.log(`確認した画像: ${changed.length} 枚 / ${LIMIT_KB}KB を超える画像: ${large.length} 枚`);
