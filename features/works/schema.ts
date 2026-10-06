import { z } from "zod";

import { imagePathSchema, requiredText } from "@/lib/contentSchema";

/** content/works.json の 1 件分（メンバーの制作物） */
export const projectSchema = z.object({
  title: requiredText,
  desc: requiredText,
  /** 使った技術（タグとして表示する） */
  tech: z.array(requiredText),
  image: imagePathSchema,
  /** 公開先の URL。内部向けなど公開していない作品は省略する */
  url: z.url().optional(),
  category: requiredText,
});

export const projectsSchema = z.array(projectSchema);

export type Project = z.infer<typeof projectSchema>;
