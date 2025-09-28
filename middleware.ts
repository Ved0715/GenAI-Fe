import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_INTERNAL_URL || 'http://localhost:8000';

async function checkAuthentication(request: NextRequest): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get('cookie');

    if (!cookieHeader) {
      return false;
    }

    const response = await fetch(`${FASTAPI_URL}/api/v1/auth/me`, {
      headers: {
        'Cookie': cookieHeader,
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define route patterns
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname === '/dashboard';
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname.startsWith('/auth/');
  const isApiRoute = pathname.startsWith('/api/');

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    isApiRoute ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check authentication status
  const isAuthenticated = await checkAuthentication(request);

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect dashboard routes - redirect unauthenticated users to login
  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};