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

/** Markdown の画像の代替テキストに使えるよう、改行をなくし、記法の区切り（[ ] \）をエスケープする */
function toAltText(fileName: string) {
  return fileName.replace(/[\r\n]+/g, " ").replace(/[\\[\]]/g, "\\$&");
}

/**
 * 記事エディタの画像まわり。
 * 選択・貼り付け・ドロップされた画像を縮小・変換して base64 で保持し、本文のカーソル位置に Markdown の画像記法を挿入する。
 */
export function useArticleImages({ date, textareaRef, setContent }: UseArticleImagesOptions) {
  const [images, setImages] = useState<EditorImage[]>([]);
  // 処理中の挿入操作の数。続けて挿入したとき、先に終わった操作で「処理中」が解除されないよう、件数で数える
  const [processingCount, setProcessingCount] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);

  /** 複数の画像をまとめて、カーソル位置（選択範囲を置き換えて）に挿入する */
  const insertImages = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    // 変換を待つ間にカーソルが動いても、操作した時点の位置に挿入する
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;

    setProcessingCount((count) => count + 1);
    setImageError(null);
    try {
      // 1 枚読み込めなくても、ほかの画像は挿入する
      const results = await Promise.allSettled(imageFiles.map(prepareImage));
      const succeeded = results.flatMap((result, i) =>
        result.status === "fulfilled" ? [{ image: result.value, file: imageFiles[i] }] : [],
      );
      const failed = imageFiles.filter((_, i) => results[i].status === "rejected");
      if (failed.length > 0) {
        setImageError(`画像を読み込めませんでした: ${failed.map((file) => file.name).join("、")}`);
      }
      if (succeeded.length === 0) return;

      const added = succeeded.map(({ image }, i): EditorImage => {
        const fileName = `${Date.now()}-${i}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        return {
          path: `${ARTICLE_IMAGES_DIR}/${date}/${fileName}`,
          content: image.base64,
          mimeType: image.mimeType,
        };
      });
      const markdown = added
        .map(
          (image, i) =>
            `\n![${toAltText(succeeded[i].file.name)}](${image.path.replace(/^public/, "")})\n`,
        )
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
      setProcessingCount((count) => count - 1);
    }
  };

  // まだアップロードしていない画像は、手元にある base64 データでプレビューする
  const resolvePreviewImageSrc = (src: string) => {
    const pendingImage = images.find((img) => img.path === "public" + src);
    return pendingImage ? `data:${pendingImage.mimeType};base64,${pendingImage.content}` : src;
  };

  return {
    images,
    setImages,
    insertImages,
    isProcessing: processingCount > 0,
    imageError,
    resolvePreviewImageSrc,
  };
}
