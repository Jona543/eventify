"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      alert("Account created. You can now sign in.");
      router.push("/signin");
    } else {
      setErrorMsg(data.error || "Registration failed.");
    }
  };

  return (
    <main role="main" className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      <form onSubmit={handleRegister} className="space-y-4 mb-6" noValidate>
        {errorMsg && (
          <p
            className="text-red-600 text-sm"
            role="alert"
            aria-live="assertive"
          >
            {errorMsg}
          </p>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Create Account
        </button>
      </form>

      <div className="text-center mb-4 text-gray-500">or</div>

      <button
        onClick={() => signIn("google")}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
      >
        Sign up with Google
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <a
          href="/signin"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Sign in
        </a>
      </p>
    </main>
  );
}
