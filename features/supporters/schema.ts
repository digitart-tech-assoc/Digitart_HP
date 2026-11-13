import { z } from "zod";

import { imagePathSchema, requiredText } from "@/lib/contentSchema";

/** content/supporters.json の 1 件分（役員の紹介） */
export const memberSchema = z.object({
  name: requiredText,
  role: requiredText,
  /** 学部・学科と学年 */
  year: requiredText,
  quote: requiredText,
  image: imagePathSchema,
});

export const membersSchema = z.array(memberSchema);

export type Member = z.infer<typeof memberSchema>;
