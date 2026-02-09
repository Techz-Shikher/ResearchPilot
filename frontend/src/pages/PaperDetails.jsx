import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { summarizePaper, getRecommendations, askQuestion } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Spinner, LoadingCard } from '../components/Loading';
import ChatBox from '../components/ChatBox';
import PaperCard from '../components/PaperCard';
import { ArrowLeft, ExternalLink, Download } from 'lucide-react';

export const PaperDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'details');
  const [paper, setPaper] = useState(location.state?.paper);
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingRec, setLoadingRec] = useState(false);

  useEffect(() => {
    if (paper) {
      if (activeTab === 'summary' && !summary) {
        loadSummary();
      }
      if (activeTab === 'recommendations' && recommendations.length === 0) {
        loadRecommendations();
      }
    }
  }, [activeTab, paper]);

  const loadSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await summarizePaper(
        paper.id || paper.paper_id,
        paper.abstract || paper.text || paper.summary || 'Research paper',
        paper.title
      );
      setSummary(response.data);
    } catch (error) {
      console.error('Summary error:', error);
      showToast('Failed to generate summary', 'error');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleAskQuestion = (paperId, question) => {
    return askQuestion(
      paperId,
      question,
      paper.abstract || paper.text || paper.summary || 'Research paper'
    );
  };

  const loadRecommendations = async () => {
    setLoadingRec(true);
    try {
      const response = await getRecommendations(
        paper.id || paper.paper_id,
        paper.abstract || paper.text || paper.summary || 'Research paper',
        paper.title
      );
      setRecommendations(response.data.recommendations || response.data.similar_papers || []);
    } catch (error) {
      console.error('Recommendations error:', error);
      showToast('Failed to load recommendations', 'error');
    } finally {
      setLoadingRec(false);
    }
  };

  if (!paper) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">No paper selected</p>
        <button
          onClick={() => navigate('/search')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Go back to search
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: '📄' },
    { id: 'summary', label: 'Summary', icon: '✨' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'recommendations', label: 'Similar Papers', icon: '🔗' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <h1 className="text-3xl font-bold mb-2">{paper.title}</h1>
        <div className="flex flex-wrap gap-3">
          {paper.authors?.map((author, idx) => (
            <span key={idx} className="text-gray-600">{author}</span>
          ))}
        </div>
      </div>

      {/* Meta Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-gray-600 text-sm">Published</p>
          <p className="font-semibold">{new Date(paper.published_date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Categories</p>
          <div className="flex flex-wrap gap-2">
            {paper.categories?.slice(0, 2).map((cat, idx) => (
              <span key={idx} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                {cat}
              </span>
            ))}
          </div>
        </div>
        <div>
          {paper.url && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              <ExternalLink size={16} />
              View PDF
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Abstract</h3>
              <p className="text-gray-700 leading-relaxed">{paper.abstract}</p>
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            {loadingSummary ? (
              <LoadingCard />
            ) : summary ? (
              <div className="grid gap-4">
                {summary.summary && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold mb-3">Summary</h3>
                    <p className="text-gray-700">{summary.summary}</p>
                  </div>
                )}
                {summary.key_contributions && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold mb-3">Key Contributions</h3>
                    <ul className="space-y-2">
                      {summary.key_contributions.map((contrib, idx) => (
                        <li key={idx} className="flex gap-2 text-gray-700">
                          <span className="text-primary-600">•</span>
                          {contrib}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {summary.methodology && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold mb-3">Methodology</h3>
                    <p className="text-gray-700">{summary.methodology}</p>
                  </div>
                )}
                {summary.limitations && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold mb-3">Limitations</h3>
                    <p className="text-gray-700">{summary.limitations}</p>
                  </div>
                )}
                {summary.future_scope && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold mb-3">Future Scope</h3>
                    <p className="text-gray-700">{summary.future_scope}</p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={loadSummary}
                className="w-full bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Generate Summary
              </button>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="h-96">
            <ChatBox paperId={paper.id || paper.paper_id} onAsk={handleAskQuestion} />
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            {loadingRec ? (
              <Spinner />
            ) : recommendations.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-bold mb-2">{rec.title}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Similarity: {(rec.similarity * 100).toFixed(0)}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600"
                          style={{ width: `${rec.similarity * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recommendations available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperDetailsPage;
