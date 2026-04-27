'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createPullRequestForArticle } from '@/lib/github';

export async function loginAction(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: 'サーバーで ADMIN_PASSWORD が設定されていません。' };
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    redirect('/admin/news/new');
  } else {
    return { error: 'パスワードが正しくありません。' };
  }
}

export async function publishArticleAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  if (!authCookie || authCookie.value !== 'true') {
    return { error: '認証されていません。' };
  }

  try {
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const slugInput = formData.get('slug') as string;
    const imagesJson = formData.get('images') as string;
    
    if (!title || !author || !date || !category || !content || !slugInput) {
      return { error: '必須項目が入力されていません。' };
    }

    if (!/^[a-z0-9-]+$/.test(slugInput)) {
      return { error: 'ファイル名は半角英小文字、数字、ハイフンのみ使用可能です。' };
    }

    const allImages: { path: string, content: string }[] = imagesJson ? JSON.parse(imagesJson) : [];
    
    // Markdown本文にパスが含まれている画像のみを抽出（エディタ上で削除された画像を除外）
    const images = allImages.filter(img => {
      const markdownPath = img.path.replace(/^public/, '');
      return content.includes(markdownPath);
    });

    // Format Frontmatter
    const frontmatter = `---
title: "${title}"
date: "${date}"
author: "${author}"
excerpt: "${excerpt || ''}"
category: "${category}"
---

${content}
`;

    // Prepare files for GitHub
    const finalSlug = `${date}-${slugInput}`;
    const mdPath = `app/news/articles/${finalSlug}.md`;

    const githubFiles = [
      {
        path: mdPath,
        content: frontmatter,
        encoding: 'utf-8' as const,
      }
    ];

    // Add images
    for (const img of images) {
      githubFiles.push({
        path: img.path, // e.g. public/images/articles/YYYY-MM-DD/filename.png
        content: img.content, // base64 string without data URL prefix
        encoding: 'base64' as const,
      });
    }

    // GitHubにPRを作成
    const branchName = `digitart/article-${date}-${Date.now()}`;
    const commitMessage = `add: 記事「${title}」を追加`;
    const prUrl = await createPullRequestForArticle(githubFiles, commitMessage, branchName);

    return { success: true, prUrl };
  } catch (error: any) {
    console.error('Failed to publish article:', error);
    return { error: error.message || '記事の公開に失敗しました。' };
  }
}
