'use client';

import React from 'react';

export default function EventCard({ event, onRegister, onUnregister, userEmail, provider, userRole, }) {

  const isAttending = event.attendees?.includes(userEmail);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const res = await fetch(`/api/events?id=${event._id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      alert('Event deleted');
      window.location.reload(); // quick refresh — you could also use state to update
    } else {
      alert('Failed to delete event');
    }
  }

  const handleAddToGoogleCalendar = async () => {
    try {
      const res = await fetch('/api/google/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          start: new Date(event.date).toISOString(),
          end: new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        }),
      });
  
      let data = null;
  
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }
  
      if (res.ok) {
        alert('✅ Event added to your Google Calendar!');
      } else {
        console.error('Google Calendar error:', data);
        alert(
          `❌ Failed to add event: ${data?.error || 'Unknown error'}\n\nDetails:\n${data?.detail || 'No additional info'}`
        );
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('❌ An unexpected error occurred while adding the event.');
    }
  };
  
  

  return (
    <div className="border rounded p-4 mb-4 shadow">
      <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        Date: {new Date(event.date).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
      }
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
      {provider === 'google' ? (
      <button
        onClick={handleAddToGoogleCalendar}
        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
      >
        Add to Google Calendar
      </button>
      ) : (
        <p className="text-sm text-gray-600">
          Sign in with Google to add this event to your calendar.
        </p>
      )}

      {userRole === 'staff' ? (
        <button
          onClick={handleDelete}
          className="bg-gray-700 hover:bg-gray-800 text-white py-1 px-3 rounded mt-2"
        >
          Delete Event
        </button>
      ) : null}
    </div>
  );
}
