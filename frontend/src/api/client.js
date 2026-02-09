import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const paperAPI = {
  // Search papers from arXiv
  searchPapers: (query, maxResults = 20) =>
    apiClient.post('/search', { 
      query: query,
      max_results: maxResults
    }),

  // Upload PDF
  uploadPDF: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Summarize paper
  summarizePaper: (paperId, text, title) =>
    apiClient.post('/summarize', {
      paper_id: paperId,
      text: text,
      title: title,
    }),

  // Ask question about paper (RAG)
  askQuestion: (paperId, question, text) =>
    apiClient.post('/ask', {
      paper_id: paperId,
      question: question,
      text: text,
    }),

  // Save paper to library
  savePaper: (paperData) =>
    apiClient.post('/save', {
      paper_id: paperData.paper_id,
      title: paperData.title,
      authors: paperData.authors,
      abstract: paperData.abstract,
      url: paperData.url,
      published_date: paperData.published_date,
    }),

  // Get saved papers
  getSavedPapers: () =>
    apiClient.get('/saved'),

  // Get uploaded files list
  listUploads: () =>
    apiClient.get('/uploads'),

  // Get upload file info
  getUploadInfo: (filename) =>
    apiClient.get(`/uploads/info/${encodeURIComponent(filename)}`),

  // Delete uploaded file
  deleteUpload: (filename) =>
    apiClient.delete(`/uploads/${encodeURIComponent(filename)}`),

  // Get similar papers
  getRecommendations: (paperId, text, title) =>
    apiClient.post('/recommend', {
      paper_id: paperId,
      text: text,
      title: title,
    }),

  // Generate literature review
  generateLiteratureReview: (papers = [], topic = null, numPapers = 5) => {
    const payload = {
      papers: Array.isArray(papers) ? papers : [papers],
    };
    if (topic) payload.topic = topic;
    if (numPapers) payload.num_papers = numPapers;
    return apiClient.post('/literature-review', payload);
  },

  // Health check
  healthCheck: () =>
    apiClient.get('/health'),

  // Publish paper
  publishPaper: (paperData) =>
    apiClient.post('/publish-paper', paperData),

  // Get published papers
  getPublishedPapers: (category = null, skip = 0, limit = 10) => {
    const params = { skip, limit };
    if (category) params.category = category;
    return apiClient.get('/published-papers', { params });
  },

  // Get specific published paper
  getPublishedPaper: (paperId) =>
    apiClient.get(`/published-papers/${paperId}`),

  // Increment paper view count
  incrementPaperView: (paperId) =>
    apiClient.post(`/published-papers/${paperId}/view`),

  // Generate paper section with AI
  generatePaperSection: (sectionConfig) =>
    apiClient.post('/generate-paper-section', sectionConfig),

  // Generate complete paper with AI
  generateCompletePaper: (paperConfig) =>
    apiClient.post('/generate-complete-paper', paperConfig),
};

// Named exports for convenience
export const searchPapers = paperAPI.searchPapers;
export const uploadPDF = paperAPI.uploadPDF;
export const summarizePaper = paperAPI.summarizePaper;
export const askQuestion = paperAPI.askQuestion;
export const savePaper = paperAPI.savePaper;
export const getSavedPapers = paperAPI.getSavedPapers;
export const listUploads = paperAPI.listUploads;
export const getUploadInfo = paperAPI.getUploadInfo;
export const deleteUpload = paperAPI.deleteUpload;
export const getRecommendations = paperAPI.getRecommendations;
export const generateLiteratureReview = paperAPI.generateLiteratureReview;
export const healthCheck = paperAPI.healthCheck;
export const publishPaper = paperAPI.publishPaper;
export const getPublishedPapers = paperAPI.getPublishedPapers;
export const getPublishedPaper = paperAPI.getPublishedPaper;
export const incrementPaperView = paperAPI.incrementPaperView;
export const generatePaperSection = paperAPI.generatePaperSection;
export const generateCompletePaper = paperAPI.generateCompletePaper;

export default apiClient;
