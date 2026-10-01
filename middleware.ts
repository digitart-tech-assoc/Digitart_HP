import { NextResponse } from "next/server";

import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/adminSession";

import type { NextRequest } from "next/server";

/** /admin 配下は、ログインページ以外をログイン済みの場合のみ表示する */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next();
  }

  if (!(await isAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value))) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
