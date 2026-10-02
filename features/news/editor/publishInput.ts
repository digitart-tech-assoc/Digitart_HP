import { z } from "zod";

import { filterReferencedImages } from "@/features/news/editor/articleFile";
import type { ArticleFields, PendingImage } from "@/features/news/editor/types";
import { articleFrontmatterSchema } from "@/features/news/schema";
import { ARTICLE_IMAGES_DIR } from "@/lib/contentPaths";

/** 画像 1 枚あたりの上限（デコード後のバイト数）: 10MB */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** 1 記事に含められる画像の枚数 */
const MAX_IMAGES = 30;

/** 本文の最大文字数 */
const MAX_CONTENT_LENGTH = 200_000;

const REQUIRED_MESSAGE = "必須項目が入力されていません。";

/** 実在する日付の YYYY-MM-DD か（2026-02-30 などを弾く） */
function isRealDate(value: string): boolean {
  const time = Date.parse(`${value}T00:00:00Z`);
  return !Number.isNaN(time) && new Date(time).toISOString().startsWith(value);
}

const dateSchema = z
  .string()
  .min(1, REQUIRED_MESSAGE)
  .regex(/^\d{4}-\d{2}-\d{2}$/, "公開日の形式が正しくありません。")
  .refine(isRealDate, "公開日の形式が正しくありません。");

const articleFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, REQUIRED_MESSAGE)
    .max(200, "タイトルが長すぎます（200 文字まで）。"),
  author: z
    .string()
    .trim()
    .min(1, REQUIRED_MESSAGE)
    .max(100, "著者名が長すぎます（100 文字まで）。"),
  date: dateSchema,
  slug: z
    .string()
    .min(1, REQUIRED_MESSAGE)
    .max(100, "ファイル名が長すぎます（100 文字まで）。")
    .regex(/^[a-z0-9-]+$/, "ファイル名は半角英小文字、数字、ハイフンのみ使用可能です。"),
  category: z.string().min(1, REQUIRED_MESSAGE).pipe(articleFrontmatterSchema.shape.category),
  excerpt: z.string().max(500, "概要が長すぎます（500 文字まで）。"),
});

/**
 * 画像の保存先。public/images/articles/<YYYY-MM-DD>/<ファイル名> の形だけを許す。
 * 記事作成中に公開日を変えても既に挿入した画像を使えるよう、日付は記事の公開日と一致しなくてよい。
 * ファイル名にスラッシュは含められないため、ディレクトリの外には出られない。
 */
const IMAGE_PATH_PATTERN = new RegExp(
  `^${ARTICLE_IMAGES_DIR}/\\d{4}-\\d{2}-\\d{2}/[A-Za-z0-9_-][A-Za-z0-9._-]*$`,
);

/**
 * 保存できる画像の拡張子。
 * 公開時の Content-Type は拡張子で決まるため、.html や .svg（スクリプトを含められる）は中身が画像でも受け付けない。
 */
const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g|gif|webp|avif)$/i;

const UNSUPPORTED_FORMAT_MESSAGE = (path: string) =>
  `画像「${path.split("/").pop()}」の形式には対応していません（PNG・JPEG・GIF・WebP・AVIF のみ）。`;

const pendingImageSchema = z.object({
  path: z.string().max(300).regex(IMAGE_PATH_PATTERN, "画像の保存先が正しくありません。"),
  content: z
    .string()
    .min(1)
    // base64 は 4 文字で 3 バイトになる
    .max(Math.ceil(MAX_IMAGE_BYTES / 3) * 4, "画像が大きすぎます（1 枚 10MB まで）。")
    .regex(/^[A-Za-z0-9+/]+={0,2}$/, "画像データが正しくありません。"),
});

/** 本文で使われているかを判定する前の、形だけの確認 */
const submittedImagesSchema = z.array(z.object({ path: z.string(), content: z.string() }));

const imagesSchema = z
  .array(pendingImageSchema)
  .max(MAX_IMAGES, `画像は ${MAX_IMAGES} 枚までです。`);

/** 先頭のバイト列から、対応している画像形式かどうかを判定する */
export function isSupportedImageContent(base64: string): boolean {
  // 先頭 24 文字（18 バイト）あれば判定に足りる
  let binary: string;
  try {
    binary = atob(base64.slice(0, 24));
  } catch {
    // 長さが 4 の倍数でないなど、base64 として壊れている
    return false;
  }
  const bytes = Array.from(binary, (c) => c.charCodeAt(0));
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const startsWith = (signature: number[]) => signature.every((b, i) => bytes[i] === b);

  return (
    startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) || // PNG
    startsWith([0xff, 0xd8, 0xff]) || // JPEG
    ascii(0, 6) === "GIF87a" ||
    ascii(0, 6) === "GIF89a" ||
    (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") ||
    (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12)))
  );
}

export type PublishInput = {
  fields: ArticleFields;
  content: string;
  images: PendingImage[];
};

export type ParsePublishInputResult =
  { ok: true; value: PublishInput } | { ok: false; error: string };

/**
 * 記事投稿フォームの値を検証する。
 * 値はリポジトリへのコミット（ファイルパス・ブランチ名・frontmatter）に使われるため、
 * クライアント側の入力チェックに頼らず、ここで形式をすべて確認する。
 * 返す画像は、本文で参照されているものだけ。
 */
export function parsePublishInput(raw: {
  fields: Record<keyof ArticleFields, string>;
  content: string;
  imagesJson: string;
}): ParsePublishInputResult {
  const fields = articleFieldsSchema.safeParse(raw.fields);
  if (!fields.success) {
    return { ok: false, error: fields.error.issues[0].message };
  }

  if (!raw.content.trim()) {
    return { ok: false, error: REQUIRED_MESSAGE };
  }
  if (raw.content.length > MAX_CONTENT_LENGTH) {
    return { ok: false, error: "本文が長すぎます。" };
  }

  let imagesValue: unknown = [];
  if (raw.imagesJson) {
    try {
      imagesValue = JSON.parse(raw.imagesJson);
    } catch {
      return { ok: false, error: "画像データが正しくありません。" };
    }
  }

  const submittedImages = submittedImagesSchema.safeParse(imagesValue);
  if (!submittedImages.success) {
    return { ok: false, error: "画像データが正しくありません。" };
  }

  // エディタは本文から削除した画像も送ってくるため、先に本文で使われている画像だけに絞る。
  // 絞る前に検証すると、削除済みの未対応形式の画像のせいで投稿できなくなる
  const images = imagesSchema.safeParse(filterReferencedImages(submittedImages.data, raw.content));
  if (!images.success) {
    return { ok: false, error: images.error.issues[0].message };
  }

  for (const image of images.data) {
    if (!IMAGE_EXTENSION_PATTERN.test(image.path) || !isSupportedImageContent(image.content)) {
      return { ok: false, error: UNSUPPORTED_FORMAT_MESSAGE(image.path) };
    }
  }

  return {
    ok: true,
    value: { fields: fields.data, content: raw.content, images: images.data },
  };
}
