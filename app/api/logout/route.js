// app/api/logout/route.js
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST() {
  const serializedCookie = cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // Expire the cookie immediately
  });

  const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  response.headers.set('Set-Cookie', serializedCookie);

  return response;
}
