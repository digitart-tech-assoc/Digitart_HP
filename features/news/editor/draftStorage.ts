import type { ArticleFields, EditorImage } from "@/features/news/editor/types";

/** ブラウザに保存する記事の下書き */
export type ArticleDraft = {
  fields: ArticleFields;
  content: string;
  images: EditorImage[];
  savedAt: number;
};

/*
 * 画像を含めて保存するため、容量の小さい localStorage（5MB 程度）ではなく IndexedDB を使う。
 * 下書きは 1 件だけ持ち、同じキーで上書きする。
 */
const DB_NAME = "digitart-article-editor";
const STORE_NAME = "drafts";
const DRAFT_KEY = "current";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = run(db.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

export function loadDraft(): Promise<ArticleDraft | undefined> {
  return withStore("readonly", (store) => store.get(DRAFT_KEY));
}

export function saveDraft(draft: ArticleDraft): Promise<void> {
  return withStore("readwrite", (store) => store.put(draft, DRAFT_KEY));
}

export function deleteDraft(): Promise<void> {
  return withStore("readwrite", (store) => store.delete(DRAFT_KEY));
}
