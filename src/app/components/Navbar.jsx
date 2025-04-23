'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <div className="text-xl font-bold">
        <Link href="/">Eventify</Link>
      </div>

      <div className="flex gap-4 items-center">
        <Link href="/">Home</Link>
        <Link href="/users">Users</Link>
        <Link href="/events">Events</Link>

        {session?.user?.role === 'staff' && (
          <Link href="/admin/users" className="px-4 py-2">Admin</Link>
        )}


        {session?.user ? (
          <>
            <span className="text-sm text-gray-600">
              {session.user.name || session.user.email}
            </span>
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
            <Link href="/signup" className="text-blue-600">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
