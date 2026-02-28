import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// src配下やapp配下のarticlesディレクトリを指定
const articlesDirectory = path.join(process.cwd(), 'app', 'news', 'articles');

export function getSortedArticlesData() {
  // ディレクトリがない（最初）場合は空配列を返す
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  // articlesディレクトリ内のファイル名を取得
  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticlesData = fileNames
    // markdownファイルのみを対象
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // ファイル名から「.md」を削除してid（slug）を取得
      const id = fileName.replace(/\.md$/, '');

      // Markdownファイルを文字列として読み込む
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // gray-matterを使って投稿のメタデータ部分をパース
      const matterResult = matter(fileContents);

      // データをidとまとめて返す
      return {
        id,
        ...(matterResult.data as { title: string; date: string; excerpt?: string; author?: string }),
      };
    });

  // 記事を日付でソートする
  return allArticlesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getArticleData(id: string) {
  const fullPath = path.join(articlesDirectory, `${id}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // gray-matterを使ってメタデータと本文をパース
  const matterResult = matter(fileContents);

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as { title: string; date: string; excerpt?: string; author?: string }),
  };
}
