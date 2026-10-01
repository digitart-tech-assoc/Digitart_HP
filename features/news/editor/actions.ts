"use server";

import { cookies } from "next/headers";

import { buildArticleMarkdown, filterReferencedImages } from "@/features/news/editor/articleFile";
import { createPullRequestWithFiles, type RepositoryFile } from "@/features/news/editor/github";
import { parsePublishInput } from "@/features/news/editor/publishInput";
import type { PublishState } from "@/features/news/editor/types";
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
  if (!(await isAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value))) {
    return { error: "認証されていません。", success: false, prUrl: null };
  }

  const input = parsePublishInput({
    fields: {
      title: getString(formData, "title"),
      author: getString(formData, "author"),
      date: getString(formData, "date"),
      slug: getString(formData, "slug"),
      category: getString(formData, "category"),
      excerpt: getString(formData, "excerpt"),
    },
    content: getString(formData, "content"),
    imagesJson: getString(formData, "images"),
  });
  if (!input.ok) {
    return { error: input.error, success: false, prUrl: null };
  }

  const { fields, content } = input.value;
  const images = filterReferencedImages(input.value.images, content);

  try {
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
