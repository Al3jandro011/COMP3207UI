'use client';
import { useState, useEffect } from 'react';
import { getAccountDetails, updateUser } from '@/services/apiServices';

export default function Account() {
    const [userDetails, setUserDetails] = useState(null);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const testUserId = '44c55031-8c44-480b-9fb4-fbd842c0f153';

            const response = await getAccountDetails({ user_id: testUserId });
            console.log(response);
            setUserDetails(response.data.user);
            setNewEmail(response.data.user.email); // Pre-fill current email
        } catch (err) {
            setError('Failed to load user details');
            console.error('Error fetching user details:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(null);

        try {
            const testUserId = '44c55031-8c44-480b-9fb4-fbd842c0f153';

            const updateData = {
                user_id: testUserId
            };

            // Only include fields that have been changed
            if (newEmail !== userDetails.email) {
                updateData.new_email = newEmail;
            }
            if (newPassword) {
                updateData.password = newPassword;
            }

            // Only make the API call if there are changes
            if (Object.keys(updateData).length > 1) { // > 1 because user_id is always included
                await updateUser(updateData);
                setMessage('Account details updated successfully');
                setNewPassword(''); // Clear password field
                fetchUserDetails(); // Refresh user details
            } else {
                setMessage('No changes to update');
            }
        } catch (err) {
            setError('Failed to update account details');
            console.error('Error updating user details:', err);
        }
    };

    const handleLogout = () => {
        // Clear any stored user data/tokens
        localStorage.clear();
        // Redirect to home page
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="text-red-500 dark:text-red-400">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Account Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account details</p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                {userDetails && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Current Account Details</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Email: <span className="text-gray-900 dark:text-gray-100">{userDetails.email}</span>
                        </p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            New Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            placeholder="Enter new email"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            placeholder="Enter new password (optional)"
                        />
                    </div>

                    {/* Status Messages */}
                    {message && (
                        <div className="text-green-500 dark:text-green-400 text-sm">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
                    >
                        Update Account Details
                    </button>
                </form>

                {/* Add divider */}
                <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}