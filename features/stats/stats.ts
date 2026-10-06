import "server-only";

import statsData from "@/content/stats.json";
import { statsContentSchema } from "@/features/stats/schema";
import { parseContent } from "@/lib/content";

/** 活動データ（content/stats.json） */
export function getStats() {
  return parseContent("content/stats.json", statsContentSchema, statsData);
}
