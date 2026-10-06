import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  isAdminSession,
  isAdminSessionConfigured,
} from "@/lib/adminSession";

const SECRET = "x".repeat(32);

describe("管理画面のセッショントークン", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_SESSION_SECRET", SECRET);
    vi.stubEnv("ADMIN_PASSWORD", "password");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("発行したトークンは有効期限内なら有効", async () => {
    const now = Date.now();
    const token = await createAdminSessionToken(now);
    expect(await isAdminSession(token, now)).toBe(true);
    expect(await isAdminSession(token, now + (ADMIN_SESSION_MAX_AGE - 1) * 1000)).toBe(true);
  });

  it("有効期限を過ぎたトークンは無効", async () => {
    const now = Date.now();
    const token = await createAdminSessionToken(now);
    expect(await isAdminSession(token, now + ADMIN_SESSION_MAX_AGE * 1000)).toBe(false);
  });

  it("期限や署名を書き換えたトークンは無効", async () => {
    const token = await createAdminSessionToken();
    const [version, expires, signature] = token.split(".");
    const longer = `${version}.${Number(expires) + 3600}.${signature}`;
    // 末尾の文字は base64 の余りのビットを含み、変えても同じバイト列になることがあるため、先頭の文字を変える
    const flipped = `${version}.${expires}.${signature.startsWith("A") ? "B" : "A"}${signature.slice(1)}`;

    expect(await isAdminSession(longer)).toBe(false);
    expect(await isAdminSession(flipped)).toBe(false);
  });

  it("パスワードをローテーションすると、発行済みのトークンは無効になる", async () => {
    const token = await createAdminSessionToken();
    vi.stubEnv("ADMIN_PASSWORD", "rotated");
    expect(await isAdminSession(token)).toBe(false);
  });

  it.each([undefined, "", "admin_auth=true", "v1.abc.def", "v1.1.!!!", "v1.9999999999.a"])(
    "形式が不正な Cookie（%s）は無効で、例外も投げない",
    async (value) => {
      expect(await isAdminSession(value)).toBe(false);
    },
  );

  it("秘密鍵が短いか未設定なら、ログインできない状態にする", async () => {
    const token = await createAdminSessionToken();
    vi.stubEnv("ADMIN_SESSION_SECRET", "short");
    expect(isAdminSessionConfigured()).toBe(false);
    expect(await isAdminSession(token)).toBe(false);
    await expect(createAdminSessionToken()).rejects.toThrow();
  });
});
