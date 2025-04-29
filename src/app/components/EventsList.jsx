"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventCard from "@/app/components/EventCard";
import { useSession } from "next-auth/react";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [error, setError] = useState(""); // Error state for user-friendly error handling
  const { data: session } = useSession();
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const url = selectedTopic
        ? `/api/events?topic=${encodeURIComponent(selectedTopic)}`
        : "/api/events";
      const res = await fetch(url);
      const data = await res.json();

      let allEvents = Array.isArray(data) ? data : data.events || [];

      if (session?.user?.email) {
        const userRes = await fetch("/api/users/events");
        const userEvents = await userRes.json();
        const registeredIds = new Set(userEvents.map((e) => e._id));

        allEvents = allEvents.map((event) => ({
          ...event,
          registered: registeredIds.has(event._id),
        }));
      }

      setEvents(allEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setError("An error occurred while fetching events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchEvents();
  }, [selectedTopic]);

  // Handle registration/unregistration without refetching events
  const handleRegister = async (eventId) => {
    const res = await fetch("/api/events/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, registered: true } // Optimistically update the event's registration state
            : event
        )
      );
    } else {
      setError("Failed to register for event.");
    }
  };

  const handleUnregister = async (eventId) => {
    const res = await fetch("/api/events/unregister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, registered: false } // Optimistically update the event's unregistration state
            : event
        )
      );
    } else {
      setError("Failed to unregister from event.");
    }
  };

  if (loading)
    return (
      <p role="status" aria-live="polite">
        Loading events, please wait...
      </p>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <div>
          <label htmlFor="topic-select" className="mr-2 font-medium">
            Filter by topic:
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 border rounded"
            aria-label="Filter events by topic"
          >
            <option value="">All</option>
            <option value="Tech">Tech</option>
            <option value="Sport">Sport</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
          </select>
        </div>
      </div>

      {/* Error message display */}
      {error && (
        <p role="alert" className="text-red-600 font-semibold">
          {error}
        </p>
      )}

      <ul className="space-y-4">
        {events.length === 0 ? (
          <li>
            <p role="status" aria-live="polite">
              No events available at the moment.
            </p>
          </li>
        ) : (
          events.map((event) => (
            <li key={event._id} aria-labelledby={`event-${event._id}`}>
              <EventCard
                event={event}
                onRegister={handleRegister}
                userEmail={session?.user?.email}
                onUnregister={handleUnregister}
                provider={
                  session?.user?.email?.endsWith("@gmail.com") ? "google" : null
                }
                userRole={session?.user?.role}
                onEdit={(event) => router.push(`/events/edit/${event._id}`)}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
