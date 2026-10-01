/**
 * 管理画面のログイン状態（Cookie）に関する定数と、セッショントークンの発行・検証。
 * ミドルウェア・ログイン処理・記事投稿処理で同じ判定を使うため、ここで一元管理する。
 *
 * トークンは `v1.<有効期限(UNIX秒)>.<HMAC-SHA256 署名>` の形式。
 * 署名鍵は ADMIN_SESSION_SECRET と ADMIN_PASSWORD から作るため、
 * パスワードをローテーションすると発行済みのセッションはすべて無効になる。
 * Edge Runtime（ミドルウェア）でも動くよう、Node.js の crypto ではなく Web Crypto を使う。
 */

/** ログイン状態を保持する Cookie の名前 */
export const ADMIN_SESSION_COOKIE = "admin_auth";

/** ログイン状態の有効期間（秒）: 1 週間 */
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** ログインページのパス */
export const ADMIN_LOGIN_PATH = "/admin/news/login";

/** ログイン後に移動するパス */
export const ADMIN_HOME_PATH = "/admin/news/new";

/** 推測されにくさを保つため、ADMIN_SESSION_SECRET に求める最低の長さ */
const MIN_SECRET_LENGTH = 32;

const TOKEN_VERSION = "v1";

const encoder = new TextEncoder();

/** ADMIN_SESSION_SECRET と ADMIN_PASSWORD が使える状態かどうか */
export function isAdminSessionConfigured(): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return !!secret && secret.length >= MIN_SECRET_LENGTH && !!process.env.ADMIN_PASSWORD;
}

/** 署名鍵を作る。設定が足りないときは null（＝誰もログインできない状態にする） */
async function getSigningKey(): Promise<CryptoKey | null> {
  if (!isAdminSessionConfigured()) {
    return null;
  }
  // NUL で区切り、secret と password の境目をずらした別の組み合わせが同じ鍵にならないようにする
  const material = `${process.env.ADMIN_SESSION_SECRET}\0${process.env.ADMIN_PASSWORD}`;
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(material),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return null;
  }
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** ログイン成功時に Cookie に保存するトークンを作る */
export async function createAdminSessionToken(now: number = Date.now()): Promise<string> {
  const key = await getSigningKey();
  if (!key) {
    throw new Error("ADMIN_SESSION_SECRET または ADMIN_PASSWORD が設定されていません。");
  }
  const expiresAt = Math.floor(now / 1000) + ADMIN_SESSION_MAX_AGE;
  const payload = `${TOKEN_VERSION}.${expiresAt}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

/** Cookie の値が、改ざんされておらず有効期限内のトークンかどうか */
export async function isAdminSession(
  cookieValue: string | undefined,
  now: number = Date.now(),
): Promise<boolean> {
  if (!cookieValue) {
    return false;
  }

  const parts = cookieValue.split(".");
  if (parts.length !== 3 || parts[0] !== TOKEN_VERSION) {
    return false;
  }

  const expiresAt = Number(parts[1]);
  if (!/^\d+$/.test(parts[1]) || expiresAt * 1000 <= now) {
    return false;
  }

  const signature = fromBase64Url(parts[2]);
  const key = await getSigningKey();
  if (!signature || !key) {
    return false;
  }

  // crypto.subtle.verify は署名を定数時間で比較する
  return crypto.subtle.verify("HMAC", key, signature, encoder.encode(`${parts[0]}.${parts[1]}`));
}
