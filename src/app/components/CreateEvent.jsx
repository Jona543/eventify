"use client";
import { useState } from "react";

export default function CreateEvent({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topic, setTopic] = useState("");
  const [location, setLocation] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [featured, setFeatured] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !location || !topic) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    const startDate = new Date(date);
    const endDateObj = new Date(endDate);

    if (endDate && endDateObj < startDate) {
      setErrorMessage("End date cannot be before start date.");
      return;
    }

    setErrorMessage("");

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        date,
        endDate,
        location,
        topic,
        featured,
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setDate("");
      setEndDate("");
      setLocation("");
      setTopic("");
      setFeatured(false);
      setSuccessMessage("✅ Event created successfully!");
      if (onCreated) onCreated();
    } else {
      let errorData = {};
      try {
        errorData = await res.json();
      } catch (err) {
        errorData = { error: "Unknown error (no JSON response)" };
      }

      console.error("Create event error:", errorData);
      setErrorMessage(
        `❌ Failed to create event: ${errorData.error || "Unknown error"}`
      );
    }
  };

  function toLocalDateTimeInputValue(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-3"
      aria-labelledby="create-event-form"
    >
      <h2 id="create-event-form" className="sr-only">
        Create New Event Form
      </h2>
      {successMessage && (
        <p
          className="text-green-600 font-semibold"
          role="alert"
          aria-live="assertive"
        >
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p
          className="text-red-600 font-semibold"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </p>
      )}
      {/* Title */}
      <label htmlFor="title" className="block">
        <span className="sr-only">Event Title</span>
        <input
          type="text"
          id="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-describedby="title-error"
          required
        />
      </label>
      {/* Description */}
      <label htmlFor="description" className="block">
        <span className="sr-only">Event Description</span>
        <textarea
          id="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-describedby="description-error"
          required
        />
      </label>
      {/* Location */}
      <label htmlFor="location" className="block">
        <span className="sr-only">Event Location</span>
        <input
          type="text"
          id="location"
          placeholder="Location"
          className="w-full p-2 border rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-describedby="location-error"
          required
        />
      </label>
      {/* Date */}
      <label htmlFor="date" className="block">
        <span className="sr-only">Event Start Date</span>
        <input
          type="datetime-local"
          id="date"
          className="w-full p-2 border rounded"
          value={date}
          onChange={(e) => {
            const newStart = e.target.value;
            setDate(newStart);

            const newStartDate = new Date(newStart);
            const currentEndDate = new Date(endDate);

            if (!endDate || currentEndDate < newStartDate) {
              const oneHourLater = new Date(
                newStartDate.getTime() + 60 * 60 * 1000
              );
              setEndDate(toLocalDateTimeInputValue(oneHourLater));
            }
          }}
          required
        />
      </label>
      {/* End Date */}
      <label htmlFor="endDate" className="block">
        <span className="sr-only">Event End Date</span>
        <input
          type="datetime-local"
          id="endDate"
          className="w-full p-2 border rounded-md mb-4"
          value={endDate}
          min={date}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </label>
      {/* Topic */}
      <label htmlFor="topic" className="block">
        <span className="sr-only">Event Topic</span>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          aria-describedby="topic-error"
          required
        >
          <option value="">Select a topic</option>
          <option value="Tech">Tech</option>
          <option value="Art">Sport</option>
          <option value="Business">Business</option>
          <option value="Health">Health</option>
        </select>
      </label>
      {/* Featured checkbox */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        <span>Mark as Featured</span>
      </label>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Create Event
      </button>
    </form>
  );
}
