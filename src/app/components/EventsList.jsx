"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventCard from "@/app/components/EventCard";
import { useSession } from "next-auth/react";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const url = selectedTopic
        ? `/api/events?topic=${encodeURIComponent(selectedTopic)}`
        : "/api/events";

      console.log("Fetching events from:", url);

      const fetches = [fetch(url)];
      let userEventsData = [];

      if (session?.user?.email) {
        fetches.push(fetch("/api/users/events"));
      }

      const [res, userRes] = await Promise.all(fetches);

      const data = await res.json();
      console.log("API Response:", data);

      let allEvents = data.success ? data.data || [] : [];
      console.log("Parsed events:", allEvents);

      if (session?.user?.email && userRes) {
        const userResponse = await userRes.json();
        console.log("User events response:", userResponse);
        if (userResponse.success && Array.isArray(userResponse.data)) {
          userEventsData = userResponse.data;
        }
      }

      const registeredIds = new Set(userEventsData.map((e) => e._id));

      allEvents = allEvents.map((event) => ({
        ...event,
        registered: registeredIds.has(event._id),
      }));

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
    fetchEvents();
  }, [selectedTopic, session]);

  const handleRegister = async (eventId) => {
    const res = await fetch("/api/events/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, registered: true } : event
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
          event._id === eventId ? { ...event, registered: false } : event
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
      {/* Login message for non-logged-in users */}
      {!session && (
        <p className="mt-4 text-center text-gray-600">
          Log in to register for events.
        </p>
      )}

      {/* Error message display */}
      {error && (
        <p role="alert" className="text-red-600 font-semibold">
          {error}
        </p>
      )}

      {/* If no events are available */}
      {events.length === 0 ? (
        <p>No events available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} aria-labelledby={`event-${event._id}`}>
              <EventCard
                event={event}
                onRegister={session ? handleRegister : null}
                userEmail={session?.user?.email}
                onUnregister={handleUnregister}
                provider={
                  session?.user?.email?.endsWith("@gmail.com") ? "google" : null
                }
                userRole={session?.user?.role}
                onEdit={(event) => router.push(`/events/edit/${event._id}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
