import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Opportunity } from '../lib/supabase';
import { ScraperTool } from './ScraperTool';

export function OpportunityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'volunteer',
    organization: '',
    location: '',
    format: '',
    commitment: '',
    requirements: '',
    application_deadline: '',
    posted_date: '',
    compensation: '',
    raw_source_text: '',
    source_url: '',
    slug: '',
    tags: [] as string[],
  });

  useEffect(() => {
    if (id && id !== 'new') {
      loadOpportunity(parseInt(id));
    }
  }, [id]);

  async function loadOpportunity(opportunityId: number) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', opportunityId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          type: data.type || 'volunteer',
          organization: data.organization || '',
          location: data.location || '',
          format: data.format || '',
          commitment: data.commitment || '',
          requirements: data.requirements || '',
          application_deadline: data.application_deadline || '',
          posted_date: data.posted_date || '',
          compensation: data.compensation || '',
          raw_source_text: data.raw_source_text || '',
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
      const contentString = `${formData.source_url || ''}-${formData.title}`;
      const content_hash = btoa(contentString).substring(0, 64);

      // Convert empty strings to null for nullable fields
      const dataToSave = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        organization: formData.organization || null,
        location: formData.location || null,
        format: formData.format || null,
        commitment: formData.commitment || null,
        requirements: formData.requirements || null,
        application_deadline: formData.application_deadline || null,
        posted_date: formData.posted_date || null,
        compensation: formData.compensation || null,
        raw_source_text: formData.raw_source_text || null,
        source_url: formData.source_url || null,
        content_hash: content_hash,
        slug: formData.slug,
        tags: formData.tags.length > 0 ? formData.tags : null,
        updated_at: new Date().toISOString(),
      };

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('opportunities')
          .update(dataToSave)
          .eq('id', parseInt(id));

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('opportunities')
          .insert([dataToSave]);

        if (error) throw error;
      }

      navigate('/opportunities');
    } catch (err) {
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
      <h1>{id && id !== 'new' ? 'Edit Opportunity' : 'Create Opportunity'}</h1>

      <ScraperTool type="opportunity" onDataScraped={handleScrapedData} />

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
          <label style={{ display: 'block', marginBottom: '5px' }}>Type *</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="volunteer">Volunteer</option>
            <option value="job">Job</option>
          </select>
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

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Organization</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
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
          <select
            value={formData.format}
            onChange={(e) => handleChange('format', e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select format</option>
            <option value="remote">Remote</option>
            <option value="in-person">In-person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Commitment</label>
          <input
            type="text"
            value={formData.commitment}
            onChange={(e) => handleChange('commitment', e.target.value)}
            placeholder="e.g., part-time, full-time, one-time, ongoing"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Requirements</label>
          <textarea
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Application Deadline</label>
            <input
              type="text"
              value={formData.application_deadline}
              onChange={(e) => handleChange('application_deadline', e.target.value)}
              placeholder="YYYY-MM-DD"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Posted Date</label>
            <input
              type="text"
              value={formData.posted_date}
              onChange={(e) => handleChange('posted_date', e.target.value)}
              placeholder="YYYY-MM-DD"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Compensation</label>
          <input
            type="text"
            value={formData.compensation}
            onChange={(e) => handleChange('compensation', e.target.value)}
            placeholder="For jobs: salary info; For volunteer: unpaid or benefits"
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
            placeholder="unique-opportunity-identifier"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            placeholder="volunteer, technology, remote"
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
            {loading ? 'Saving...' : 'Save Opportunity'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/opportunities')}
            style={{ padding: '10px 20px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
