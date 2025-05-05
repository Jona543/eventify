"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";

const AccountSettings = ({
  onChangePassword,
  onDeleteAccount,
  message,
  setMessage,
  isDeleting,
  setIsDeleting,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const passwordMessageRef = useRef(null);

  const handleChangePassword = () => {
    if (newPassword.trim() !== confirmPassword.trim()) {
      return setMessage("New passwords do not match");
    }
    onChangePassword(oldPassword, newPassword);
    passwordMessageRef.current?.focus();
  };

  const handleDeleteAccount = () => {
    onDeleteAccount();
  };

  const isCredentialsUser = session?.provider === "credentials";

  return (
    <div className="mb-6">
      {isCredentialsUser ? (
        <>
          <h2 className="font-medium mb-2">Change Password</h2>
          <input
            id="oldPassword"
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            id="newPassword"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleChangePassword}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Change Password
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-700">
          You are signed in with Google. Password change is not available.
        </p>
      )}

      <div className="mt-6">
        <h2 className="font-medium mb-2 text-red-600">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
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
  );
};

export default AccountSettings;
