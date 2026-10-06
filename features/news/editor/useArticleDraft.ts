"use client";

import { useEffect, useRef, useState } from "react";

import {
  type ArticleDraft,
  deleteDraft,
  loadDraft,
  saveDraft,
} from "@/features/news/editor/draftStorage";
import type { ArticleFields, EditorImage } from "@/features/news/editor/types";

/** 入力が止まってから保存するまでの時間 */
const SAVE_DELAY_MS = 800;

/** タイトルか本文が入力されているか（何も書いていない状態は下書きとして扱わない） */
function hasContent(fields: ArticleFields, content: string) {
  return content.trim() !== "" || fields.title.trim() !== "";
}

type UseArticleDraftOptions = {
  fields: ArticleFields;
  content: string;
  images: EditorImage[];
  /** 保存されていた下書きを、エディタの状態に戻す */
  restore: (draft: ArticleDraft) => void;
  /** 投稿に成功したか。成功したら下書きを削除し、保存もやめる */
  published: boolean;
};

/**
 * 記事の下書きをブラウザ（IndexedDB）に自動保存し、次に開いたときに復元する。
 * 未送信の内容があるときは、ページを離れる前に確認を出す。
 * IndexedDB が使えない環境（一部のプライベートブラウズなど）では、保存せずに動く。
 */
export function useArticleDraft({
  fields,
  content,
  images,
  restore,
  published,
}: UseArticleDraftOptions) {
  // 復元が終わるまでは保存しない（空の初期値で下書きを上書きしないため）
  const [loaded, setLoaded] = useState(false);
  const [restoredAt, setRestoredAt] = useState<number | null>(null);
  const restoreRef = useRef(restore);

  useEffect(() => {
    restoreRef.current = restore;
  });

  useEffect(() => {
    let cancelled = false;
    loadDraft()
      .then((draft) => {
        if (cancelled || !draft || !hasContent(draft.fields, draft.content)) return;
        restoreRef.current(draft);
        setRestoredAt(draft.savedAt);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded || published) return;
    const timer = setTimeout(() => {
      // すべて消したときは、空の下書きを残さずに削除する
      const task = hasContent(fields, content)
        ? saveDraft({ fields, content, images, savedAt: Date.now() })
        : deleteDraft();
      task.catch(() => {});
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [loaded, published, fields, content, images]);

  useEffect(() => {
    if (published) deleteDraft().catch(() => {});
  }, [published]);

  const hasUnsentContent = !published && hasContent(fields, content);

  useEffect(() => {
    if (!hasUnsentContent) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsentContent]);

  /** 下書きを削除する（「破棄して新しく書く」用）。画面の内容のリセットは呼び出し側で行う */
  const discardDraft = () => {
    setRestoredAt(null);
    return deleteDraft().catch(() => {});
  };

  return { restoredAt, discardDraft };
}
