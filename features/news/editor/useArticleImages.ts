"use client";

import { useState } from "react";

import { prepareImage } from "@/features/news/editor/imageCompression";
import type { EditorImage } from "@/features/news/editor/types";
import { ARTICLE_IMAGES_DIR } from "@/lib/contentPaths";

type UseArticleImagesOptions = {
  /** 公開日。画像の保存先ディレクトリ名に使う */
  date: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * 記事エディタの画像まわり。
 * 選択・貼り付け・ドロップされた画像を縮小・変換して base64 で保持し、本文のカーソル位置に Markdown の画像記法を挿入する。
 */
export function useArticleImages({ date, textareaRef, setContent }: UseArticleImagesOptions) {
  const [images, setImages] = useState<EditorImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  /** 複数の画像をまとめて、カーソル位置（選択範囲を置き換えて）に挿入する */
  const insertImages = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    // 変換を待つ間にカーソルが動いても、操作した時点の位置に挿入する
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;

    setIsProcessing(true);
    try {
      const prepared = await Promise.all(imageFiles.map(prepareImage));
      const added = prepared.map((image, i): EditorImage => {
        const fileName = `${Date.now()}-${i}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        return {
          path: `${ARTICLE_IMAGES_DIR}/${date}/${fileName}`,
          content: image.base64,
          mimeType: image.mimeType,
        };
      });
      const markdown = added
        .map((image, i) => `\n![${imageFiles[i].name}](${image.path.replace(/^public/, "")})\n`)
        .join("");

      setImages((prev) => [...prev, ...added]);
      setContent((prev) =>
        start === undefined || end === undefined
          ? prev + markdown
          : prev.slice(0, start) + markdown + prev.slice(end),
      );

      // 挿入した画像記法の直後にカーソルを移す（state の反映後に行う）
      if (start !== undefined) {
        setTimeout(() => {
          const el = textareaRef.current;
          if (!el) return;
          el.selectionStart = el.selectionEnd = start + markdown.length;
          el.focus();
        }, 0);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // まだアップロードしていない画像は、手元にある base64 データでプレビューする
  const resolvePreviewImageSrc = (src: string) => {
    const pendingImage = images.find((img) => img.path === "public" + src);
    return pendingImage ? `data:${pendingImage.mimeType};base64,${pendingImage.content}` : src;
  };

  return { images, setImages, insertImages, isProcessing, resolvePreviewImageSrc };
}
