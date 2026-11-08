import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/adminSession";

/** ログインしていなければ、ログインページへ移動させる。ログインページ以外の /admin 配下のページで呼ぶ */
export async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  if (!(await isAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value))) {
    redirect(ADMIN_LOGIN_PATH);
  }
}
