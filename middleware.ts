import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We only protect /admin and its subroutes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If it's the login page, let them through
    if (request.nextUrl.pathname === '/admin/news/login') {
      return NextResponse.next();
    }

    const authCookie = request.cookies.get('admin_auth');
    
    // If not authenticated, redirect to login
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/news/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
