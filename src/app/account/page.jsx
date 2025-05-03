"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import UserEventList from "@/app/components/UserEventList";
import AccountSettings from "@/app/components/AccountSettings"; // Import the new AccountSettings component

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // State for handling deletion process
  const router = useRouter();

  const passwordMessageRef = useRef(null);

  const handleChangePassword = async (oldPassword, newPassword) => {
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

        <AccountSettings
          onChangePassword={handleChangePassword}
          onDeleteAccount={handleDeleteAccount}
          message={message}
          setMessage={setMessage}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
      </div>

      <UserEventList />
    </>
  );
}
