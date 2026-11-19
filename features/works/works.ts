import "server-only";

import worksData from "@/content/works.json";
import { projectsSchema } from "@/features/works/schema";
import { parseContent } from "@/lib/content";

/** メンバーの制作物（content/works.json） */
export function getProjects() {
  return parseContent("content/works.json", projectsSchema, worksData, (projects) =>
    projects.map((project) => project.image),
  );
}
