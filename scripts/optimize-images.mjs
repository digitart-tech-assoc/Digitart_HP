/**
 * public/images の JPEG・PNG を縮小して WebP に変換し、リポジトリ内の参照を書き換える。
 *
 *   node scripts/optimize-images.mjs          # 変換結果の見込みを表示するだけ（ファイルは変更しない）
 *   node scripts/optimize-images.mjs --write  # 変換して元の画像を削除し、参照を書き換える
 *
 * - 長辺 2000px までに縮小し、WebP にする（写真の JPEG は品質 80、文字を含むことが多い PNG は 90）。元より小さくならない画像はそのまま残す
 * - 記事の frontmatter の image（OGP 画像に使う）と OGP 用の画像は、WebP に対応していない SNS があるため変換しない
 * - 参照の書き換えは content/・app/・features/・components/・lib/ のテキストファイルが対象
 */
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const WRITE = process.argv.includes("--write");
const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "public/images");
const MAX_DIMENSION = 2000;
const QUALITY = { jpeg: 80, png: 90 };
const SOURCE_DIRS = ["content", "app", "features", "components", "lib"];
const TEXT_EXTENSIONS = new Set([".md", ".json", ".ts", ".tsx", ".css"]);

function walk(dir, filter) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full, filter);
    return filter(full) ? [full] : [];
  });
}

/** public/ を除いた URL のパス（/images/...） */
const toUrlPath = (file) =>
  "/" + path.relative(path.join(ROOT, "public"), file).replaceAll("\\", "/");

/** 変換しない画像：OGP 用の画像と、記事の frontmatter の image */
function collectExcluded() {
  const excluded = new Set(["/images/digitart_OGP.jpg"]);
  for (const file of walk(path.join(ROOT, "content/news"), (f) => f.endsWith(".md"))) {
    const match = fs.readFileSync(file, "utf8").match(/^image:\s*"?([^"\n]+)"?\s*$/m);
    if (match) excluded.add(match[1].trim());
  }
  return excluded;
}

const excluded = collectExcluded();
const images = walk(IMAGES_DIR, (f) => /\.(jpe?g|png)$/i.test(f));
const renamed = new Map();
let before = 0;
let after = 0;

for (const file of images) {
  const urlPath = toUrlPath(file);
  const target = file.replace(/\.(jpe?g|png)$/i, ".webp");
  if (excluded.has(urlPath) || fs.existsSync(target)) continue;

  const original = fs.statSync(file).size;
  const webp = await sharp(file)
    .rotate() // EXIF の向きを反映する
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: /\.png$/i.test(file) ? QUALITY.png : QUALITY.jpeg })
    .toBuffer();
  if (webp.length >= original) continue;

  before += original;
  after += webp.length;
  renamed.set(urlPath, toUrlPath(target));
  console.log(
    `${urlPath}  ${(original / 1024).toFixed(0)}KB -> ${(webp.length / 1024).toFixed(0)}KB`,
  );
  if (WRITE) {
    fs.writeFileSync(target, webp);
    fs.unlinkSync(file);
  }
}

console.log(
  `\n${renamed.size} 枚: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB`,
);

if (WRITE && renamed.size > 0) {
  const sources = SOURCE_DIRS.flatMap((dir) =>
    fs.existsSync(dir)
      ? walk(path.join(ROOT, dir), (f) => TEXT_EXTENSIONS.has(path.extname(f)))
      : [],
  );
  for (const file of sources) {
    const text = fs.readFileSync(file, "utf8");
    let updated = text;
    for (const [from, to] of renamed) updated = updated.replaceAll(from, to);
    if (updated !== text) {
      fs.writeFileSync(file, updated);
      console.log(`参照を更新: ${path.relative(ROOT, file)}`);
    }
  }
} else if (!WRITE) {
  console.log("--write を付けると、変換と参照の書き換えを行います。");
}
