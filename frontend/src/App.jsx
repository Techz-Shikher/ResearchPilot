import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { healthCheck } from './api/client';
import { useToast } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import AvatarChatbot from './components/AvatarChatbot';
import { Toast } from './components/Loading';

// Pages
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import SearchPapersPage from './pages/SearchPapers';
import UploadPDFPage from './pages/UploadPDF';
import SavedPapersPage from './pages/SavedPapers';
import LiteratureReviewPage from './pages/LiteratureReview';
import PaperDetailsPage from './pages/PaperDetails';
import PublishPaperPage from './pages/PublishPaper';
import GeneratePaperPage from './pages/GeneratePaper';

// Styles
import './styles/globals.css';
import './styles/avatar-animations.css';

function App() {
  const { toasts } = useToast();

  useEffect(() => {
    // Check backend health on mount
    healthCheck()
      .then(() => {
        console.log('✅ Backend connected');
      })
      .catch((error) => {
        console.error('❌ Backend not available:', error);
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/my-papers" element={<UserDashboard />} />
            <Route path="/search" element={<SearchPapersPage />} />
            <Route path="/upload" element={<UploadPDFPage />} />
            <Route path="/saved" element={<SavedPapersPage />} />
            <Route path="/literature-review" element={<LiteratureReviewPage />} />
            <Route path="/paper-details" element={<PaperDetailsPage />} />
            <Route path="/publish" element={<PublishPaperPage />} />
            <Route path="/generate" element={<GeneratePaperPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Avatar Chatbot - Global */}
        <AvatarChatbot />

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
