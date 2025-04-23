'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.success) {
      alert('Account created. You can now sign in.');
      router.push('/signin');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={handleRegister} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Create Account
        </button>
      </form>

      <div className="text-center mb-4">or</div>

      <button
        onClick={() => signIn('google')}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
      >
        Sign up with Google
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <a href="/signin" className="text-blue-600 underline">
          Sign in
        </a>
      </p>
    </main>
  );
}
