import "server-only";

/** この回数だけ失敗すると、しばらくログインできなくする */
const MAX_FAILURES = 10;

/** 失敗回数を数える期間（ミリ秒）: 15 分 */
const WINDOW_MS = 15 * 60 * 1000;

/** 記録がこの件数を超えたら、期限切れのものを掃除する */
const CLEANUP_THRESHOLD = 1000;

type FailureRecord = { count: number; resetAt: number };

/**
 * IP アドレスごとのログイン失敗回数。
 * サーバーのメモリ上にあるため、インスタンスが別だったり再起動したりすると数え直しになる（ベストエフォート）。
 * 確実な制限は Cloudflare の Rate Limiting ルールで行う（docs/requirements.md の「8. セキュリティ要件」を参照）。
 */
const failures = new Map<string, FailureRecord>();

function getActiveRecord(ip: string, now: number): FailureRecord | null {
  const record = failures.get(ip);
  if (!record) return null;
  if (record.resetAt <= now) {
    failures.delete(ip);
    return null;
  }
  return record;
}

/** 失敗回数が上限に達していて、ログインを受け付けない状態か */
export function isLoginBlocked(ip: string, now: number = Date.now()): boolean {
  const record = getActiveRecord(ip, now);
  return !!record && record.count >= MAX_FAILURES;
}

/** ログインの失敗を記録する */
export function recordLoginFailure(ip: string, now: number = Date.now()): void {
  if (failures.size > CLEANUP_THRESHOLD) {
    for (const [key, record] of failures) {
      if (record.resetAt <= now) failures.delete(key);
    }
  }

  const record = getActiveRecord(ip, now);
  if (record) {
    record.count += 1;
  } else {
    failures.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }
}

/** ログインに成功したら、その IP アドレスの失敗回数を消す */
export function clearLoginFailures(ip: string): void {
  failures.delete(ip);
}
