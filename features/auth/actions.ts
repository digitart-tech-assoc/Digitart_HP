"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  clearLoginFailures,
  isLoginBlocked,
  recordLoginFailure,
} from "@/features/auth/loginRateLimit";
import { verifyPassword } from "@/features/auth/password";
import {
  ADMIN_HOME_PATH,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  isAdminSessionConfigured,
} from "@/lib/adminSession";

export type LoginState = {
  error: string | null;
};

/** 回数制限に使う、アクセス元の IP アドレス */
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  // Cloudflare が付けるヘッダーを優先する（クライアントからは上書きできない）
  return (
    headerList.get("cf-connecting-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

/** 共有パスワードを確認し、正しければログイン状態の Cookie を発行する */
export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !isAdminSessionConfigured()) {
    return {
      error: "サーバーで ADMIN_PASSWORD または ADMIN_SESSION_SECRET が設定されていません。",
    };
  }

  const ip = await getClientIp();
  if (isLoginBlocked(ip)) {
    return {
      error:
        "パスワードの入力に続けて失敗したため、一時的にログインできません。15 分ほど待ってから再度お試しください。",
    };
  }

  if (typeof password !== "string" || !(await verifyPassword(password, adminPassword))) {
    recordLoginFailure(ip);
    return { error: "パスワードが正しくありません。" };
  }

  clearLoginFailures(ip);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });
  redirect(ADMIN_HOME_PATH);
}
