import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Event } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      await loadEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  if (loading) return <div className="p-5">Loading events...</div>;
  if (error) return <div className="p-5 text-red-600">Error: {error}</div>;

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Events</h1>
        <button
          onClick={() => navigate('/events/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create New Event
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold">Title</th>
              <th className="text-left p-3 font-semibold">Date</th>
              <th className="text-left p-3 font-semibold">City</th>
              <th className="text-left p-3 font-semibold">Organizer</th>
              <th className="text-left p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">{event.title}</td>
                <td className="p-3">{event.event_date || 'N/A'}</td>
                <td className="p-3">{event.city || 'N/A'}</td>
                <td className="p-3">{event.organizer || 'N/A'}</td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {events.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No events found. Create your first event!
        </div>
      )}
    </div>
  );
}
