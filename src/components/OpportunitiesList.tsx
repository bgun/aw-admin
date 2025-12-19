import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Opportunity } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function OpportunitiesList() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const { error } = await supabase.from('opportunities').delete().eq('id', id);
      if (error) throw error;
      await loadOpportunities();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  if (loading) return <div className="p-5">Loading opportunities...</div>;
  if (error) return <div className="p-5 text-red-600">Error: {error}</div>;

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Opportunities</h1>
        <button
          onClick={() => navigate('/opportunities/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create New Opportunity
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold">Title</th>
              <th className="text-left p-3 font-semibold">Type</th>
              <th className="text-left p-3 font-semibold">Organization</th>
              <th className="text-left p-3 font-semibold">Location</th>
              <th className="text-left p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">{opportunity.title}</td>
                <td className="p-3 capitalize">{opportunity.type}</td>
                <td className="p-3">{opportunity.organization || 'N/A'}</td>
                <td className="p-3">{opportunity.location || 'N/A'}</td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/opportunities/${opportunity.id}`)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(opportunity.id)}
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

      {opportunities.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No opportunities found. Create your first opportunity!
        </div>
      )}
    </div>
  );
}
