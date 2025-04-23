'use client';
import { useEffect, useState } from 'react';

export default function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    };

    fetchEvents();
  }, []);

  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <li key={event._id} className="border p-3 rounded shadow">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p>{event.description}</p>
          <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
