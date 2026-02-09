import React, { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import { searchPapers, summarizePaper, savePaper } from '../api/client';
import { useToast } from '../context/ToastContext';
import PaperCard from '../components/PaperCard';
import { Spinner } from '../components/Loading';
import { useNavigate } from 'react-router-dom';

export const SearchPapersPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      showToast('Please enter a search query', 'warning');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await searchPapers(query);
      setResults(response.data.papers || []);
      showToast(`Found ${response.data.papers?.length || 0} papers`, 'success');
    } catch (error) {
      console.error('Search error:', error);
      showToast('Failed to search papers', 'error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (paper) => {
    navigate('/paper-details', { state: { paper } });
  };

  const handleSummarize = async (paper) => {
    navigate('/paper-details', { state: { paper, tab: 'summary' } });
  };

  const handleSave = async (paper) => {
    try {
      await savePaper(paper);
      showToast(`Saved: ${paper.title.substring(0, 30)}...`, 'success');
    } catch (error) {
      showToast('Failed to save paper', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Search Research Papers</h1>
          <p className="text-lg opacity-90 mb-6">Discover papers from arXiv with AI-powered insights</p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., AI in cybersecurity, machine learning, quantum computing..."
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <Search size={20} />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div>
        {loading && <Spinner />}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12">
            <Zap className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <p className="text-gray-600 text-lg">No papers found for "{query}"</p>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Results ({results.length})
            </h2>
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {results.map((paper, idx) => (
                <PaperCard
                  key={idx}
                  paper={paper}
                  onView={handleView}
                  onSummarize={handleSummarize}
                  onSave={handleSave}
                />
              ))}
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center py-16">
            <Search className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <p className="text-gray-500 text-lg">Start searching for research papers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPapersPage;
