import { NextResponse } from "next/server";

import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/adminSession";
import { ADMIN_HEADERS } from "@/lib/securityHeaders";

import type { NextRequest } from "next/server";

/**
 * 管理画面のヘッダーを付ける。
 * @cloudflare/next-on-pages では、ミドルウェアを通るルートに next.config.ts の headers() が付かないため、ここでも付ける
 */
function withAdminHeaders(response: NextResponse): NextResponse {
  for (const { key, value } of ADMIN_HEADERS) {
    response.headers.set(key, value);
  }
  return response;
}

/** /admin 配下は、ログインページ以外をログイン済みの場合のみ表示する */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === ADMIN_LOGIN_PATH) {
    return withAdminHeaders(NextResponse.next());
  }

  if (!(await isAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value))) {
    return withAdminHeaders(NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url)));
  }

  return withAdminHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*"],
};
