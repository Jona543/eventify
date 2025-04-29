"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import UserEventList from "@/app/components/UserEventList";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // State for handling deletion process
  const router = useRouter();

  const passwordMessageRef = useRef(null);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return setMessage("New passwords do not match");
    }

    const res = await fetch("/api/account/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(data.success ? "Password changed" : data.error);
    passwordMessageRef.current?.focus(); // Ensure focus is on the message
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true); // Show loading state for deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmDelete) {
      setIsDeleting(false);
      return;
    }

    const res = await fetch("/api/account/delete", {
      method: "DELETE",
    });

    const data = await res.json();
    setIsDeleting(false);

    if (data.success) {
      await signOut({ callbackUrl: "/" });
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status !== "authenticated") {
    router.push("/signin");
    return null;
  }

  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-xl font-semibold mb-4">Account Settings</h1>
        <p className="mb-4">
          Logged in as: <strong>{session.user.email}</strong>
        </p>

        <div className="mb-6">
          <h2 className="font-medium mb-2">Change Password</h2>
          <label htmlFor="oldPassword" className="sr-only">
            Old password
          </label>
          <input
            id="oldPassword"
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            aria-labelledby="oldPassword"
          />
          <label htmlFor="newPassword" className="sr-only">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            aria-labelledby="newPassword"
          />
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            aria-labelledby="confirmPassword"
          />
          <button
            onClick={handleChangePassword}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            aria-live="assertive"
            aria-label="Change Password"
          >
            Change Password
          </button>
        </div>

        <div>
          <h2 className="font-medium mb-2 text-red-600">Danger Zone</h2>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            aria-live="assertive"
            aria-label="Delete Account"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>

        {message && (
          <p
            ref={passwordMessageRef}
            className="mt-4 text-sm text-gray-700"
            role="alert"
            aria-live="assertive"
          >
            {message}
          </p>
        )}
      </div>
      <UserEventList />
    </>
  );
}
