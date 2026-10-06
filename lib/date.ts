/**
 * 日本時間での今日の日付を `YYYY-MM-DD` で返す。
 * ビルド環境（UTC）と閲覧者の端末のどちらで実行しても、サークルの予定と同じ日本時間で比べられるようにする。
 */
export function todayInTokyo(now: Date = new Date()): string {
  // sv-SE ロケールは日付を YYYY-MM-DD 形式で出力する
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);
}
