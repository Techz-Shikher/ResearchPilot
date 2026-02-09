import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  BookmarkCheck,
  TrendingUp,
  Clock,
  Download,
  Trash2,
  Eye,
  Plus,
  Settings,
  LogOut,
  Share2,
  Edit,
  Search,
  Filter,
  Calendar,
  User,
  Award,
  Zap,
  Mail,
  X,
  Send,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [papers, setPapers] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [stats, setStats] = useState({
    papersGenerated: 12,
    papersSaved: 28,
    totalViews: 245,
    weeklyActivity: 7,
    averageLength: 3500,
  });

  // Mock user data
  useEffect(() => {
    const mockUser = {
      name: 'Dr. Alex Chen',
      email: 'alex.chen@research.edu',
      affiliation: 'MIT Computer Science',
      avatar: '🧑‍🔬',
      joinDate: 'January 2024',
      totalReputation: 450,
    };
    setUserProfile(mockUser);

    // Mock papers data
    const mockPapers = [
      {
        id: 'ai_1707234567890_1234',
        title: 'Machine Learning in Healthcare: A Comprehensive Survey',
        topic: 'Deep Learning for Disease Diagnosis',
        createdDate: '2026-02-08',
        words: 4200,
        sections: 6,
        status: 'completed',
        views: 45,
        downloads: 12,
        style: 'Comprehensive',
      },
      {
        id: 'ai_1707134567890_5678',
        title: 'Quantum Error Correction in NISQ Devices',
        topic: 'Error Mitigation Strategies',
        createdDate: '2026-02-06',
        words: 3800,
        sections: 5,
        status: 'completed',
        views: 28,
        downloads: 8,
        style: 'Technical',
      },
      {
        id: 'ai_1707034567890_9012',
        title: 'Transformer Models in Natural Language Processing',
        topic: 'Evolution of NLP Architecture',
        createdDate: '2026-02-04',
        words: 5200,
        sections: 8,
        status: 'completed',
        views: 92,
        downloads: 24,
        style: 'Comprehensive',
      },
      {
        id: 'ai_1706934567890_3456',
        title: 'Blockchain Applications Beyond Cryptocurrency',
        topic: 'Enterprise Blockchain Solutions',
        createdDate: '2026-02-02',
        words: 3600,
        sections: 5,
        status: 'draft',
        views: 12,
        downloads: 3,
        style: 'General',
      },
      {
        id: 'ai_1706834567890_7890',
        title: 'Climate Change Mitigation Strategies',
        topic: 'Renewable Energy Integration',
        createdDate: '2026-01-30',
        words: 4100,
        sections: 6,
        status: 'completed',
        views: 67,
        downloads: 19,
        style: 'Comprehensive',
      },
    ];
    setPapers(mockPapers);
  }, []);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || paper.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDeletePaper = (paperId) => {
    setPapers(papers.filter(p => p.id !== paperId));
    showToast('Paper deleted successfully', 'success');
  };

  const handleDownloadPaper = (paper) => {
    showToast(`Downloading "${paper.title}"...`, 'success');
    // Implementation would go here
  };

  const openEmailShare = (paper) => {
    setSelectedPaper(paper);
    setRecipientEmail('');
    setShareMessage(`Check out this interesting paper: "${paper.title}"`);
    setShowEmailModal(true);
  };

  const handleEmailShare = async (e) => {
    e.preventDefault();
    
    if (!recipientEmail || !recipientEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSending(true);
    try {
      const emailPayload = {
        to: recipientEmail,
        paper: selectedPaper.title,
        topic: selectedPaper.topic,
        message: shareMessage,
        sender: userProfile?.name || 'ResearchPilot User',
        senderEmail: userProfile?.email || 'noreply@researchpilot.com',
        paperLink: `/paper/${selectedPaper.id}`,
      };

      // Call backend API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/share-paper-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to share paper');
      }
      
      const result = await response.json();
      showToast(`Paper shared with ${recipientEmail}!`, 'success');
      setShowEmailModal(false);
      setRecipientEmail('');
      setShareMessage('');
    } catch (error) {
      showToast(error.message || 'Failed to share paper. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const EmailShareModal = () => {
    if (!showEmailModal || !selectedPaper) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail size={24} />
              <h2 className="text-xl font-bold">Share Paper via Email</h2>
            </div>
            <button
              onClick={() => setShowEmailModal(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleEmailShare} className="p-6 space-y-4">
            {/* Paper Info */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">Paper</p>
              <p className="font-bold text-gray-900">{selectedPaper.title}</p>
              <p className="text-xs text-gray-600 mt-1">{selectedPaper.topic}</p>
            </div>

            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Recipient Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="colleague@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Message (optional)
              </label>
              <textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 font-bold hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
            <TrendingUp size={16} /> {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );

  const PaperCard = ({ paper }) => (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all p-6 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              paper.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
            </div>
            <span className="text-xs text-gray-500 font-semibold">{paper.style}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {paper.title}
          </h3>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-4 text-center">
        <div className="bg-blue-50 rounded-lg p-2">
          <div className="text-sm font-bold text-blue-600">{paper.words}</div>
          <div className="text-xs text-gray-600">Words</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2">
          <div className="text-sm font-bold text-purple-600">{paper.sections}</div>
          <div className="text-xs text-gray-600">Sections</div>
        </div>
        <div className="bg-cyan-50 rounded-lg p-2">
          <div className="text-sm font-bold text-cyan-600">{paper.views}</div>
          <div className="text-xs text-gray-600">Views</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <div className="text-sm font-bold text-green-600">{paper.downloads}</div>
          <div className="text-xs text-gray-600">Downloads</div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          {new Date(paper.createdDate).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <FileText size={16} />
          {paper.topic}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => navigate(`/paper/${paper.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg font-semibold transition-colors text-sm"
        >
          <Eye size={16} /> View
        </button>
        <button
          onClick={() => handleDownloadPaper(paper)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition-colors text-sm"
        >
          <Download size={16} /> Download
        </button>
        <button
          onClick={() => openEmailShare(paper)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg font-semibold transition-colors text-sm"
        >
          <Share2 size={16} /> Share
        </button>
        <button
          onClick={() => handleDeletePaper(paper.id)}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition-colors text-sm ml-auto"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Email Share Modal */}
      <EmailShareModal />
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Top Row - Profile Info & Badge */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-5xl border-2 border-white/30 shadow-lg">
                {userProfile?.avatar}
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl font-black mb-2 drop-shadow-lg">{userProfile?.name}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <Award size={18} className="text-yellow-300" />
                  <span className="font-semibold text-white/90">Reputation Score: {userProfile?.totalReputation}</span>
                </div>
                <p className="text-white/85 text-base font-semibold mb-1">🎓 {userProfile?.affiliation}</p>
                <p className="text-white/70 text-sm">📅 Member since {userProfile?.joinDate}</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex flex-col items-center gap-2">
              <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-xl border border-white/30 text-center">
                <div className="text-sm font-bold opacity-90">Premium Member</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Quick Statistics Row */}
          <div className="grid grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/20">
            <div className="text-center hover:bg-white/10 p-3 rounded-lg transition-all">
              <div className="text-2xl font-black drop-shadow">{stats.papersGenerated}</div>
              <div className="text-xs opacity-90 font-semibold">Generated Papers</div>
            </div>
            <div className="text-center hover:bg-white/10 p-3 rounded-lg transition-all">
              <div className="text-2xl font-black drop-shadow">{stats.papersSaved}</div>
              <div className="text-xs opacity-90 font-semibold">Saved Papers</div>
            </div>
            <div className="text-center hover:bg-white/10 p-3 rounded-lg transition-all">
              <div className="text-2xl font-black drop-shadow">{stats.totalViews}</div>
              <div className="text-xs opacity-90 font-semibold">Total Views</div>
            </div>
            <div className="text-center hover:bg-white/10 p-3 rounded-lg transition-all">
              <div className="text-2xl font-black drop-shadow">{stats.weeklyActivity}</div>
              <div className="text-xs opacity-90 font-semibold">This Week</div>
            </div>
            <div className="text-center hover:bg-white/10 p-3 rounded-lg transition-all">
              <div className="text-2xl font-black drop-shadow">{stats.averageLength.toLocaleString()}</div>
              <div className="text-xs opacity-90 font-semibold">Avg Words/Paper</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs - Enhanced */}
      <div className="flex gap-1 border-b-2 border-gray-200 overflow-x-auto bg-white rounded-t-xl px-4 pt-4">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'papers', label: 'My Papers', icon: FileText },
          { id: 'saved', label: 'Saved Papers', icon: BookmarkCheck },
          { id: 'activity', label: 'Activity', icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all relative group whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-primary-700'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
            
            {/* Active indicator line */}
            {activeTab === tab.id && (
              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                icon={FileText}
                label="Papers Generated"
                value={stats.papersGenerated}
                color="from-blue-500 to-cyan-500"
                trend="+2 this week"
              />
              <StatCard
                icon={BookmarkCheck}
                label="Papers Saved"
                value={stats.papersSaved}
                color="from-green-500 to-emerald-500"
                trend="+5 this week"
              />
              <StatCard
                icon={Eye}
                label="Total Views"
                value={stats.totalViews}
                color="from-purple-500 to-pink-500"
                trend="+28 this week"
              />
              <StatCard
                icon={Download}
                label="Downloads"
                value={papers.reduce((sum, p) => sum + p.downloads, 0)}
                color="from-orange-500 to-red-500"
                trend="+12 this week"
              />
              <StatCard
                icon={Zap}
                label="Avg. Length"
                value={`${Math.round(stats.averageLength / 100)}0 words`}
                color="from-indigo-500 to-purple-500"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Papers</h2>
            <div className="grid grid-cols-1 gap-4">
              {papers.slice(0, 3).map(paper => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/generate')}
              className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 group"
            >
              <Plus size={32} className="mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Generate New Paper</div>
              <div className="text-sm opacity-90">Create with AI assistance</div>
            </button>
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 group"
            >
              <Search size={32} className="mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Search Papers</div>
              <div className="text-sm opacity-90">Find research papers</div>
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 group"
            >
              <Edit size={32} className="mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Upload Paper</div>
              <div className="text-sm opacity-90">Add your own PDF</div>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'papers' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Papers</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredPapers.length > 0 ? (
              filteredPapers.map(paper => (
                <PaperCard key={paper.id} paper={paper} />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No papers found</p>
                <button
                  onClick={() => navigate('/generate')}
                  className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700"
                >
                  Generate Your First Paper
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <BookmarkCheck size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Your saved papers will appear here</p>
          <button
            onClick={() => navigate('/search')}
            className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700"
          >
            Start Searching Papers
          </button>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          {[
            { action: 'Generated', paper: 'Machine Learning in Healthcare', time: '2 hours ago' },
            { action: 'Downloaded', paper: 'Transformer Models in NLP', time: '1 day ago' },
            { action: 'Published', paper: 'Quantum Error Correction', time: '3 days ago' },
            { action: 'Generated', paper: 'Blockchain Applications', time: '5 days ago' },
            { action: 'Saved', paper: 'Deep Learning Survey', time: '1 week ago' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className={`w-3 h-3 rounded-full ${
                activity.action === 'Generated' ? 'bg-green-500' :
                activity.action === 'Downloaded' ? 'bg-blue-500' :
                activity.action === 'Published' ? 'bg-purple-500' :
                'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {activity.action} <span className="text-primary-600">{activity.paper}</span>
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <Clock size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
