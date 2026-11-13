import "server-only";

import supportersData from "@/content/supporters.json";
import { membersSchema } from "@/features/supporters/schema";
import { parseContent } from "@/lib/content";

/** 役員の紹介（content/supporters.json） */
export function getMembers() {
  return parseContent("content/supporters.json", membersSchema, supportersData, (members) =>
    members.map((member) => member.image),
  );
}
