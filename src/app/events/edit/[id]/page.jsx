'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    topic: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error('Failed to load event');
        const data = await res.json();
  
        setEvent(data);
        setForm({
          title: data.title,
          description: data.description,
          date: new Date(data.date).toISOString().slice(0, 16), // For datetime-local input
          location: data.location,
          topic: data.topic,
        });
      } catch (error) {
        alert(error.message);
        router.push('/');
      }
    };
  
    fetchEvent();
  }, [id, router]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      alert('✅ Event updated successfully');
      router.push('/'); // or the event detail page
    } else {
      alert('❌ Failed to update event');
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
          required
        />
        <select
  name="topic"
  value={form.topic}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  required
>
  <option value="" disabled>Select a topic</option>
  <option value="Tech">Tech</option>
  <option value="Sport">Sport</option>
  <option value="Business">Business</option>
  <option value="Health">Health</option>
</select>


        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </main>
  );
}
