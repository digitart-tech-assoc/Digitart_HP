import { z } from "zod";

import { imagePathSchema, requiredText } from "@/lib/contentSchema";

/** content/history.json の 1 件分（期ごとの出来事） */
export const timelineItemSchema = z.object({
  /** 例: "第1期(2019-2020)" */
  year: requiredText,
  title: requiredText,
  desc: requiredText,
  image: imagePathSchema,
});

export const timelineSchema = z.array(timelineItemSchema);

export type TimelineItem = z.infer<typeof timelineItemSchema>;
