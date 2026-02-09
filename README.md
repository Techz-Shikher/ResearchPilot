# ResearchPilot AI - Autonomous Research Intelligence Hub

> A complete, production-ready full-stack AI application for discovering, analyzing, and understanding academic papers with RAG (Retrieval-Augmented Generation).

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![React](https://img.shields.io/badge/React-18%2B-blue)

## 🚀 Overview

ResearchPilot AI is a comprehensive research intelligence platform that leverages modern AI technologies to help researchers and academics:

- **Discover** papers from arXiv with powerful search capabilities
- **Analyze** papers with AI-powered summarization
- **Organize** papers in a personal library
- **Understand** papers through contextual Q&A using RAG
- **Generate** literature reviews automatically
- **Compare** similar papers through embedding-based recommendations

## ✨ Core Features

### 1. 📚 Paper Discovery
- Search arXiv database with natural language queries
- Browse papers with title, authors, abstract, and publication date
- Direct PDF download links
- Filter by research categories

### 2. 📄 PDF Upload & Parsing
- Upload personal research papers
- Automatic text extraction from PDFs
- Support for multi-page documents
- Preserved formatting and structure

### 3. 🤖 AI Summarization
- Generate structured summaries with:
  - Concise 5-line overview
  - Key contributions and findings
  - Methodology explanation
  - Research limitations
  - Future research directions
- Smart fallback to transformer models if API unavailable

### 4. 💬 Contextual Q&A (RAG)
- Chat interface for paper-specific questions
- Retrieval-Augmented Generation with FAISS vectors
- Relevant context extraction
- Confidence scoring on answers
- Citation-aware responses

### 5. 🔗 Similar Paper Recommendations
- Embedding-based similarity detection
- Find related research instantly
- Explore research communities
- Similarity scoring

### 6. 📖 Literature Review Generation
- Auto-generate comprehensive literature reviews
- Topic-based paper aggregation
- Research gap identification
- Structured output format

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (modern, fast, production-ready)
- **Language**: Python 3.8+
- **PDF Processing**: PyMuPDF + pdfplumber
- **Vector Database**: FAISS (local, fast, CPU-efficient)
- **Embeddings**: Sentence Transformers (all-MiniLM-L6-v2)
- **LLM Integration**: Google Gemini / OpenAI (configurable)
- **API Data**: arXiv API (free, no authentication)
- **Server**: Uvicorn ASGI

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite
- **UI Components**: Custom, accessibility-focused

### Database
- **Vector Store**: FAISS (local file-based)
- **Document Storage**: JSON + file system
- **Metadata**: JSON database

## 📁 Project Structure

```
ResearchPilot/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment template
│   ├── services/
│   │   ├── arxiv_fetch.py      # arXiv API integration
│   │   ├── pdf_parser.py       # PDF text extraction
│   │   ├── summarizer.py       # AI summarization
│   │   ├── qa_agent.py         # RAG Q&A system
│   │   └── vector_store.py     # FAISS vector management
│   ├── db/
│   │   └── saved_papers.json   # Paper library
│   ├── uploads/                # Uploaded PDFs
│   └── embeddings/             # Vector store files
│
└── frontend/
    ├── package.json            # NPM dependencies
    ├── vite.config.js          # Vite configuration
    ├── tailwind.config.js       # Tailwind configuration
    ├── index.html              # HTML entry point
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx             # Main App component
        ├── index.css           # Global styles
        ├── api/
        │   └── client.js       # API client
        ├── pages/
        │   ├── HomePage.jsx    # Home/search page
        │   └── PaperDetailsPage.jsx  # Paper details
        ├── components/
        │   ├── SearchBar.jsx   # Search interface
        │   ├── PDFUpload.jsx   # PDF upload
        │   ├── PaperSummary.jsx # Summary display
        │   ├── ChatWithPaper.jsx # Q&A interface
        │   └── SavedPapers.jsx # Library view
        └── styles/
            └── globals.css     # Tailwind styles
```

## 🚦 Getting Started

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **npm or yarn** (frontend package manager)
- **Git** (version control)

### Backend Setup

#### 1. Create Python Environment

```bash
# Navigate to backend directory
cd ResearchPilot/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note**: First time FAISS installation may take a few minutes as it compiles from source.

#### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

**Configuration options:**
```env
# Choose LLM provider
LLM_PROVIDER=gemini  # or 'openai'

# Add your API key (get free tier at cloud.google.com/generativeai)
GEMINI_API_KEY=your_key_here

# Or OpenAI key (optional alternative)
OPENAI_API_KEY=your_key_here

# API URLs
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

**Getting Free API Keys:**
- **Google Gemini**: https://ai.google.dev/
  - Free tier: 60 requests/minute
  - Completely free, no credit card required

- **OpenAI**: https://platform.openai.com/
  - Free trial with $5 credits
  - Pay-as-you-go after trial

#### 4. Start Backend Server

```bash
python main.py
```

Server will start at: **http://localhost:8000**

Test health endpoint:
```bash
curl http://localhost:8000/api/health
```

### Frontend Setup

#### 1. Install Dependencies

```bash
cd ResearchPilot/frontend
npm install
```

#### 2. Configure Environment

```bash
cp .env.example .env

# Edit if backend is on different URL
# nano .env
```

#### 3. Start Development Server

```bash
npm run dev
```

Open browser to: **http://localhost:5173**

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Search Papers
```http
GET /api/search?query=<search_term>&max_results=<number>
```

**Response:**
```json
{
  "success": true,
  "query": "AI in cybersecurity",
  "total_results": 20,
  "results": [
    {
      "paper_id": "2401.12345",
      "title": "Paper Title",
      "authors": ["Author 1", "Author 2"],
      "abstract": "Paper abstract...",
      "published_date": "2024-01-15",
      "pdf_url": "https://arxiv.org/pdf/...",
      "arxiv_url": "https://arxiv.org/abs/..."
    }
  ]
}
```

#### Upload PDF
```http
POST /api/upload
Content-Type: multipart/form-data

file: <PDF_FILE>
```

**Response:**
```json
{
  "success": true,
  "filename": "paper.pdf",
  "paper_id": "local_1234567890",
  "text": "Extracted text...",
  "page_count": 10,
  "message": "PDF uploaded successfully"
}
```

#### Summarize Paper
```http
POST /api/summarize

{
  "paper_id": "2401.12345",
  "text": "Paper content to summarize..."
}
```

**Response:**
```json
{
  "success": true,
  "paper_id": "2401.12345",
  "summary": "Concise 5-line summary...",
  "key_contributions": [
    "Contribution 1",
    "Contribution 2"
  ],
  "methodology": "Description of methodology...",
  "limitations": "Research limitations...",
  "future_scope": "Future research directions..."
}
```

#### Ask Question (RAG)
```http
POST /api/ask

{
  "paper_id": "2401.12345",
  "question": "What is the main finding?",
  "text": "Paper content..."
}
```

**Response:**
```json
{
  "success": true,
  "paper_id": "2401.12345",
  "question": "What is the main finding?",
  "answer": "The main finding is...",
  "sources": [
    {
      "text": "Relevant excerpt...",
      "score": 0.95,
      "doc_id": "2401.12345"
    }
  ],
  "confidence": 0.92
}
```

#### Save Paper
```http
POST /api/save

{
  "paper_id": "2401.12345",
  "title": "Paper Title",
  "authors": ["Author 1", "Author 2"],
  "abstract": "Paper abstract...",
  "url": "https://arxiv.org/abs/...",
  "published_date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Paper saved successfully",
  "paper_id": "2401.12345"
}
```

#### Get Saved Papers
```http
GET /api/saved
```

**Response:**
```json
{
  "success": true,
  "total": 5,
  "papers": [
    {
      "paper_id": "2401.12345",
      "title": "Paper Title",
      "authors": ["Author 1"],
      "abstract": "...",
      "saved_date": "2024-01-20T10:30:00"
    }
  ]
}
```

#### Get Similar Papers
```http
GET /api/recommend?paper_id=<paper_id>
```

**Response:**
```json
{
  "success": true,
  "paper_id": "2401.12345",
  "similar_papers": [
    {
      "doc_id": "2401.54321",
      "text": "Similar paper excerpt...",
      "score": 0.87,
      "metadata": {}
    }
  ]
}
```

#### Generate Literature Review
```http
POST /api/literature-review

{
  "topic": "Deep Learning in Medicine",
  "num_papers": 5
}
```

**Response:**
```json
{
  "success": true,
  "review": {
    "topic": "Deep Learning in Medicine",
    "generated_date": "2024-01-20T10:30:00",
    "introduction": "This literature review explores...",
    "papers": [
      {
        "title": "Paper 1",
        "authors": ["Author 1"],
        "summary": "Summary...",
        "key_contributions": ["Contribution 1"]
      }
    ],
    "research_gaps": ["Gap 1", "Gap 2"],
    "conclusion": "The research on..."
  }
}
```

## 🧪 Testing the Application

### Quick Test Workflow

#### 1. Test Paper Search
```bash
curl "http://localhost:8000/api/search?query=machine%20learning&max_results=5"
```

#### 2. Test PDF Upload
```bash
# Create a test PDF (or use existing one)
curl -F "file=@test_paper.pdf" http://localhost:8000/api/upload
```

#### 3. Test Summarization
```bash
curl -X POST http://localhost:8000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "2401.12345",
    "text": "Your paper text here..."
  }'
```

#### 4. Test Q&A
```bash
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "2401.12345",
    "question": "What is the main result?",
    "text": "Your paper text..."
  }'
```

### UI Testing

1. **Home Page**
   - Search for "machine learning"
   - Verify results load correctly
   - Click on a paper card

2. **Paper Details**
   - Click "Generate AI Summary"
   - Wait for summary to appear
   - Ask a question in chat

3. **PDF Upload**
   - Switch to "Upload PDF" tab
   - Drag & drop a PDF
   - Verify text extraction

4. **Saved Papers**
   - Save a paper from search
   - Switch to "Saved Papers" tab
   - Verify paper appears

## 🚀 Deployment

### Backend Deployment (Render)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-repo.git
git push -u origin main
```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Select "ResearchPilot/backend" directory
   - Environment: `Python 3.11`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn main:app --worker-class uvicorn.workers.UvicornWorker`
   - Add environment variables from `.env`

4. **Get Backend URL**
   - Your API will be at: `https://your-app.onrender.com`

### Frontend Deployment (Vercel)

1. **Deploy Frontend**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Root Directory: `ResearchPilot/frontend`
   - Framework: `Vite`
   - Build command: `npm run build`

2. **Configure Environment**
   - Add `VITE_API_URL` pointing to your Render backend

3. **Get Frontend URL**
   - Your site will be at: `https://your-app.vercel.app`

### Complete Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS properly set (allow both domains)
- [ ] SSL certificates active (automatic)
- [ ] API keys configured on server
- [ ] Database connections working
- [ ] File uploads working
- [ ] Vector store initialized
- [ ] Test all API endpoints

## 📊 Performance & Optimization

### Vector Store Performance
- FAISS FlatL2: O(n) search complexity
- Typical query time: <100ms for 1000+ documents
- Memory efficient with local storage

### Summarization Speed
- With API: ~2-5 seconds
- With transformers fallback: ~5-10 seconds

### Q&A Latency
- Vector search: ~50ms
- LLM generation: ~3-5 seconds
- Total: ~3.5-6 seconds

### Optimization Tips
- Cache frequently summarized papers
- Use smaller transformer models for faster inference
- Implement pagination for large search results
- Consider batch processing for multiple papers

## 🔒 Security Considerations

### API Security
- CORS configured for specific origins
- File upload validation (PDF only)
- Size limits on uploads (50MB default)
- Input sanitization

### Data Privacy
- All vector embeddings stored locally
- No personal data sent to AI APIs
- Papers processed server-side only
- Optional: Self-hosted LLM deployment

### Best Practices
- Use environment variables for API keys
- Never commit `.env` files
- Validate all user inputs
- Regular dependency updates
- Monitor API usage

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Change port in main.py or run on different port
python main.py --port 8001
```

**FAISS installation fails:**
```bash
# Install pre-built wheel
pip install --no-build-isolation faiss-cpu

# Or use binary installation
conda install -c conda-forge faiss-cpu
```

**PDF parsing fails:**
- Ensure PyMuPDF and pdfplumber are installed
- Try updating: `pip install --upgrade PyMuPDF pdfplumber`

**API Key errors:**
- Verify .env file is in backend directory
- Check API key format and validity
- Test with fallback summarizer if no API key

### Frontend Issues

**CORS errors:**
- Verify backend URL in `.env`
- Check CORS configuration in `main.py`
- Clear browser cache

**API requests timing out:**
- Increase timeout in `src/api/client.js`
- Check backend server status
- Verify network connectivity

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📈 Future Enhancements

### Short-term
- [ ] User authentication & accounts
- [ ] Paper annotations & highlights
- [ ] Export summaries to PDF/Word
- [ ] Dark mode
- [ ] Multi-language support

### Medium-term
- [ ] Full-text search across all papers
- [ ] Citation network visualization
- [ ] Collaborative reading sessions
- [ ] Paper recommendation engine
- [ ] Custom prompt templates

### Long-term
- [ ] Mobile app (React Native)
- [ ] Self-hosted LLM models
- [ ] Advanced analytics dashboard
- [ ] Research group collaboration
- [ ] Integration with Zotero/Mendeley

## 📝 Code Quality

### Best Practices Implemented
- ✅ Type hints in Python
- ✅ Error handling & logging
- ✅ RESTful API design
- ✅ Component modularity (React)
- ✅ Configuration management
- ✅ Documentation strings
- ✅ CORS security
- ✅ Input validation

### Testing Recommendations
```bash
# Backend tests
pytest backend/

# Frontend tests
npm test

# E2E tests
npm run test:e2e
```

## 📄 License

This project is released under the MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional LLM integrations
- Performance optimizations
- UI/UX enhancements
- Test coverage
- Documentation improvements

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check GitHub issues
4. Open new issue with details

## 🎓 Educational Use

Perfect for:
- Computer Science students
- AI/ML researchers
- Knowledge management systems
- Hackathon projects
- Portfolio projects
- Learning full-stack development

## 🙏 Acknowledgments

- arXiv for paper database
- Hugging Face for transformer models
- Facebook for FAISS library
- React, FastAPI, and Tailwind CSS communities

---

**Built with ❤️ for the research community**

Last Updated: January 2024 | Version: 1.0.0
