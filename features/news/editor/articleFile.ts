import type { ArticleFields, PendingImage } from "@/features/news/editor/types";

/** 記事の Markdown ファイルの中身（frontmatter + 本文）を作る */
export function buildArticleMarkdown(fields: ArticleFields, content: string): string {
  return `---
title: "${fields.title}"
date: "${fields.date}"
author: "${fields.author}"
excerpt: "${fields.excerpt || ""}"
category: "${fields.category}"
---

${content}
`;
}

/**
 * 本文から参照されている画像だけを返す。
 * エディタに挿入したあと本文から削除した画像を、リポジトリに追加しないようにするため。
 */
export function filterReferencedImages(images: PendingImage[], content: string): PendingImage[] {
  return images.filter((img) => content.includes(img.path.replace(/^public/, "")));
}
