import "server-only";

import supportersData from "@/content/supporters.json";
import { supportersContentSchema } from "@/features/supporters/schema";
import { parseContent } from "@/lib/content";

/** 役員紹介とよくある質問（content/supporters.json） */
export function getSupporters() {
  return parseContent(
    "content/supporters.json",
    supportersContentSchema,
    supportersData,
    ({ members }) => members.map((m) => m.image),
  );
}
