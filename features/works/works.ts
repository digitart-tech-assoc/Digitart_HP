import "server-only";

import worksData from "@/content/works.json";
import { projectsSchema } from "@/features/works/schema";
import { parseContent } from "@/lib/content";

/** 制作物の一覧（content/works.json） */
export function getProjects() {
  return parseContent("content/works.json", projectsSchema, worksData, (projects) =>
    projects.map((p) => p.image),
  );
}
