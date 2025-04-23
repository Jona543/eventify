'use client';
import { useState } from 'react';

export default function CreateEvent({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, date }),
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      setDate('');
      setTopic('');
      if (onCreated) onCreated();
    } else {
      alert('Failed to create event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 border"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        className="w-full p-2 border"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select a topic</option>
        <option value="Tech">Tech</option>
        <option value="Art">Sport</option>
        <option value="Business">Business</option>
        <option value="Health">Health</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Create Event
      </button>
    </form>
  );
}
