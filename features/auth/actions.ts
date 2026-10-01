"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_HOME_PATH,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  ADMIN_SESSION_VALUE,
} from "@/lib/adminSession";

export type LoginState = {
  error: string | null;
};

/** 共有パスワードを確認し、正しければログイン状態の Cookie を発行する */
export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "サーバーで ADMIN_PASSWORD が設定されていません。" };
  }

  if (password !== adminPassword) {
    return { error: "パスワードが正しくありません。" };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });
  redirect(ADMIN_HOME_PATH);
}
