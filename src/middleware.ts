import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'changeme');

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public assets and static files
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') || 
    pathname.includes('/favicon.ico') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Define public routes
  const isPublicRoute = 
    pathname === '/' ||
    pathname === '/auth/login' ||
    pathname === '/auth/register' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/accommodation') || 
    pathname.startsWith('/car') ||
    pathname.startsWith('/consultant') ||
    pathname.startsWith('/api/consultants') ||
    pathname.startsWith('/events') ||
    pathname.startsWith('/partners');

  const token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.replace('Bearer ', '');

  if (isPublicRoute) {
    if (token && (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/')) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = (payload.role as string) || 'user';
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      } catch (err) {
        // Invalid token, just proceed to public route
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = (payload.role as string) || 'user';
    const userId = payload.userId as string;

    // Redirect /dashboard to role-specific dashboard
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    }

    // RBAC: Admin isolation
    if (pathname.startsWith('/api/admin') && !['admin', 'super_admin'].includes(role)) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    if (pathname.startsWith('/admin') && !['admin', 'super_admin'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard/user', req.url));
    }

    // Role specific dashboards
    if (pathname.startsWith('/dashboard/super_admin') && role !== 'super_admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (pathname.startsWith('/dashboard/admin') && !['admin', 'super_admin'].includes(role)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Vendor specific paths (Now accessible by standard users)
    if (pathname.startsWith('/api/vendor') && !['user', 'admin', 'super_admin'].includes(role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (pathname.startsWith('/vendor') && !['user', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard/user', req.url));
    }

    // Add user info to headers for downstream routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-role', role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.error('Middleware JWT Error:', err);
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
