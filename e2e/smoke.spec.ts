import { expect, test } from "@playwright/test";

/** 主要なページが表示でき、ページの見出し（h1）があることを確認する */
const PAGES = [
  { path: "/", h1: /好きを\s*カタチにしよう/ },
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
    await expect(page.locator("h1").first()).toHaveText(h1);
    expect(errors).toEqual([]);
  });
}

// /about には現在 h1 がない（#182）。修正したら fixme を外す
test.fixme("/about が表示され、h1 がある", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toHaveCount(1);
});

test("記事一覧から記事ページを開ける", async ({ page }) => {
  await page.goto("/news");
  const firstArticle = page.locator('a[href^="/news/"]').first();
  const href = await firstArticle.getAttribute("href");
  await firstArticle.click();

  await expect(page).toHaveURL(href!);
  await expect(page.locator("h1").first()).not.toBeEmpty();
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
