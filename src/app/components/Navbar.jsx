'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="font-bold text-xl">Eventify</Link>
      <div className="space-x-4">
        <Link href="/events">Events</Link>
        <Link href="/users">Users</Link>
        {!session ? (
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        ) : (
          <SignOutButton />
        )}
      </div>
    </nav>
  );
}
