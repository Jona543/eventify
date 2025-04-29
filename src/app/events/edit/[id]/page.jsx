"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    topic: "",
    featured: false,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to load event");
        const data = await res.json();

        setEvent(data);
        setForm({
          title: data.title,
          description: data.description,
          date: new Date(data.date).toISOString().slice(0, 16),
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().slice(0, 16)
            : "",
          location: data.location,
          topic: data.topic,
          featured: data.featured ?? false,
        });
      } catch (error) {
        alert(error.message);
        router.push("/");
      }
    };

    fetchEvent();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "date") {
        const newStart = value;
        const currentEnd = prev.endDate;

        const newStartDate = new Date(newStart);
        const shouldUpdateEndDate =
          !currentEnd || new Date(currentEnd) < newStartDate;

        const oneHourLater = new Date(newStartDate.getTime() + 60 * 60 * 1000)
          .toISOString()
          .slice(0, 16);

        return {
          ...prev,
          date: newStart,
          endDate: shouldUpdateEndDate ? oneHourLater : currentEnd,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = new Date(form.date);
    const endDate = new Date(form.endDate);

    if (form.endDate && endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Event updated successfully");
      router.push("/");
    } else {
      alert("❌ Failed to update event");
    }
  };

  if (!event)
    return (
      <p role="status" aria-live="polite" className="p-6">
        Loading event...
      </p>
    );

  return (
    <main role="main" className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block font-medium mb-1">
            Start Date & Time
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block font-medium mb-1">
            End Date & Time
          </label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            value={form.endDate}
            min={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block font-medium mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="topic" className="block font-medium mb-1">
            Topic
          </label>
          <select
            id="topic"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled>
              Select a topic
            </option>
            <option value="Tech">Tech</option>
            <option value="Sport">Sport</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, featured: e.target.checked }))
            }
          />
          <label htmlFor="featured" className="text-sm">
            Mark as Featured
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
