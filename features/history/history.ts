import "server-only";

import historyData from "@/content/history.json";
import { timelineSchema } from "@/features/history/schema";
import { parseContent } from "@/lib/content";

/** 団体の歩み（content/history.json） */
export function getTimeline() {
  return parseContent("content/history.json", timelineSchema, historyData, (items) =>
    items.map((item) => item.image),
  );
}
