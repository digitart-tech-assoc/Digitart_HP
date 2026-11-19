import matter from "gray-matter";
import { describe, expect, it } from "vitest";

import { buildArticleMarkdown, filterReferencedImages } from "@/features/news/editor/articleFile";
import type { ArticleFields } from "@/features/news/editor/types";

const fields: ArticleFields = {
  title: "タイトル",
  author: "著者",
  date: "2026-04-01",
  slug: "hello",
  category: "notice",
  excerpt: "概要",
};

describe("buildArticleMarkdown", () => {
  it("frontmatter と本文を出力し、gray-matter で読み戻せる", () => {
    const parsed = matter(buildArticleMarkdown(fields, "本文です"));

    expect(parsed.data).toEqual({
      title: "タイトル",
      author: "著者",
      date: "2026-04-01",
      excerpt: "概要",
      category: "notice",
    });
    expect(parsed.content.trim()).toBe("本文です");
  });

  it('タイトルに " や改行、--- が含まれていても frontmatter の構造が壊れない', () => {
    const title = 'He said "hi"\n---\ncategory: column';
    const parsed = matter(buildArticleMarkdown({ ...fields, title }, "本文"));

    expect(parsed.data.title).toBe(title);
    expect(parsed.data.category).toBe("notice");
    expect(parsed.content.trim()).toBe("本文");
  });
});

describe("filterReferencedImages", () => {
  const image = (name: string, content = "AAAA") => ({
    path: `public/images/articles/2026-04-01/${name}`,
    content,
  });

  it("本文で参照されている画像だけを返す", () => {
    const content = "![](/images/articles/2026-04-01/a.png)";
    expect(filterReferencedImages([image("a.png"), image("b.png")], content)).toEqual([
      image("a.png"),
    ]);
  });

  it("同じパスの画像は 1 つにまとめる（後から挿入したものを使う）", () => {
    const content = "![](/images/articles/2026-04-01/a.png)";
    expect(filterReferencedImages([image("a.png", "OLD"), image("a.png", "NEW")], content)).toEqual(
      [image("a.png", "NEW")],
    );
  });
});
