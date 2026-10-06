import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** 一時ディレクトリに content/news を作り、そこを作業ディレクトリとして articles.ts を読み込む */
async function loadWithArticles(files: Record<string, string>) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "articles-"));
  const dir = path.join(root, "content/news");
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), body);
  }
  vi.spyOn(process, "cwd").mockReturnValue(root);
  vi.resetModules();
  return import("@/features/news/articles");
}

function article(fields: Record<string, string>, body = "本文") {
  const lines = Object.entries(fields).map(([k, v]) => `${k}: "${v}"`);
  return `---\n${lines.join("\n")}\n---\n\n${body}\n`;
}

const valid = { title: "タイトル", date: "2026-04-01", category: "notice" };

describe("getAllArticles", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("frontmatter を検証し、新しい順に並べて本文を除いて返す", async () => {
    const { getAllArticles } = await loadWithArticles({
      "2026-04-01-a.md": article(valid),
      "2026-05-01-b.md": article({ ...valid, date: "2026-05-01", category: "column" }),
      "README.txt": "Markdown 以外は無視する",
    });

    const articles = getAllArticles();
    expect(articles.map((a) => a.slug)).toEqual(["2026-05-01-b", "2026-04-01-a"]);
    expect(articles[0]).not.toHaveProperty("content");
  });

  it("frontmatter が不正な記事があると、ファイル名を含むエラーにする", async () => {
    const { getAllArticles } = await loadWithArticles({
      "2026-04-01-bad.md": article({ ...valid, category: "unknown" }),
    });

    expect(() => getAllArticles()).toThrow(/content\/news\/2026-04-01-bad\.md/);
  });

  it("日付が YYYY-MM-DD でない記事を拒否する", async () => {
    const { getAllArticles } = await loadWithArticles({
      "x.md": article({ ...valid, date: "2026/04/01" }),
    });

    expect(() => getAllArticles()).toThrow(/YYYY-MM-DD/);
  });
});

describe("getArticle", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("slug に対応する記事を本文付きで返す", async () => {
    const { getArticle } = await loadWithArticles({
      "2026-04-01-a.md": article(valid, "こんにちは"),
    });

    const result = getArticle("2026-04-01-a");
    expect(result?.title).toBe("タイトル");
    expect(result?.content.trim()).toBe("こんにちは");
  });

  it("存在しない記事や、ディレクトリの外を指す slug には null を返す", async () => {
    const { getArticle } = await loadWithArticles({ "2026-04-01-a.md": article(valid) });

    expect(getArticle("missing")).toBeNull();
    expect(getArticle("../../etc/passwd")).toBeNull();
    expect(getArticle("a/b")).toBeNull();
  });
});

describe("リポジトリの記事", () => {
  it("すべての記事の frontmatter が正しい", async () => {
    vi.restoreAllMocks();
    vi.resetModules();
    const { getAllArticles } = await import("@/features/news/articles");
    expect(getAllArticles().length).toBeGreaterThan(0);
  });
});
