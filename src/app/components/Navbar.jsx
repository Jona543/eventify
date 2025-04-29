"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <nav
      aria-label="Main Navigation"
      className="flex justify-between items-center p-4 bg-gray-100 shadow"
    >
      <div className="flex gap-4 items-center">
        <div className="text-xl font-bold">
          <Link href="/" aria-label="Go to homepage">
            Eventify
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="/" aria-label="Go to the homepage">
            Home
          </Link>
          {role === "staff" && (
            <Link href="/events/create" aria-label="Create a new event">
              Create Event
            </Link>
          )}
          {role === "staff" && (
            <Link href="/staff/users" aria-label="Manage users">
              Manage Users
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        {session?.user ? (
          <>
            <span className="text-sm text-gray-600" aria-live="polite">
              {session.user.name || session.user.email}
            </span>
            <Link href="/account" aria-label="Go to account page">
              Account
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="bg-red-500 text-white px-3 py-1 rounded"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className="text-blue-600"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-blue-600"
              aria-label="Create a new account"
            >
              Create Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
