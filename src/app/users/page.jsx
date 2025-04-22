'use client';

import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (data.success) setUsers(data.users);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setForm({ name: '', email: '', password: '' });
      fetchUsers();
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Create User
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="border p-2 rounded">
            {user.name} – {user.email}
          </li>
        ))}
      </ul>
    </main>
  );
}
