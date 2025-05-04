"use client";

export default function EditEventForm({
  form,
  setForm,
  handleChange,
  handleSubmit,
}) {
  return (
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
  );
}
