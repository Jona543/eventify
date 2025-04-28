"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventCard from "@/app/components/EventCard";
import { useSession } from "next-auth/react";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = selectedTopic
          ? `/api/events?topic=${encodeURIComponent(selectedTopic)}`
          : "/api/events";
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          console.error("Unexpected data format:", data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedTopic]);

  const handleRegister = async (eventId) => {
    const res = await fetch("/api/events/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      const url = selectedTopic
        ? `/api/events?topic=${encodeURIComponent(selectedTopic)}`
        : "/api/events";

      const updated = await fetch(url);
      const data = await updated.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        console.error("Unexpected data format after register:", data);
      }
    }
  };

  const handleUnregister = async (eventId) => {
    const res = await fetch("/api/events/unregister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      const url = selectedTopic
        ? `/api/events?topic=${encodeURIComponent(selectedTopic)}`
        : "/api/events";

      const updated = await fetch(url);
      const data = await updated.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        console.error("Unexpected data format after unregister:", data);
        setEvents([]); // fallback
      }
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by topic:</label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          <option value="Tech">Tech</option>
          <option value="Sport">Sport</option>
          <option value="Business">Business</option>
          <option value="Health">Health</option>
        </select>
      </div>

      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id}>
            <EventCard
              event={event}
              onRegister={handleRegister}
              userEmail={session?.user?.email}
              onUnregister={handleUnregister}
              provider={session?.provider}
              userRole={session?.user?.role}
              onEdit={(event) => router.push(`/events/edit/${event._id}`)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
