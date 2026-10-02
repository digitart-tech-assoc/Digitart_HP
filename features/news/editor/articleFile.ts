import type { ArticleFields, PendingImage } from "@/features/news/editor/types";

/**
 * frontmatter の値を YAML のダブルクォート文字列にする。
 * JSON の文字列表記（" \ 改行などをエスケープ済み）は、YAML のダブルクォート文字列としてもそのまま正しく読めるため、
 * タイトルに " や改行が含まれていても frontmatter の構造は変わらない。
 */
function yamlString(value: string): string {
  return JSON.stringify(value);
}

/** 記事の Markdown ファイルの中身（frontmatter + 本文）を作る */
export function buildArticleMarkdown(fields: ArticleFields, content: string): string {
  return `---
title: ${yamlString(fields.title)}
date: ${yamlString(fields.date)}
author: ${yamlString(fields.author)}
excerpt: ${yamlString(fields.excerpt)}
category: ${yamlString(fields.category)}
---

${content}
`;
}

/**
 * 本文から参照されている画像だけを返す（同じパスの画像は 1 つにまとめる）。
 * エディタに挿入したあと本文から削除した画像を、リポジトリに追加しないようにするため。
 */
export function filterReferencedImages(images: PendingImage[], content: string): PendingImage[] {
  const byPath = new Map<string, PendingImage>();
  for (const img of images) {
    if (content.includes(img.path.replace(/^public/, ""))) {
      byPath.set(img.path, img);
    }
  }
  return [...byPath.values()];
}
