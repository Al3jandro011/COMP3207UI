'use client'

import axios from 'axios';
import { jwtVerify } from 'jose';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Register User
const registerUser = async (email, password, auth) => {
  const url =
    'https://evecs.azurewebsites.net/api/register_user?code=khEdR-2kc5k8hFYnZrFFhxjmNVH7hS5yRrFS09D-XTjdAzFuLC9ojQ==';

  const data = { email, password, auth };

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

// Login User
const loginUser = async (email, password) => {
  const url =
    `https://evecs.azurewebsites.net/api/login_user?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`;

  const data = { email, password };

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export async function getUserData() {
  const token = document.cookie.split('token=')[1]?.split(';')[0];
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function useAuth() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await getUserData();
        if (!data) {
          router.push('/');
          return;
        }
        setUserData(data);
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  return { userData, loading };
}

export { registerUser, loginUser };
