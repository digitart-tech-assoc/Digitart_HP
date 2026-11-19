import { z } from "zod";

import { requiredText } from "@/lib/contentSchema";

/** content/stats.json の形式（活動データ） */
export const statsContentSchema = z.object({
  /** 数字で見る Digitart（カウントアップ表示する数値） */
  stats: z.array(
    z.object({
      label: requiredText,
      value: z.number().nonnegative(),
      /** 数値の後ろに付ける単位（例: "名"） */
      suffix: z.string(),
      /** 集計した時点などの注記 */
      note: z.string(),
    }),
  ),
  /** 所属学部・学年などの内訳（%）。棒グラフで表示する */
  breakdowns: z.array(
    z.object({
      title: requiredText,
      items: z.array(z.object({ label: requiredText, pct: z.number().min(0).max(100) })),
    }),
  ),
});

export type StatsContent = z.infer<typeof statsContentSchema>;
