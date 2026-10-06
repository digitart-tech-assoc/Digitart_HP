/** 長辺をこのピクセル数までに縮小する */
const MAX_DIMENSION = 2000;

const WEBP_QUALITY = 0.85;

export type PreparedImage = {
  /** 保存するファイル名に使う元の名前（変換した場合は拡張子を .webp にしたもの） */
  name: string;
  mimeType: string;
  /** data URL の接頭辞を除いた base64 */
  base64: string;
};

function readAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** 画像を縮小して WebP にする。ブラウザが WebP に変換できない場合は null */
async function toResizedWebp(file: File): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
  );
  // WebP に対応していないブラウザは PNG を返すため、そのときは変換しない
  return blob?.type === "image/webp" ? blob : null;
}

/**
 * 記事に挿入する画像を、送信・保存しやすい大きさにする。
 * 長辺 2000px までに縮小して WebP に変換し、元より小さくなった場合だけ変換後の画像を使う。
 * GIF（アニメーションが失われる）と、変換に失敗した画像は元のまま使う。
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (file.type !== "image/gif") {
    try {
      const webp = await toResizedWebp(file);
      if (webp && webp.size < file.size) {
        return {
          name: file.name.replace(/\.[^.]+$/, "") + ".webp",
          mimeType: "image/webp",
          base64: await readAsBase64(webp),
        };
      }
    } catch {
      // デコードできない形式などは元のまま使う（サーバー側で形式を検証する）
    }
  }
  return { name: file.name, mimeType: file.type, base64: await readAsBase64(file) };
}
