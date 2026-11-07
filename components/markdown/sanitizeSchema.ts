import { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";

import type { Element, Root } from "hast";

/**
 * 記事本文の iframe で埋め込んでよい URL の接頭辞。
 * iframe は中で任意のページを開けるため、使っているサービスの埋め込み用 URL だけに絞る。
 * 新しいサービスを埋め込みたいときは、ここに追加する。
 */
const ALLOWED_IFRAME_SRC_PREFIXES = ["https://open.spotify.com/embed/"];

/**
 * 記事本文の HTML で使ってよい要素・属性（GitHub と同じ既定の許可リストに、このサイトで使うものを足したもの）。
 * 記事は PR のレビューを経て公開されるが、レビューの見落としがそのまま XSS にならないよう、
 * `<script>`・`<style>`・`on*` 属性・`style` 属性などは描画しない。
 */
export const markdownSanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  // 脚注の id は remark-rehype が `user-content-` を付けて作るため、ここでさらに付けると脚注へのリンクが切れる
  clobberPrefix: "",
  // 中身ごと消す要素（既定では中身の文字だけが本文に残ってしまう）
  strip: ["script", "style"],
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    // remark-math が付けるクラス。rehype-katex が数式を見つけるのに使う
    code: [["className", /^language-./, "math-inline", "math-display"]],
    // 見出しのレベルの割り当て（MarkdownRenderer の remarkArticleHeadingLevels）に使う
    h1: ["dataHeadingLevel"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "dataHeadingLevel"],
    h3: ["dataHeadingLevel"],
    h4: ["dataHeadingLevel"],
    h5: ["dataHeadingLevel"],
    h6: ["dataHeadingLevel"],
    // style 属性は、ページ全体を覆う配置などに使えるため許可しない（角丸・枠線は MarkdownRenderer のクラスで付く）
    iframe: [
      "src",
      "width",
      "height",
      "title",
      "allow",
      "allowFullScreen",
      "loading",
      "frameBorder",
    ],
  },
};

/**
 * 許可していない URL の iframe を取り除く rehype プラグイン。
 * rehype-sanitize は属性の値をドメインで絞れないため、サニタイズの後にこれを通す。
 */
export function rehypeAllowedIframes() {
  const isAllowedIframe = (node: Element) => {
    const src = node.properties.src;
    return (
      typeof src === "string" &&
      ALLOWED_IFRAME_SRC_PREFIXES.some((prefix) => src.startsWith(prefix))
    );
  };
  const filter = (parent: Root | Element) => {
    parent.children = parent.children.filter(
      (child) => child.type !== "element" || child.tagName !== "iframe" || isAllowedIframe(child),
    );
    for (const child of parent.children) {
      if (child.type === "element") filter(child);
    }
  };
  return filter;
}
