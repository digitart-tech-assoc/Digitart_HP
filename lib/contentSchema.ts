import { z } from "zod";

/**
 * サイト内の画像のパス（public/ を除いた /images/... の形式）。
 * 実在するかどうかは lib/content.ts の parseContent で確認する。
 */
export const imagePathSchema = z
  .string()
  .regex(/^\/images\/[\w./-]+$/, "画像は /images/... の形式で指定してください")
  // public/ の外のファイルを指せないようにする
  .refine((value) => !value.includes(".."), "画像のパスに .. は使えません");

/** 空でない文字列（前後の空白は取り除く） */
export const requiredText = z.string().trim().min(1);

/** 外部の URL。ないときは null（省略しても null になる） */
export const optionalUrl = z.url().nullable().default(null);
