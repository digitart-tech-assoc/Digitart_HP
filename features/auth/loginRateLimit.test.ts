import { describe, expect, it } from "vitest";

import {
  clearLoginFailures,
  isLoginBlocked,
  recordLoginFailure,
} from "@/features/auth/loginRateLimit";

const MINUTE = 60 * 1000;

/** 記録はモジュール内に残るため、テストごとに別の IP アドレスを使う */
function fail(ip: string, times: number, now: number) {
  for (let i = 0; i < times; i++) recordLoginFailure(ip, now);
}

describe("ログイン失敗の回数制限", () => {
  it("9 回の失敗までは受け付け、10 回目で止める", () => {
    const now = Date.now();
    fail("203.0.113.1", 9, now);
    expect(isLoginBlocked("203.0.113.1", now)).toBe(false);

    recordLoginFailure("203.0.113.1", now);
    expect(isLoginBlocked("203.0.113.1", now)).toBe(true);
  });

  it("別の IP アドレスの失敗は数えない", () => {
    const now = Date.now();
    fail("203.0.113.2", 10, now);
    expect(isLoginBlocked("203.0.113.3", now)).toBe(false);
  });

  it("最初の失敗から 15 分たつと、また受け付ける", () => {
    const now = Date.now();
    fail("203.0.113.4", 10, now);
    expect(isLoginBlocked("203.0.113.4", now + 15 * MINUTE - 1)).toBe(true);
    expect(isLoginBlocked("203.0.113.4", now + 15 * MINUTE)).toBe(false);
  });

  it("ログインに成功したら、失敗の回数を消す", () => {
    const now = Date.now();
    fail("203.0.113.5", 10, now);
    clearLoginFailures("203.0.113.5");
    expect(isLoginBlocked("203.0.113.5", now)).toBe(false);
  });
});
