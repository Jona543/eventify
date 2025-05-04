"use client";

export default function ManageUsers({ users, promoting, promoteUser, error }) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
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
    </div>
  );
}
