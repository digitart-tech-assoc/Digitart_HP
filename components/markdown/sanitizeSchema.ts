import { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";

import type { Element, Root } from "hast";

/**
 * 記事本文の iframe で埋め込んでよい URL の接頭辞。
 * iframe は中で任意のページを開けるため、使っているサービスの埋め込み用 URL だけに絞る。
 * 新しいサービスを埋め込みたいときは、ここに追加する。
 */
const ALLOWED_IFRAME_SRC_PREFIXES = ["https://open.spotify.com/embed/"];

/**
 * 記事本文の iframe に渡す権限（allow 属性）。
 * 記事側で書いた allow はサニタイズで消し、ここで決めた値だけを渡す（カメラや位置情報などを埋め込み先に渡さないため）。
 * 値は Spotify の埋め込みコードに付いているもの。新しいサービスで別の権限が要るときは、ここに追加する。
 */
export const IFRAME_ALLOW =
  "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

/** サニタイズで id・name の前に付ける接頭辞（DOM clobbering 対策。rehype-sanitize の既定値） */
const CLOBBER_PREFIX = defaultSchema.clobberPrefix ?? "user-content-";

/**
 * 記事本文の HTML で使ってよい要素・属性（GitHub と同じ既定の許可リストに、このサイトで使うものを足したもの）。
 * 記事は PR のレビューを経て公開されるが、レビューの見落としがそのまま XSS にならないよう、
 * `<script>`・`<style>`・`on*` 属性・`style` 属性などは描画しない。
 */
export const markdownSanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  // 中身ごと消す要素（既定では中身の文字だけが本文に残ってしまう）
  strip: ["script", "style"],
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    // remark-math が付けるクラス。rehype-katex が数式を見つけるのに使う
    code: [["className", /^language-./, "math-inline", "math-display"]],
    // style 属性は、ページ全体を覆う配置などに使えるため許可しない（角丸・枠線は MarkdownRenderer のクラスで付く）。
    // allow 属性は MarkdownRenderer で IFRAME_ALLOW を固定で付けるため許可しない
    iframe: ["src", "width", "height", "title", "allowFullScreen", "loading", "frameBorder"],
  },
};

/**
 * ページ内リンク（`#...`）の飛び先を、サニタイズで接頭辞が付いた id に合わせる rehype プラグイン。
 * サニタイズは id に `user-content-` を付けるが href は書き換えないため、脚注などのリンクが切れるのを防ぐ。
 * remark-rehype 側では接頭辞を付けない設定（MarkdownRenderer の remarkRehypeOptions）と組み合わせて使う。
 */
export function rehypePrefixFragmentLinks() {
  const visit = (parent: Root | Element) => {
    for (const child of parent.children) {
      if (child.type !== "element") continue;
      const href = child.properties.href;
      if (
        child.tagName === "a" &&
        typeof href === "string" &&
        href.startsWith("#") &&
        href.length > 1
      ) {
        child.properties.href = `#${CLOBBER_PREFIX}${href.slice(1)}`;
      }
      visit(child);
    }
  };
  return visit;
}

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
