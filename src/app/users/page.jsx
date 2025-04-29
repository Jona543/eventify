"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) setUsers(data.users);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      setStatusMsg("User created successfully");
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } else {
      setStatusMsg(data.error || "Failed to create user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-6"
        aria-labelledby="create-user-form"
      >
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Create User
        </button>
        <p
          aria-live="polite"
          className="text-sm text-green-600 mt-1 min-h-[1rem]"
        >
          {statusMsg}
        </p>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="border p-2 rounded bg-white">
            <span className="block font-medium">{user.name}</span>
            <span className="text-sm text-gray-600">{user.email}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
