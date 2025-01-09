"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserDetails, updateUser, getValidGroups } from '@/services/apiServices';
import { useAuth } from '@/contexts/AuthContext';


export default function Account() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const { user, loading: authLoading } = useAuth();

  // Fetch user details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUserDetails({ user_id: user?.id });
        setUserDetails(userResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load user details');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const response = await updateUser({
        user_id: user?.id,
        email: userDetails.user.email,
        new_email: newEmail
      });
      setUpdateMessage('Email updated successfully');
      setUserDetails(prev => ({
        ...prev,
        user: { ...prev.user, email: newEmail }
      }));
      setNewEmail('');
    } catch (err) {
      console.error('Error updating email:', err);
      setUpdateMessage(err.response?.data?.error || 'Failed to update email');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');

    try {
      await updateUser({
        user_id: user?.id,
        email: userDetails.user.email,
        password: newPassword
      });
      setUpdateMessage('Password updated successfully');
      setNewPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      setUpdateMessage(err.response?.data?.error || 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    // Clear any stored user data/tokens
    localStorage.clear();
    // Redirect to home page
    router.push('/');
  };

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Current Details</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Email: {userDetails?.user?.email}
          </p>
        </div>

        {updateMessage && (
          <div className={`p-4 rounded-lg ${
            updateMessage.includes('success') 
              ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300'
          }`}>
            {updateMessage}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Your Groups
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userDetails?.user?.groups?.map((group) => (
              <div 
                key={group}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
              >
                <span className="text-gray-700 dark:text-gray-300">{group}</span>
              </div>
            )) || (
              <div className="text-gray-500 dark:text-gray-400">
                No groups assigned
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="New email address"
            />
          </div>
          <button
            type="submit"
            disabled={isUpdating || !newEmail}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Email'}
          </button>
        </form>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="New password"
            />
          </div>
          <button
            type="submit"
            disabled={isUpdating || !newPassword}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}