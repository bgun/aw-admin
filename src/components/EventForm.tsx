import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Event } from '../lib/supabase';
import { ScraperTool } from './ScraperTool';

export function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    end_date: '',
    location: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    venue: '',
    format: '',
    cost: '',
    organizer: '',
    category: '',
    image_url: '',
    source_url: '',
    slug: '',
    tags: [] as string[],
  });

  useEffect(() => {
    if (id && id !== 'new') {
      loadEvent(parseInt(id));
    }
  }, [id]);

  async function loadEvent(eventId: number) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          event_date: data.event_date || '',
          event_time: data.event_time || '',
          end_date: data.end_date || '',
          location: data.location || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          postal_code: data.postal_code || '',
          venue: data.venue || '',
          format: data.format || '',
          cost: data.cost || '',
          organizer: data.organizer || '',
          category: data.category || '',
          image_url: data.image_url || '',
          source_url: data.source_url || '',
          slug: data.slug || '',
          tags: data.tags || [],
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate content hash from source URL and title
      const contentString = `${formData.source_url}-${formData.title}`;
      const content_hash = btoa(contentString).substring(0, 64);

      // Convert empty strings to null for nullable fields
      const dataToSave = {
        title: formData.title,
        description: formData.description || null,
        event_date: formData.event_date || null,
        event_time: formData.event_time || null,
        end_date: formData.end_date || null,
        location: formData.location || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        postal_code: formData.postal_code || null,
        venue: formData.venue || null,
        format: formData.format || null,
        cost: formData.cost || null,
        organizer: formData.organizer || null,
        category: formData.category || null,
        image_url: formData.image_url || null,
        source_url: formData.source_url,
        content_hash: content_hash,
        slug: formData.slug || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
      };

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('events')
          .update(dataToSave)
          .eq('id', parseInt(id));

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert([dataToSave]);

        if (error) {
          console.error('Supabase error:', error);
          console.error('Data being sent:', dataToSave);
          throw error;
        }
      }

      navigate('/events');
    } catch (err) {
      console.error('Full error:', err);
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof typeof formData, value: string | string[]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleScrapedData(data: Partial<typeof formData>) {
    setFormData((prev) => ({ ...prev, ...data }));
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{id && id !== 'new' ? 'Edit Event' : 'Create Event'}</h1>

      <ScraperTool type="event" onDataScraped={handleScrapedData} />

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Event Date</label>
            <input
              type="text"
              value={formData.event_date}
              onChange={(e) => handleChange('event_date', e.target.value)}
              placeholder="YYYY-MM-DD"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Event Time</label>
            <input
              type="text"
              value={formData.event_time}
              onChange={(e) => handleChange('event_time', e.target.value)}
              placeholder="HH:MM"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>End Date</label>
          <input
            type="text"
            value={formData.end_date}
            onChange={(e) => handleChange('end_date', e.target.value)}
            placeholder="YYYY-MM-DD"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Format</label>
          <input
            type="text"
            value={formData.format}
            onChange={(e) => handleChange('format', e.target.value)}
            placeholder="e.g., in-person, virtual, hybrid"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Organizer</label>
          <input
            type="text"
            value={formData.organizer}
            onChange={(e) => handleChange('organizer', e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Cost</label>
          <input
            type="text"
            value={formData.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            placeholder="e.g., Free, $25, $10-$50"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => handleChange('image_url', e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            required
            placeholder="unique-event-identifier"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            placeholder="workshop, technology, free"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Source URL</label>
          <input
            type="url"
            value={formData.source_url}
            onChange={(e) => handleChange('source_url', e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Raw Source Text</label>
          <textarea
            value={formData.raw_source_text}
            onChange={(e) => handleChange('raw_source_text', e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
            {loading ? 'Saving...' : 'Save Event'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/events')}
            style={{ padding: '10px 20px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
