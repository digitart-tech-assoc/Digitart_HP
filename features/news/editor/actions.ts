"use server";

import { cookies } from "next/headers";

import { buildArticleMarkdown, filterReferencedImages } from "@/features/news/editor/articleFile";
import { createPullRequestWithFiles, type RepositoryFile } from "@/features/news/editor/github";
import type { ArticleFields, PendingImage, PublishState } from "@/features/news/editor/types";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/adminSession";
import { ARTICLES_DIR } from "@/lib/contentPaths";

/** フォームの値を文字列として取り出す（未入力なら空文字） */
function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** 記事と画像をコミットしたプルリクエストを作成する */
export async function publishArticleAction(
  _prevState: PublishState,
  formData: FormData,
): Promise<PublishState> {
  const cookieStore = await cookies();
  if (!isAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return { error: "認証されていません。", success: false, prUrl: null };
  }

  try {
    const fields: ArticleFields = {
      title: getString(formData, "title"),
      author: getString(formData, "author"),
      date: getString(formData, "date"),
      slug: getString(formData, "slug"),
      category: getString(formData, "category"),
      excerpt: getString(formData, "excerpt"),
    };
    const content = getString(formData, "content");
    const imagesJson = getString(formData, "images");

    if (
      !fields.title ||
      !fields.author ||
      !fields.date ||
      !fields.category ||
      !content ||
      !fields.slug
    ) {
      return { error: "必須項目が入力されていません。", success: false, prUrl: null };
    }

    if (!/^[a-z0-9-]+$/.test(fields.slug)) {
      return {
        error: "ファイル名は半角英小文字、数字、ハイフンのみ使用可能です。",
        success: false,
        prUrl: null,
      };
    }

    const allImages: PendingImage[] = imagesJson ? JSON.parse(imagesJson) : [];
    const images = filterReferencedImages(allImages, content);

    const files: RepositoryFile[] = [
      {
        path: `${ARTICLES_DIR}/${fields.date}-${fields.slug}.md`,
        content: buildArticleMarkdown(fields, content),
        encoding: "utf-8",
      },
      ...images.map((img) => ({
        path: img.path,
        content: img.content,
        encoding: "base64" as const,
      })),
    ];

    const prUrl = await createPullRequestWithFiles({
      files,
      branchName: `digitart/article-${fields.date}-${Date.now()}`,
      title: `add: 記事「${fields.title}」を追加`,
      body: `/admin/news/new より、記事「${fields.title}」の追加リクエストが作成されました。\n\n内容を確認し、問題なければマージしてください。`,
    });

    return { error: null, success: true, prUrl };
  } catch (error) {
    console.error("Failed to publish article:", error);
    const message = error instanceof Error ? error.message : "";
    return { error: message || "記事の公開に失敗しました。", success: false, prUrl: null };
  }
}
