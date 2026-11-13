import { expect, test } from "@playwright/test";

/** 主要なページが表示でき、ページの見出し（h1）があることを確認する */
const PAGES = [
  { path: "/", h1: /好きを\s*カタチにしよう/ },
  { path: "/about", h1: /.+/ },
  { path: "/news", h1: "お知らせ" },
  { path: "/join", h1: "Join Us" },
  { path: "/bylaws", h1: /規約/ },
  { path: "/about/works", h1: "作品紹介" },
];

for (const { path, h1 } of PAGES) {
  test(`${path} が表示され、h1 がある`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(h1);
    expect(errors).toEqual([]);
  });
}

test("記事一覧から記事ページを開ける", async ({ page }) => {
  await page.goto("/news");
  const firstArticle = page.locator('a[href^="/news/"]').first();
  const href = await firstArticle.getAttribute("href");
  await firstArticle.click();

  await expect(page).toHaveURL(href!);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).not.toBeEmpty();
});

// 本文を「# 見出し」から書いている記事。本文の # が h1 のまま出ると、記事タイトルと合わせて h1 が 2 つになる
test("本文に # の見出しがある記事でも、h1 は記事タイトルの 1 つだけ", async ({ page }) => {
  await page.goto("/news/2026-02-28-welcome");

  await expect(page.locator("h1")).toHaveCount(1);
  // 本文の # は h2 として出力される
  await expect(
    page.getByRole("heading", { level: 2, name: "Digitartの公式ホームページが新しくなりました！" }),
  ).toBeVisible();
});

test("ログインしていない状態で管理画面を開くと、ログインページに移動する", async ({ page }) => {
  await page.goto("/admin/news/new");
  await expect(page).toHaveURL(/\/admin\/news\/login$/);
});

test("ナビゲーションのドロワーを開閉できる", async ({ page }) => {
  await page.goto("/news");
  await page.getByRole("button", { name: "メニューを開く" }).click();

  const drawer = page.getByRole("dialog", { name: "ナビゲーションメニュー" });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("button", { name: "メニューを開く" })).toBeFocused();
});
