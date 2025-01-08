// app/api/login/route.js
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { loginUser } from '@/utils/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Call your existing login function
    const loginResponse = await loginUser(email, password);
    console.log('Login response:', loginResponse);

    if (loginResponse.result) {
      // Create JWT token with auth status
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ 
        userId: loginResponse.id,
        email,
        isAdmin: loginResponse.auth // Include auth status in token
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secret);

      // Set the cookie
      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 // 24 hours
      });

      return NextResponse.json({
        message: 'Login successful',
        data: {
          ...loginResponse,
          isAdmin: loginResponse.auth // Include in response as well
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
