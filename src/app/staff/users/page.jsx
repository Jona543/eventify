"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [promoting, setPromoting] = useState("");

  // Redirect unauthorized users
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "staff") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const promoteUser = async (email) => {
    setPromoting(email);
    setError("");
    try {
      const res = await fetch("/api/staff/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.email === email ? { ...user, role: "staff" } : user
          )
        );
      } else {
        setError("Failed to promote user.");
      }
    } catch {
      setError("Failed to promote user.");
    } finally {
      setPromoting("");
    }
  };

  if (status === "loading") return <p className="p-6">Loading...</p>;

  if (session?.user?.role !== "staff") {
    return <p className="p-6 text-red-600">Unauthorized</p>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {error && (
        <p className="text-red-600 mb-4" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <ul className="space-y-4" aria-label="User list">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center border p-4 rounded-md shadow-sm bg-white"
          >
            <div className="text-sm">
              <p className="font-medium">{user.email}</p>
              <p className="text-gray-600 text-xs">{user.role || "customer"}</p>
            </div>

            {user.role !== "staff" ? (
              <button
                onClick={() => promoteUser(user.email)}
                disabled={promoting === user.email}
                className={`px-3 py-1 rounded-md text-white text-sm ${
                  promoting === user.email
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {promoting === user.email ? "Promoting..." : "Promote to Staff"}
              </button>
            ) : (
              <span className="text-green-600 text-sm font-semibold">
                Staff
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
