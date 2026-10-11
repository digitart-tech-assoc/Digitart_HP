/**
 * 日本時間での今日の日付を `YYYY-MM-DD` で返す。
 * ビルド環境（UTC）と閲覧者の端末のどちらで実行しても、サークルの予定と同じ日本時間で比べられるようにする。
 */
export function todayInTokyo(now: Date = new Date()): string {
  // sv-SE ロケールは日付を YYYY-MM-DD 形式で出力する
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);
}

const DAY_MS = 24 * 60 * 60 * 1000;
// 日本時間は UTC+9 で、夏時間がないため常に一定
const TOKYO_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 日本時間で次に日付が変わるまでのミリ秒数を返す */
export function msUntilNextDayInTokyo(now: Date = new Date()): number {
  return DAY_MS - ((now.getTime() + TOKYO_OFFSET_MS) % DAY_MS);
}

/** `YYYY-MM-DD` の日付に日数を足した日付を `YYYY-MM-DD` で返す */
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
