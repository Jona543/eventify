'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users'); // Assuming you have this route
      const data = await res.json();
      setUsers(data.users);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') return <p>Loading...</p>;

  const promoteUser = async (email) => {
    const res = await fetch('/api/users/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      alert(`Promoted ${email} to staff`);
    } else {
      alert('Failed to promote user');
    }
  };

  if (session?.user?.role !== 'staff') {
    return <p>Unauthorized</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="flex justify-between items-center border p-2 rounded">
            <span>{user.email} ({user.role || 'customer'})</span>
            {user.role !== 'staff' && (
              <button
                onClick={() => promoteUser(user.email)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Promote to Staff
              </button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
