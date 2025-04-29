"use client";

import React, { useState } from "react";

export default function EventCard({
  event,
  onRegister,
  onUnregister,
  userEmail,
  provider,
  userRole,
  onEdit,
}) {
  const [eventAddedToCalendar, setEventAddedToCalendar] = useState(false);

  const isAttending = event.registered;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const res = await fetch(`/api/events?id=${event._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("Event deleted");
      window.location.reload(); // quick refresh — you could also use state to update
    } else {
      alert("Failed to delete event");
    }
  };

  const handleAddToGoogleCalendar = async () => {
    try {
      const res = await fetch("/api/google/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          start: new Date(event.date).toISOString(),
          end: event.endDate
            ? new Date(event.endDate).toISOString()
            : new Date(
                new Date(event.date).getTime() + 60 * 60 * 1000
              ).toISOString(), // fallback to 1 hour later
        }),
      });

      let data = null;

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok || res.status === 409) {
        setEventAddedToCalendar(true);
        if (res.status === 409) {
          alert("⚠️ This event is already in your calendar.");
        } else {
          alert("✅ Event added to your Google Calendar!");
        }
      } else {
        console.error("Google Calendar error:", data);
        alert(
          `❌ Failed to add event: ${
            data?.error || "Unknown error"
          }\n\nDetails:\n${data?.detail || "No additional info"}`
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("❌ An unexpected error occurred while adding the event.");
    }
  };

  return (
    <article
      className="relative border rounded p-4 pt-8 pb-8 mb-4 shadow flex flex-col"
      aria-labelledby={`event-${event._id}`}
    >
      <h2 id={`event-${event._id}`} className="sr-only">
        Event: {event.title}
      </h2>

      {userRole === "staff" && (
        <div className="absolute top-2 right-2 flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(event)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-0.5 px-2 rounded text-xs"
              aria-label={`Edit ${event.title} event`}
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-gray-700 hover:bg-gray-800 text-white py-0.5 px-2 rounded text-xs"
            aria-label={`Delete ${event.title} event`}
          >
            Delete
          </button>
        </div>
      )}

      <section>
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{event.location}</p>
        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          {(() => {
            const start = new Date(event.date);
            const end = event.endDate ? new Date(event.endDate) : null;

            const sameDay =
              end &&
              start.getFullYear() === end.getFullYear() &&
              start.getMonth() === end.getMonth() &&
              start.getDate() === end.getDate();

            if (end && sameDay) {
              return `Date: ${start.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })} | ${start.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${end.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}`;
            } else if (end) {
              return `Starts: ${start.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}\nEnds: ${end.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}`;
            } else {
              return `Date: ${start.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}`;
            }
          })()}
        </p>
        <p className="mb-2">Topic: {event.topic}</p>
      </section>

      <div className="absolute bottom-2 right-2 flex gap-2">
        {userEmail && !isAttending && (
          <button
            onClick={() => onRegister(event._id)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-0.5 px-2 rounded text-sm"
            aria-label={`Register for ${event.title}`}
          >
            Register
          </button>
        )}

        {userEmail && isAttending && (
          <button
            onClick={() => onUnregister(event._id)}
            className="bg-red-500 hover:bg-red-600 text-white py-0.5 px-2 rounded text-sm"
            aria-label={`Unregister from ${event.title}`}
          >
            Unregister
          </button>
        )}

        {provider === "google" && !eventAddedToCalendar && (
          <button
            onClick={handleAddToGoogleCalendar}
            className="bg-green-500 hover:bg-green-600 text-white py-0.5 px-2 rounded text-sm"
            aria-label={`Add ${event.title} to Google Calendar`}
          >
            Add to Google Calendar
          </button>
        )}
      </div>

      {provider === "google" && eventAddedToCalendar && (
        <p className="text-green-600 font-medium mt-2" aria-live="polite">
          ✅ Event already added
        </p>
      )}

      {!provider && (
        <p className="text-sm text-gray-600 mt-2" aria-live="polite">
          Sign in with Google to add this event to your calendar.
        </p>
      )}
    </article>
  );
}
