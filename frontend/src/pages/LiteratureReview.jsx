import React, { useState } from 'react';
import { generateLiteratureReview } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Loading';
import { BookMarked, Download } from 'lucide-react';

export const LiteratureReviewPage = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const { showToast } = useToast();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast('Please enter a topic', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await generateLiteratureReview([], topic);
      setReview(response.data);
      showToast('Literature review generated!', 'success');
    } catch (error) {
      console.error('Error generating review:', error);
      showToast('Failed to generate review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!review) return;
    
    const text = `
LITERATURE REVIEW: ${topic}
================================

INTRODUCTION
${review.introduction || 'N/A'}

KEY PAPERS
${review.key_papers?.map(p => `- ${p.title || p}`).join('\n') || 'N/A'}

RESEARCH GAPS
${review.research_gaps?.join('\n- ') || 'N/A'}

FUTURE DIRECTIONS
${review.future_directions || 'N/A'}

CONCLUSION
${review.conclusion || 'N/A'}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `literature-review-${topic.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Generate Literature Review</h1>
        <p className="text-gray-600">Create a comprehensive literature review on any topic</p>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-3">Research Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Machine Learning in Healthcare, Quantum Computing Applications..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-secondary-600 hover:bg-secondary-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              Generating...
            </>
          ) : (
            <>
              <BookMarked size={20} />
              Generate Review
            </>
          )}
        </button>
      </form>

      {/* Review Output */}
      {review && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Literature Review: {topic}</h2>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
            >
              <Download size={16} />
              Download
            </button>
          </div>

          {review.introduction && (
            <section>
              <h3 className="text-xl font-bold mb-3">Introduction</h3>
              <p className="text-gray-700 leading-relaxed">{review.introduction}</p>
            </section>
          )}

          {review.key_papers && (
            <section>
              <h3 className="text-xl font-bold mb-3">Key Papers</h3>
              <ul className="space-y-2">
                {review.key_papers.map((paper, idx) => (
                  <li key={idx} className="text-gray-700">
                    {typeof paper === 'string' ? paper : paper.title}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {review.research_gaps && (
            <section>
              <h3 className="text-xl font-bold mb-3">Research Gaps</h3>
              <ul className="space-y-2">
                {review.research_gaps.map((gap, idx) => (
                  <li key={idx} className="text-gray-700 flex gap-2">
                    <span className="text-primary-600">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {review.future_directions && (
            <section>
              <h3 className="text-xl font-bold mb-3">Future Directions</h3>
              <p className="text-gray-700 leading-relaxed">{review.future_directions}</p>
            </section>
          )}

          {review.conclusion && (
            <section>
              <h3 className="text-xl font-bold mb-3">Conclusion</h3>
              <p className="text-gray-700 leading-relaxed">{review.conclusion}</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default LiteratureReviewPage;
