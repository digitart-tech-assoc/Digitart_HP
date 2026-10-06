import { z } from "zod";

import { imagePathSchema, requiredText } from "@/lib/contentSchema";

/** content/supporters.json の形式 */
export const supportersContentSchema = z.object({
  /** 役員 */
  members: z.array(
    z.object({
      name: requiredText,
      role: requiredText,
      /** 学部・学科と学年 */
      year: requiredText,
      quote: requiredText,
      image: imagePathSchema,
    }),
  ),
  /** よくある質問 */
  qa: z.array(z.object({ q: requiredText, a: requiredText })),
});

export type SupportersContent = z.infer<typeof supportersContentSchema>;
