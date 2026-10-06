import { describe, expect, it } from "vitest";

import { isSupportedImageContent, parsePublishInput } from "@/features/news/editor/publishInput";

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]).toString(
  "base64",
);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0]).toString("base64");
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>').toString("base64");

const fields = {
  title: "タイトル",
  author: "著者",
  date: "2026-04-01",
  slug: "hello-world",
  category: "notice",
  excerpt: "",
};

function input(overrides: {
  fields?: Partial<typeof fields>;
  content?: string;
  images?: { path: string; content: string }[];
}) {
  return {
    fields: { ...fields, ...overrides.fields },
    content: overrides.content ?? "本文",
    imagesJson: JSON.stringify(overrides.images ?? []),
  };
}

const imagePath = (name: string) => `public/images/articles/2026-04-01/${name}`;
const ref = (name: string) => `![](/images/articles/2026-04-01/${name})`;

describe("parsePublishInput", () => {
  it("正しい入力を受け付ける", () => {
    const result = parsePublishInput(
      input({ content: ref("a.png"), images: [{ path: imagePath("a.png"), content: PNG }] }),
    );
    expect(result.ok).toBe(true);
  });

  it.each([
    ["実在しない日付", { date: "2026-02-30" }],
    ["形式が違う日付", { date: "2026/04/01" }],
    ["大文字を含むファイル名", { slug: "Hello" }],
    ["スラッシュを含むファイル名", { slug: "../hello" }],
    ["未定義のカテゴリ", { category: "secret" }],
    ["空のタイトル", { title: "   " }],
  ])("%s を拒否する", (_, f) => {
    expect(parsePublishInput(input({ fields: f })).ok).toBe(false);
  });

  it("本文が空なら拒否する", () => {
    expect(parsePublishInput(input({ content: " \n " })).ok).toBe(false);
  });

  it("画像の保存先が想定外の場所なら拒否する", () => {
    const result = parsePublishInput(
      input({
        content: "/images/../app/page.tsx",
        images: [{ path: "public/images/../app/page.tsx", content: PNG }],
      }),
    );
    expect(result).toEqual({ ok: false, error: "画像の保存先が正しくありません。" });
  });

  it("SVG など対応していない形式の画像を拒否する", () => {
    expect(
      parsePublishInput(
        input({ content: ref("a.svg"), images: [{ path: imagePath("a.svg"), content: SVG }] }),
      ).ok,
    ).toBe(false);
    // 拡張子が png でも中身が画像でなければ拒否する
    expect(
      parsePublishInput(
        input({ content: ref("a.png"), images: [{ path: imagePath("a.png"), content: SVG }] }),
      ).ok,
    ).toBe(false);
  });

  it("本文から削除済みの画像は、形式が不正でも無視して受け付ける", () => {
    const result = parsePublishInput(
      input({ content: "本文", images: [{ path: imagePath("a.svg"), content: SVG }] }),
    );
    expect(result).toMatchObject({ ok: true, value: { images: [] } });
  });

  it("画像データが JSON として壊れていれば拒否する", () => {
    expect(parsePublishInput({ ...input({}), imagesJson: "{" }).ok).toBe(false);
  });
});

describe("isSupportedImageContent", () => {
  it("PNG・JPEG を受け付け、SVG や壊れた base64 を拒否する", () => {
    expect(isSupportedImageContent(PNG)).toBe(true);
    expect(isSupportedImageContent(JPEG)).toBe(true);
    expect(isSupportedImageContent(SVG)).toBe(false);
    expect(isSupportedImageContent("@@@")).toBe(false);
  });
});
