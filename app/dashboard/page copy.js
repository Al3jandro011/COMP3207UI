// app/dashboard/page.js
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import LogoutButton from '../../components/LogoutButton';

async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export default async function DashboardPage() {
  // Access cookies on the server side
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/');
  }

  const userData = await verifyToken(token);
  if (!userData) {
    redirect('/');
  }

  console.log('User data:', userData);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {userData.isAdmin ? (
        <h1 className="text-3xl font-bold mb-4">Welcome Admin</h1>
      ) : (
        <h1 className="text-3xl font-bold mb-4">Welcome User</h1>
      )}
      <LogoutButton />
    </div>
  );
}
