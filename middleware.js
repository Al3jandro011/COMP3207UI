// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  console.log('Middleware - Current pathname:', pathname);

  const publicRoutes = ['/', '/login', '/register'];
  console.log('Is public route?', publicRoutes.includes(pathname));

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;
  console.log('Token present?', !!token);

  if (!token) {
    console.log('No token found, redirecting to login');
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/';
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const verified = await jwtVerify(token, secret);
    const userData = verified.payload;
    
    console.log('Token verified successfully');
    console.log('User data:', {
      email: userData.email,
      isAdmin: userData.isAdmin,
      userId: userData.userId
    });

    // Optional: Check for admin routes
    if (pathname.startsWith('/admin') && !userData.isAdmin) {
      console.log('Non-admin user attempting to access admin route');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/';
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/protected/:path*'],
};
