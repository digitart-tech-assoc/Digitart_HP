import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import {
  type Article,
  type ArticleSummary,
  articleFrontmatterSchema,
} from "@/features/news/schema";
import { ARTICLES_DIR } from "@/lib/contentPaths";

const articlesDirectory = path.join(process.cwd(), ARTICLES_DIR);

/** 記事ファイルを読み込み、frontmatter を検証して返す */
function readArticle(slug: string): Article {
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  const result = articleFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `記事の frontmatter が不正です: ${ARTICLES_DIR}/${slug}.md\n${z.prettifyError(result.error)}`,
    );
  }

  return { slug, content, ...result.data };
}

/** すべての記事を新しい順に返す（本文は含まない） */
export function getAllArticles(): ArticleSummary[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(articlesDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // 一覧では本文を使わないので取り除く
      const { content: _content, ...summary } = readArticle(fileName.replace(/\.md$/, ""));
      return summary;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** slug に対応する記事を返す。存在しなければ null */
export function getArticle(slug: string): Article | null {
  // URL から渡された値でディレクトリ外のファイルを読まないよう、使える文字を制限する
  if (!/^[\w-]+$/.test(slug)) {
    return null;
  }
  if (!fs.existsSync(path.join(articlesDirectory, `${slug}.md`))) {
    return null;
  }
  return readArticle(slug);
}
