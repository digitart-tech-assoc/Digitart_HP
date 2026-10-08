import sagamiharaFes2026Data from "@/content/sagamihara-fes-2026.json";
import { festivalSchema } from "@/features/festival/schema";

/** 相模原祭 2026 のポータルに表示する情報。内容の更新は content/sagamihara-fes-2026.json で行う */
export const SAGAMIHARA_FES_2026 = festivalSchema.parse(sagamiharaFes2026Data);

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** "2026-10-10" → { monthDay: "10/10", weekday: "土" } */
export function formatFestivalDate(date: string) {
  const [, month, day] = date.split("-").map(Number);
  // タイムゾーンの影響を受けないよう UTC で曜日を求める
  const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  return { monthDay: `${month}/${day}`, weekday };
}
