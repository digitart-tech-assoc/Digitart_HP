"use client";

import { useState } from "react";

import type { PendingImage } from "@/features/news/editor/types";
import { ARTICLE_IMAGES_DIR } from "@/lib/contentPaths";

type UseArticleImagesOptions = {
  /** 公開日。画像の保存先ディレクトリ名に使う */
  date: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * 記事エディタの画像まわり。
 * 選択・貼り付け・ドロップされた画像を base64 で保持し、本文のカーソル位置に Markdown の画像記法を挿入する。
 */
export function useArticleImages({
  date,
  textareaRef,
  content,
  setContent,
}: UseArticleImagesOptions) {
  const [images, setImages] = useState<PendingImage[]>([]);

  const insertImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64Content = dataUrl.split(",")[1];

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const imagePath = `${ARTICLE_IMAGES_DIR}/${date}/${fileName}`;
      const imageMarkdownUrl = imagePath.replace(/^public/, "");

      setImages((prev) => [...prev, { path: imagePath, content: base64Content }]);

      const imageMarkdown = `\n![${file.name}](${imageMarkdownUrl})\n`;
      const textarea = textareaRef.current;
      if (!textarea) {
        setContent((prev) => prev + imageMarkdown);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setContent(content.substring(0, start) + imageMarkdown + content.substring(end));

      // 挿入した画像記法の直後にカーソルを移す（state の反映後に行う）
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + imageMarkdown.length;
          textareaRef.current.selectionEnd = start + imageMarkdown.length;
          textareaRef.current.focus();
        }
      }, 0);
    };
    reader.readAsDataURL(file);
  };

  // まだアップロードしていない画像は、手元にある base64 データでプレビューする
  const resolvePreviewImageSrc = (src: string) => {
    const pendingImage = images.find((img) => img.path === "public" + src);
    return pendingImage ? `data:image/png;base64,${pendingImage.content}` : src;
  };

  return { images, insertImage, resolvePreviewImageSrc };
}
