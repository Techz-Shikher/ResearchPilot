import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, Bookmark, Lightbulb } from 'lucide-react';
import SearchBar, { SearchResults } from '../components/SearchBar';
import PDFUpload from '../components/PDFUpload';
import { paperAPI } from '../api/client';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [savedPapers, setSavedPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    loadSavedPapers();
  }, []);

  const loadSavedPapers = async () => {
    try {
      const response = await paperAPI.getSavedPapers();
      setSavedPapers(response.data.papers || []);
    } catch (err) {
      console.error('Failed to load saved papers:', err);
    }
  };

  const handleSavePaper = async (paper) => {
    try {
      await paperAPI.savePaper({
        paper_id: paper.paper_id || paper.arxiv_id,
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        url: paper.arxiv_url || paper.pdf_url,
        published_date: paper.published_date,
      });
      alert('Paper saved successfully!');
      loadSavedPapers();
    } catch (err) {
      alert('Failed to save paper: ' + err.message);
    }
  };

  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
  };

  const handleUploadSuccess = (uploadData) => {
    setSelectedPaper({
      paper_id: uploadData.paper_id,
      title: 'Uploaded PDF',
      authors: [],
      abstract: 'Locally uploaded paper',
      text: uploadData.text,
      page_count: uploadData.page_count,
      is_uploaded: true,
    });
    alert('PDF uploaded successfully!');
  };

  const tabs = [
    {
      id: 'search',
      label: 'Search Papers',
      icon: BookOpen,
      description: 'Find papers from arXiv',
    },
    {
      id: 'upload',
      label: 'Upload PDF',
      icon: Upload,
      description: 'Upload your own papers',
    },
    {
      id: 'saved',
      label: 'Saved Papers',
      icon: Bookmark,
      description: `Your library (${savedPapers.length})`,
    },
    {
      id: 'literature',
      label: 'Literature Review',
      icon: Lightbulb,
      description: 'Generate reviews',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card p-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <h1 className="text-4xl font-bold mb-2">ResearchPilot AI</h1>
        <p className="text-lg opacity-90">
          Your intelligent research companion for discovering, analyzing, and understanding academic papers
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className={`h-6 w-6 mx-auto mb-2 ${
                activeTab === tab.id ? 'text-primary-600' : 'text-slate-600'
              }`} />
              <p className={`text-sm font-semibold ${
                activeTab === tab.id ? 'text-primary-600' : 'text-slate-700'
              }`}>
                {tab.label}
              </p>
              <p className="text-xs text-slate-500 mt-1">{tab.description}</p>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <SearchBar onResults={setSearchResults} onPaperSelect={handlePaperSelect} />
          {searchResults.length > 0 && (
            <SearchResults
              results={searchResults}
              onPaperSelect={handlePaperSelect}
              onSavePaper={handleSavePaper}
            />
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="card p-8">
          <PDFUpload onSuccess={handleUploadSuccess} />
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          {savedPapers.length > 0 ? (
            <div className="grid gap-4">
              {savedPapers.map((paper) => (
                <div
                  key={paper.paper_id}
                  onClick={() => handlePaperSelect(paper)}
                  className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="font-bold text-slate-900">{paper.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {paper.authors.slice(0, 3).join(', ')}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Saved: {new Date(paper.saved_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Bookmark className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No saved papers yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'literature' && (
        <LiteratureReviewTab />
      )}
    </div>
  );
}

function LiteratureReviewTab() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);

  const generateReview = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const response = await paperAPI.generateLiteratureReview(topic, 5);
      setReview(response.data.review);
    } catch (err) {
      alert('Failed to generate literature review: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={generateReview} className="card p-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Research Topic
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'Deep Learning in Medical Imaging'"
            className="input flex-1"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            Generate
          </button>
        </div>
      </form>

      {review && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {review.topic}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {review.introduction}
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Papers</h3>
            <div className="space-y-4">
              {review.papers.map((paper, idx) => (
                <div key={idx} className="border-l-4 border-primary-600 pl-4">
                  <p className="font-semibold text-slate-900">{paper.title}</p>
                  <p className="text-sm text-slate-600">{paper.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Research Gaps
            </h3>
            <ul className="space-y-2">
              {review.research_gaps.map((gap, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span className="text-slate-700">{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Conclusion
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {review.conclusion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
