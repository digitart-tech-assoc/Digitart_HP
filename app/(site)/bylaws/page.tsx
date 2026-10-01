import fs from "fs/promises";
import path from "path";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { BYLAWS_FILE } from "@/lib/contentPaths";
import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Bylaws",
  description: "Digitartサークル規約",
  path: "/bylaws",
});

export default async function Page() {
  const filePath = path.join(process.cwd(), BYLAWS_FILE);
  let content = "";
  try {
    content = await fs.readFile(filePath, "utf8");
  } catch {
    content = "規約ファイルが見つかりません。";
  }

  return (
    <div className="mx-auto max-w-3xl px-8 pt-24 pb-16 md:pt-32">
      {/* Page-scoped wrapper so styles can target only bylaws page */}
      <div className="bylaws-page">
        <article className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
