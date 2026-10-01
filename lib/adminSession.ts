/**
 * 管理画面のログイン状態（Cookie）に関する定数と判定。
 * ミドルウェア・ログイン処理・記事投稿処理で同じ判定を使うため、ここで一元管理する。
 */

/** ログイン状態を保持する Cookie の名前 */
export const ADMIN_SESSION_COOKIE = "admin_auth";

/** ログイン時に Cookie に保存する値 */
export const ADMIN_SESSION_VALUE = "true";

/** ログイン状態の有効期間（秒）: 1 週間 */
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** ログインページのパス */
export const ADMIN_LOGIN_PATH = "/admin/news/login";

/** ログイン後に移動するパス */
export const ADMIN_HOME_PATH = "/admin/news/new";

/** Cookie の値がログイン済みを表すかどうか */
export function isAdminSession(cookieValue: string | undefined): boolean {
  return cookieValue === ADMIN_SESSION_VALUE;
}
