import React from 'react';
import { BookOpen, Clock, User, ExternalLink, Download } from 'lucide-react';

export const PaperCard = ({ paper, onView, onSummarize, onSave }) => {
  const handleView = () => {
    onView?.(paper);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-6 overflow-hidden">
      {/* Paper Info */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
          {paper.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {paper.authors && paper.authors.slice(0, 2).map((author, idx) => (
            <span key={idx} className="text-sm text-gray-600">
              {author}
            </span>
          ))}
          {paper.authors?.length > 2 && (
            <span className="text-sm text-gray-500">+{paper.authors.length - 2} more</span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {new Date(paper.published_date).toLocaleDateString()}
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3">
          {paper.abstract}
        </p>
      </div>

      {/* Categories */}
      {paper.categories && (
        <div className="flex flex-wrap gap-2 mb-4">
          {paper.categories.slice(0, 3).map((cat, idx) => (
            <span key={idx} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleView}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          View
        </button>
        <button
          onClick={() => onSummarize?.(paper)}
          className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Summarize
        </button>
        <button
          onClick={() => onSave?.(paper)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PaperCard;
