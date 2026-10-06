import "server-only";

import fs from "node:fs";
import path from "node:path";

import { BYLAWS_FILE } from "@/lib/contentPaths";

/** サークル規約の Markdown を読み込む。ファイルがなければビルドを失敗させて気づけるようにする */
export function getBylaws(): string {
  return fs.readFileSync(path.join(process.cwd(), BYLAWS_FILE), "utf8");
}
