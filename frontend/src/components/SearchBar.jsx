import React, { useState } from 'react';
import { Search, Loader, Download, BookmarkPlus } from 'lucide-react';
import { paperAPI } from '../api/client';

export default function SearchBar({ onResults, onPaperSelect }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await paperAPI.searchPapers(query, 20);
      onResults(response.data.results || []);
    } catch (err) {
      setError('Failed to search papers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search arXiv (e.g., 'AI in cybersecurity', 'machine learning')"
            className="input pl-10 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary min-w-fit"
        >
          {loading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            'Search'
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export function SearchResults({ results, onPaperSelect, onSavePaper }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">
        Search Results ({results.length})
      </h3>

      <div className="grid gap-4">
        {results.map((paper) => (
          <div
            key={paper.paper_id}
            className="card p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => onPaperSelect(paper)}
          >
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 hover:text-primary-600 transition-colors">
                  {paper.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {paper.authors.slice(0, 3).join(', ')}
                  {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
                </p>
              </div>

              <p className="text-sm text-slate-700 line-clamp-3">
                {paper.abstract}
              </p>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs text-slate-500">
                  {new Date(paper.published_date).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <a
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn btn-outline text-sm px-3 py-1"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSavePaper(paper);
                    }}
                    className="btn btn-secondary text-sm px-3 py-1"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
