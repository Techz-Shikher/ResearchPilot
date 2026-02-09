import React, { useState, useEffect } from 'react';
import { getSavedPapers } from '../api/client';
import { useToast } from '../context/ToastContext';
import PaperCard from '../components/PaperCard';
import { Spinner } from '../components/Loading';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SavedPapersPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedPapers();
  }, []);

  const loadSavedPapers = async () => {
    try {
      const response = await getSavedPapers();
      const papersArray = Object.entries(response.data.papers || {}).map(([id, data]) => ({
        id,
        ...data,
      }));
      setPapers(papersArray);
    } catch (error) {
      console.error('Error loading saved papers:', error);
      showToast('Failed to load saved papers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (paper) => {
    navigate('/paper-details', { state: { paper } });
  };

  const handleSummarize = (paper) => {
    navigate('/paper-details', { state: { paper, tab: 'summary' } });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Saved Papers</h1>
        <p className="text-gray-600">Your personal research library</p>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <BookOpen className="mx-auto w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">No saved papers yet</p>
          <p className="text-gray-500">Start by searching for papers</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Papers ({papers.length})
          </h2>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {papers.map((paper, idx) => (
              <PaperCard
                key={idx}
                paper={paper}
                onView={handleView}
                onSummarize={handleSummarize}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPapersPage;
