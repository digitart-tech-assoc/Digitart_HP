import "server-only";

const encoder = new TextEncoder();

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

/**
 * 入力されたパスワードが正しいかを、定数時間で比較する。
 * 文字列を直接 === で比べると、一致した文字数によって処理時間が変わり、推測の手がかりになるため。
 * 先に SHA-256 にそろえることで、長さの違いも処理時間に表れないようにする。
 */
export async function verifyPassword(input: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(input), sha256(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}
