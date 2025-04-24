'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <div className="text-xl font-bold">
        <Link href="/">Eventify</Link>
      </div>

      <div className="flex gap-4 items-center">
        <Link href="/">Home</Link>      
        {role === 'staff' && <Link href="/events/create">Create Event</Link>}
        {role === 'staff' && <Link href="/staff/users">Manage Users</Link>}
        
        {session?.user ? (
          <>
            <span className="text-sm text-gray-600">
              {session.user.name || session.user.email}
            </span>
            <Link href="/account">Account</Link>
            <button
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className="text-blue-600">Sign In</Link>
            <Link href="/signup" className="text-blue-600">Create Account</Link>
          </>
        )}
      </div>
    </nav>
  );
}
