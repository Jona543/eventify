import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  console.log('🔐 Middleware token:', token);
  console.log('🔗 Path:', path);

  const isProtectedEventRoute = path === '/events/create';
  const isAdminRoute = path.startsWith('/staff');

  if (isProtectedEventRoute) {
    if (!token || token.role !== 'staff') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (isAdminRoute && token?.role !== 'staff') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/staff/:path*', '/events/create'],
};
