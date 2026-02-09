import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle, Loader, Globe, Users, Eye, Share2, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Loading';
import apiClient from '../api/client';

export const PublishPaperPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [publishedPapers, setPublishedPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    category: 'AI',
    keywords: '',
    paperUrl: '',
    paperContent: '',
    doi: '',
    publicationDate: new Date().toISOString().split('T')[0],
    affiliations: '',
    license: 'CC-BY-4.0',
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  // Load published papers on mount
  useEffect(() => {
    loadPublishedPapers();
  }, []);

  const loadPublishedPapers = async () => {
    try {
      setLoadingPapers(true);
      const response = await apiClient.get('/published-papers');
      setPublishedPapers(response.data.papers || []);
    } catch (error) {
      console.error('Error loading published papers:', error);
      setPublishedPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showToast('Please enter the paper title', 'error');
      return false;
    }
    if (!formData.abstract.trim()) {
      showToast('Please enter the abstract', 'error');
      return false;
    }
    if (!formData.authors.trim()) {
      showToast('Please enter author names', 'error');
      return false;
    }
    if (!formData.paperUrl && !formData.paperContent) {
      showToast('Please provide either a paper URL or content', 'error');
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        abstract: formData.abstract,
        authors: formData.authors.split(',').map(a => a.trim()),
        category: formData.category,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        paper_url: formData.paperUrl,
        paper_content: formData.paperContent,
        doi: formData.doi,
        publication_date: formData.publicationDate,
        affiliations: formData.affiliations,
        license: formData.license,
      };

      const response = await apiClient.post('/publish-paper', payload);
      
      setSubmitStatus({
        success: true,
        message: 'Paper published successfully!',
        paperId: response.data.paper_id,
        doiUrl: response.data.doi_url
      });
      
      showToast('Paper published successfully! 🎉', 'success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          title: '',
          abstract: '',
          authors: '',
          category: 'AI',
          keywords: '',
          paperUrl: '',
          paperContent: '',
          doi: '',
          publicationDate: new Date().toISOString().split('T')[0],
          affiliations: '',
          license: 'CC-BY-4.0',
        });
        setStep(1);
        setSubmitStatus(null);
        loadPublishedPapers();
      }, 2000);
    } catch (error) {
      console.error('Publication error:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Failed to publish paper'
      });
      showToast('Failed to publish paper', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'AI & Machine Learning',
    'Computer Vision',
    'Natural Language Processing',
    'Data Science',
    'Quantum Computing',
    'Cybersecurity',
    'Bioinformatics',
    'Other'
  ];

  const licenses = [
    { value: 'CC-BY-4.0', label: 'Creative Commons Attribution 4.0' },
    { value: 'CC-BY-SA-4.0', label: 'CC Attribution-ShareAlike 4.0' },
    { value: 'MIT', label: 'MIT License' },
    { value: 'GPL-3.0', label: 'GNU General Public License 3.0' },
    { value: 'PROPRIETARY', label: 'Proprietary' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Globe className="text-primary-600" size={40} />
          Publish Your Research
        </h1>
        <p className="text-gray-600 text-lg">Share your work with the global research community</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Publishing Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Progress Steps */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(s)}
                    className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all ${
                      step === s
                        ? 'bg-primary-600 text-white'
                        : step > s
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </button>
                  {s < 3 && (
                    <div className={`w-12 h-1 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Paper Info</span>
              <span>Content</span>
              <span>Publish</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            {/* Step 1: Paper Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Paper Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter your research paper title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Abstract *
                  </label>
                  <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleInputChange}
                    placeholder="Enter your paper abstract (250-500 words recommended)"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.abstract.length} characters
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Authors (comma-separated) *
                    </label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors}
                      onChange={handleInputChange}
                      placeholder="John Doe, Jane Smith, Dr. Robert Johnson"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    placeholder="machine learning, neural networks, deep learning"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Publication Date
                    </label>
                    <input
                      type="date"
                      name="publicationDate"
                      value={formData.publicationDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      DOI (Optional)
                    </label>
                    <input
                      type="text"
                      name="doi"
                      value={formData.doi}
                      onChange={handleInputChange}
                      placeholder="10.1234/example.doi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Affiliations
                  </label>
                  <input
                    type="text"
                    name="affiliations"
                    value={formData.affiliations}
                    onChange={handleInputChange}
                    placeholder="University of Example, Tech Institute"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Content <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Step 2: Paper Content */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Provide Paper Content</h4>
                    <p className="text-blue-800 text-sm">Either paste the paper content below or provide a URL to access it</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Paper URL
                  </label>
                  <input
                    type="url"
                    name="paperUrl"
                    value={formData.paperUrl}
                    onChange={handleInputChange}
                    placeholder="https://arxiv.org/pdf/2021.xxxxx.pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-600 mt-1">Link to your published paper PDF or online location</p>
                </div>

                <div className="text-center text-gray-500 font-semibold">OR</div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Paste Paper Content
                  </label>
                  <textarea
                    name="paperContent"
                    value={formData.paperContent}
                    onChange={handleInputChange}
                    placeholder="Paste your full paper content here... Introduction, Methodology, Results, Conclusion, etc."
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {formData.paperContent.length} characters
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Review & Publish <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Publish */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">Review Your Paper</h4>
                  <p className="text-amber-800 text-sm">Please review the information below before publishing</p>
                </div>

                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div className="border-b border-gray-300 pb-3">
                    <p className="text-xs text-gray-600">TITLE</p>
                    <p className="font-semibold text-gray-900">{formData.title || 'Not provided'}</p>
                  </div>

                  <div className="border-b border-gray-300 pb-3">
                    <p className="text-xs text-gray-600">AUTHORS</p>
                    <p className="font-semibold text-gray-900">{formData.authors || 'Not provided'}</p>
                  </div>

                  <div className="border-b border-gray-300 pb-3">
                    <p className="text-xs text-gray-600">CATEGORY</p>
                    <p className="font-semibold text-gray-900">{formData.category}</p>
                  </div>

                  <div className="border-b border-gray-300 pb-3">
                    <p className="text-xs text-gray-600">ABSTRACT</p>
                    <p className="text-gray-900">{formData.abstract.substring(0, 200)}...</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">LICENSE</p>
                    <select
                      name="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-1"
                    >
                      {licenses.map(lic => (
                        <option key={lic.value} value={lic.value}>{lic.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {submitStatus && !submitStatus.success && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Publication Error</h4>
                      <p className="text-red-800 text-sm">{submitStatus.message}</p>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Globe size={20} />
                        Publish Paper
                      </>
                    )}
                  </button>
                </div>

                {submitStatus?.success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 animate-slideUp">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">✅ Paper Published!</h4>
                      <p className="text-green-800 text-sm">Your research is now visible to the global community</p>
                      {submitStatus.doiUrl && (
                        <p className="text-green-700 text-sm mt-2 font-mono">{submitStatus.doiUrl}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Published Papers */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">Published Papers</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{publishedPapers.length} papers published</p>

            {loadingPapers ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : publishedPapers.length === 0 ? (
              <p className="text-sm text-gray-600 text-center py-8">No published papers yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {publishedPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white rounded-lg p-3 border border-gray-200 hover:border-primary-300 transition-all"
                  >
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                      {paper.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      by {paper.authors?.[0] || 'Unknown'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        {paper.category}
                      </span>
                      {paper.views && (
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {paper.views}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publishing Tips */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900 mb-4">📚 Publishing Tips</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Write a clear, concise abstract (250-500 words)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Include all relevant keywords for better discoverability</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Provide proper author attribution</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Choose an appropriate open license</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Include citations and references</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPaperPage;
