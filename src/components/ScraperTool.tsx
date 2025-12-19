import { useState } from 'react';

interface ScraperToolProps {
  type: 'event' | 'opportunity';
  onDataScraped: (data: any) => void;
}

export function ScraperTool({ type, onDataScraped }: ScraperToolProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleScrape() {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to scrape URL');
      }

      onDataScraped(data);
      setUrl('');
    } catch (err) {
      console.error('Scraping error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-5">
      <h3 className="mt-0 text-lg font-semibold">Auto-fill from URL</h3>
      <p className="text-sm text-gray-600 mb-3">
        Paste a URL to automatically extract {type} information using AI
      </p>

      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`https://example.com/${type}-page`}
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleScrape}
          disabled={loading || !url.trim()}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Scraping...' : 'Scrape & Fill'}
        </button>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-100 text-red-800 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
