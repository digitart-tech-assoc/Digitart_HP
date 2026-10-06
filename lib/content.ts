import "server-only";

import fs from "node:fs";
import path from "node:path";

import { z } from "zod";

/**
 * content/ 配下のデータを zod で検証して返す。
 * 不正なときは、どのファイルの何件目（[0] 始まり）のどの項目が違うかを表示してビルドを失敗させる。
 * imagesOf を渡すと、データ内の画像パスが public/ に実在するかも確認する。
 */
export function parseContent<T extends z.ZodType>(
  file: string,
  schema: T,
  data: unknown,
  imagesOf?: (value: z.infer<T>) => string[],
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`${file} の形式が不正です\n${z.prettifyError(result.error)}`);
  }

  const missing = (imagesOf?.(result.data) ?? []).filter(
    (src) => !fs.existsSync(path.join(process.cwd(), "public", src)),
  );
  if (missing.length > 0) {
    throw new Error(
      `${file} に、存在しない画像が指定されています（public/ 配下に置いてください）\n${missing.join("\n")}`,
    );
  }

  return result.data;
}
