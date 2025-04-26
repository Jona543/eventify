'use client';
import { useState } from 'react';

export default function CreateEvent({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [topic, setTopic] = useState('');
  const [location, setLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [featured, setFeatured] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = new Date(date);
    const endDateObj = new Date(endDate);

    if (endDate && endDateObj < startDate) {
    alert('End date cannot be before start date.');
    return;
    }
  
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, date, endDate, location, topic, featured }),
    });
  
    if (res.ok) {
      setTitle('');
      setDescription('');
      setDate('');
      setEndDate('');
      setLocation('');
      setTopic('');
      setFeatured(false)
      setSuccessMessage('✅ Event created successfully!');
      if (onCreated) onCreated();
    } else {
      let errorData = {};
      try {
        errorData = await res.json();
      } catch (err) {
        errorData = { error: 'Unknown error (no JSON response)' };
      }
    
      console.error('Create event error:', errorData);
      alert(`❌ Failed to create event: ${errorData.error || 'Unknown error'}`);
    }
    
  };

  function toLocalDateTimeInputValue(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  
  

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      {successMessage && (
        <p className="text-green-600 font-semibold">{successMessage}</p>
      )}
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
        type="text"
        placeholder="Location"
        className="w-full p-2 border"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="datetime-local"
        className="w-full p-2 border"
        value={date}
        onChange={(e) => {
          const newStart = e.target.value;
          setDate(newStart);
        
          const newStartDate = new Date(newStart);
          const currentEndDate = new Date(endDate);
        
          if (!endDate || currentEndDate < newStartDate) {
            const oneHourLater = new Date(newStartDate.getTime() + 60 * 60 * 1000);
            setEndDate(toLocalDateTimeInputValue(oneHourLater));
          }
        }}
        
        
      />
      <input
        type="datetime-local"
        className="w-full p-2 border"
        value={endDate}
        min={date}
        onChange={(e) => setEndDate(e.target.value)}
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
