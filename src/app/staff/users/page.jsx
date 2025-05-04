"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ManageUsers from "@/app/components/ManageUsers";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [promoting, setPromoting] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "staff") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users);
      } catch {
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
    <ManageUsers
      users={users}
      promoting={promoting}
      promoteUser={promoteUser}
      error={error}
    />
  );
}
