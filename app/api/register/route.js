// app/register/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false); // false => user, true => admin
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, auth }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg('Registration successful! You can now log in.');
        // Optionally, redirect to login
        // router.push('/');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {successMsg && <p className="text-green-500 mb-2">{successMsg}</p>}

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            className="border p-2 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="border p-2 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center space-x-2">
            <label htmlFor="auth" className="text-sm">
              Register as Admin?
            </label>
            <input
              id="auth"
              type="checkbox"
              checked={auth}
              onChange={(e) => setAuth(e.target.checked)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 underline"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
