'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return setMessage('New passwords do not match');
    }

    const res = await fetch('/api/account/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(data.success ? 'Password changed' : data.error);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirmDelete) return;

    const res = await fetch('/api/account/delete', {
      method: 'DELETE',
    });

    const data = await res.json();
    if (data.success) {
      await signOut({ callbackUrl: '/' });
    } else {
      setMessage(data.error || 'Something went wrong');
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status !== 'authenticated') {
    router.push('/signin');
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-xl font-semibold mb-4">Account Settings</h1>
      <p className="mb-4">Logged in as: <strong>{session.user.email}</strong></p>

      <div className="mb-6">
        <h2 className="font-medium mb-2">Change Password</h2>
        <input
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={handleChangePassword}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Change Password
        </button>
      </div>

      <div>
        <h2 className="font-medium mb-2 text-red-600">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Delete Account
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
