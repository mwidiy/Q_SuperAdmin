import { NextResponse } from 'next/server';

export function proxy(request) {
  const session = request.cookies.get('super_admin_session')?.value;
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedPath && session !== 'authenticated') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access login page while authenticated
  if (request.nextUrl.pathname === '/' && session === 'authenticated') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/'],
};
