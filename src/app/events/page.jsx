'use client';

import { useEffect, useState } from 'react';

export default function EventsPage() {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '' });
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    if (data.success) setEvents(data.events);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setForm({ title: '', description: '', date: '', location: '' });
      fetchEvents();
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border p-2"
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
          Create Event
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Events</h2>
      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event._id} className="border p-2 rounded">
            <strong>{event.title}</strong><br />
            {new Date(event.date).toLocaleDateString()} – {event.location}
          </li>
        ))}
      </ul>
    </main>
  );
}
