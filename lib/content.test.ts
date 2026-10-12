import { describe, expect, it } from "vitest";
import { z } from "zod";

import { parseContent } from "@/lib/content";
import { imagePathSchema } from "@/lib/contentSchema";

const schema = z.array(z.object({ title: z.string().min(1), image: imagePathSchema }));
const imagesOf = (items: z.infer<typeof schema>) => items.map((item) => item.image);

describe("parseContent", () => {
  it("正しいデータをそのまま返す", () => {
    const data = [{ title: "a", image: "/images/digitart_white_normal.svg" }];
    expect(parseContent("content/x.json", schema, data, imagesOf)).toEqual(data);
  });

  it("不正なデータは、ファイル名と何件目の何が違うかを含むエラーにする", () => {
    const data = [
      { title: "a", image: "/images/digitart_white_normal.svg" },
      { title: "", image: "images/no-slash.png" },
    ];
    expect(() => parseContent("content/x.json", schema, data)).toThrow(
      /content\/x\.json[\s\S]*\[1\]\.title[\s\S]*\[1\]\.image/,
    );
  });

  it("public/ に存在しない画像を指定するとエラーにする", () => {
    const data = [{ title: "a", image: "/images/not-found.png" }];
    expect(() => parseContent("content/x.json", schema, data, imagesOf)).toThrow(
      /存在しない画像[\s\S]*\/images\/not-found\.png/,
    );
  });
});
