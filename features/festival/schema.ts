import { z } from "zod";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date は YYYY-MM-DD 形式で書いてください");
const timeString = z.string().regex(/^\d{1,2}:\d{2}$/, "時刻は H:MM 形式で書いてください");
/** public/ 配下の画像（/images/... の形式） */
const imagePath = z.string().startsWith("/images/");

/** 出展作品のカテゴリ。タブはこの順で並ぶ */
export const FESTIVAL_WORK_CATEGORIES = ["Game", "Web app", "Hardware", "etc."] as const;

/** 出展作品 */
export const festivalWorkSchema = z.object({
  title: z.string().trim().min(1),
  desc: z.string().trim().min(1),
  /** 一覧の絞り込みタブにも使う */
  category: z.enum(FESTIVAL_WORK_CATEGORIES),
  creators: z.array(z.string()).default([]),
  tech: z.array(z.string()).default([]),
  /** 未用意の場合は null（カテゴリ名入りのプレースホルダーを表示する） */
  image: imagePath.nullable(),
  /** 作品の公開ページ（unityroom など）。ない場合は null（リンクを表示しない） */
  url: z.url().nullable().default(null),
  /** 会場で実際に遊べる・触れる作品か */
  playable: z.boolean().default(false),
});

/**
 * 学園祭ポータルのデータ（content/<祭名>-<年>.json）の形式。
 * 形式が間違っているとビルド時にエラーになる。
 */
export const festivalSchema = z.object({
  title: z.string().trim().min(1),
  catchphrase: z.string().trim().min(1),
  lead: z.string().trim().min(1),
  days: z.array(z.object({ date: dateString, open: timeString, close: timeString })).min(1),
  venue: z.object({
    campus: z.string(),
    /** 展示場所（建物・教室名など） */
    place: z.string(),
    /** 来場者向けの補足（雨天時の変更など）。不要なら null */
    note: z.string().nullable(),
    address: z.string(),
    /** 構内マップ画像。未用意の場合は null（準備中の表示になる） */
    mapImage: imagePath.nullable(),
    googleMapsUrl: z.url(),
  }),
  works: z.array(festivalWorkSchema),
});

export type Festival = z.infer<typeof festivalSchema>;
export type FestivalWork = z.infer<typeof festivalWorkSchema>;
