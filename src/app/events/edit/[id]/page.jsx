"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditEventForm from "@/app/components/EditEventForm";

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
      <main role="main" className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
        <EditEventForm
          form={form}
          setForm={setForm}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </main>
    </main>
  );
}
