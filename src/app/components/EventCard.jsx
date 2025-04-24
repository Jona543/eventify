'use client';

import React from 'react';

export default function EventCard({ event, onRegister, onUnregister, userEmail }) {
  const isAttending = event.attendees?.includes(userEmail);

  return (
    <div className="border rounded p-4 mb-4 shadow">
      <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        Date: {new Date(event.date).toLocaleDateString()}
      </p>

      {userEmail && !isAttending && (
        <button
          onClick={() => onRegister(event._id)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          Register
        </button>
      )}

      {userEmail && isAttending && (
        <button
          onClick={() => onUnregister(event._id)}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Unregister
        </button>
      )}
    </div>
  );
}
