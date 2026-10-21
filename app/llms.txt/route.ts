import { getInternalNavLinks, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { FAQ_SECTIONS } from "@/lib/faq";

// ビルド時に一度だけ生成する
export const dynamic = "force-static";

/**
 * /llms.txt を生成する。AI がサイトの概要と主なページを短く読み取れるようにするためのテキスト（https://llmstxt.org/ の形式）。
 * 中身はよくある質問とナビゲーションの定義から作るので、ページを直せばここも追従する
 */
export function GET() {
  const pages = getInternalNavLinks()
    .filter(({ href }) => href !== "/")
    .map(({ href, label }) => `- [${label}](${SITE_URL}${href})`);

  const faqs = FAQ_SECTIONS.flatMap((section) => [
    `### ${section.title}`,
    "",
    ...section.items.flatMap((item) => [`**${item.q}**`, "", item.a, ""]),
  ]);

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## 主なページ",
    "",
    ...pages,
    "",
    "## よくある質問",
    "",
    ...faqs,
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
