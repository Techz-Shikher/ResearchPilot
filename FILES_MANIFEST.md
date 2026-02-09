# ResearchPilot AI - Project Files

## Complete File Inventory

### Root Directory
```
ResearchPilot/
├── README.md                           # Main documentation
├── QUICKSTART.md                       # Quick setup guide
├── DEPLOYMENT.md                       # Deployment guide
├── API_REFERENCE.md                    # API documentation
├── ARCHITECTURE.md                     # Technical architecture
├── HACKATHON_CHECKLIST.md             # Submission checklist
├── PROMPT_ENGINEERING.md              # LLM prompt guides
├── FILES_MANIFEST.md                  # This file
├── .gitignore                         # Git ignore rules
└── LICENSE                            # MIT License
```

### Backend Files

```
backend/
├── main.py                            # FastAPI application (600 lines)
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment template
│
├── services/
│   ├── __init__.py                   # Module init
│   ├── arxiv_fetch.py                # arXiv API integration (50 lines)
│   ├── pdf_parser.py                 # PDF text extraction (80 lines)
│   ├── summarizer.py                 # LLM summarization (200 lines)
│   ├── qa_agent.py                   # RAG Q&A system (150 lines)
│   └── vector_store.py               # FAISS management (300 lines)
│
├── db/
│   └── saved_papers.json             # Paper metadata storage
│
├── uploads/                          # User-uploaded PDFs (auto-created)
│   └── .gitkeep                      # Empty directory marker
│
└── embeddings/                       # Vector store files (auto-created)
    └── .gitkeep                      # Empty directory marker
```

### Frontend Files

```
frontend/
├── package.json                       # NPM dependencies
├── vite.config.js                    # Vite build config
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.js                 # PostCSS config
├── index.html                        # HTML entry point
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
│
├── src/
│   ├── main.jsx                      # React entry point
│   ├── App.jsx                       # Main app component (100 lines)
│   ├── index.css                     # Global styles
│   │
│   ├── api/
│   │   └── client.js                # Axios API client (150 lines)
│   │
│   ├── pages/
│   │   ├── HomePage.jsx             # Search & discovery (300 lines)
│   │   └── PaperDetailsPage.jsx      # Paper details view (150 lines)
│   │
│   ├── components/
│   │   ├── SearchBar.jsx            # Search interface (100 lines)
│   │   ├── PDFUpload.jsx            # File upload (80 lines)
│   │   ├── PaperSummary.jsx         # Summary display (120 lines)
│   │   ├── ChatWithPaper.jsx        # Q&A interface (140 lines)
│   │   └── SavedPapers.jsx          # Library view (80 lines)
│   │
│   └── styles/
│       └── globals.css              # Tailwind styles (150 lines)
```

## File Statistics

### Backend

| File | Lines | Purpose |
|------|-------|---------|
| main.py | 600 | FastAPI application |
| services/summarizer.py | 200 | LLM integration |
| services/vector_store.py | 300 | FAISS management |
| services/qa_agent.py | 150 | RAG system |
| services/pdf_parser.py | 80 | PDF extraction |
| services/arxiv_fetch.py | 50 | Paper search |
| **Total** | **1,380** | **All services** |

### Frontend

| File | Lines | Purpose |
|------|-------|---------|
| src/pages/HomePage.jsx | 300 | Main search interface |
| src/pages/PaperDetailsPage.jsx | 150 | Paper view |
| src/components/ChatWithPaper.jsx | 140 | Q&A interface |
| src/components/PaperSummary.jsx | 120 | Summary display |
| src/components/SearchBar.jsx | 100 | Search component |
| src/api/client.js | 150 | API client |
| src/App.jsx | 100 | App structure |
| **Total** | **1,060** | **All components** |

## Dependencies Summary

### Backend (17 packages)

**Core:**
- fastapi==0.104.1
- uvicorn==0.24.0
- pydantic==2.5.0

**PDF Processing:**
- PyMuPDF==1.23.8
- pdfplumber==0.10.3

**Data & Vector:**
- numpy==1.24.3
- faiss-cpu==1.7.4
- sentence-transformers==2.2.2

**AI/LLM:**
- google-generativeai==0.3.0
- openai==1.3.0
- transformers==4.35.0
- torch==2.1.1

**APIs & Data:**
- arxiv==2.1.0
- requests==2.31.0

**Configuration:**
- python-dotenv==1.0.0
- pyyaml==6.0.1
- aiofiles==23.2.1

### Frontend (7 packages)

**Core:**
- react==18.2.0
- react-dom==18.2.0
- vite==5.0.0

**UI & Styling:**
- tailwindcss==3.3.0
- lucide-react==0.294.0

**HTTP & Routing:**
- axios==1.6.0
- react-router-dom==6.20.0

## Documentation Files

| File | Size | Content |
|------|------|---------|
| README.md | 500 lines | Complete project guide |
| QUICKSTART.md | 300 lines | 5-minute setup guide |
| DEPLOYMENT.md | 400 lines | Production deployment |
| API_REFERENCE.md | 400 lines | All endpoints documented |
| ARCHITECTURE.md | 350 lines | Technical architecture |
| HACKATHON_CHECKLIST.md | 350 lines | Submission checklist |
| PROMPT_ENGINEERING.md | 250 lines | LLM prompt guides |

## Total Project Size

```
Backend Code:         ~1,400 lines (Python)
Frontend Code:        ~1,100 lines (JavaScript/JSX)
Configuration:        ~500 lines (.json, .js, .config)
Documentation:        ~2,500 lines (Markdown)
────────────────────────────────────
TOTAL:               ~5,500 lines
```

## File Organization Best Practices

### Backend Structure

✅ **Good:**
```
backend/
├── main.py           # Only API routes & app setup
├── services/         # All business logic
├── db/              # Data storage
└── uploads/         # File uploads
```

❌ **Avoid:**
```
backend/
├── service_1.py
├── service_2.py
├── service_3.py     # All mixed together
```

### Frontend Structure

✅ **Good:**
```
frontend/src/
├── pages/           # Page-level components
├── components/      # Reusable components
├── api/            # API communication
└── styles/         # Global styles
```

❌ **Avoid:**
```
frontend/src/
├── Home.jsx
├── Search.jsx
├── Details.jsx      # All mixed together
```

## Key Files for Different Roles

### For Developers

1. Start with: `README.md`
2. Quick setup: `QUICKSTART.md`
3. API calls: `API_REFERENCE.md`
4. Architecture: `ARCHITECTURE.md`
5. Source code: `src/` directories

### For Deployment

1. Setup: `QUICKSTART.md`
2. Deploy: `DEPLOYMENT.md`
3. Monitor: Check production logs
4. Scale: Refer to `ARCHITECTURE.md`

### For Presentation

1. Overview: `README.md`
2. Features: Features section
3. Tech stack: Tech stack section
4. Demo: `HACKATHON_CHECKLIST.md`

## Configuration Files

### Backend Configuration

| File | Purpose |
|------|---------|
| .env | Runtime configuration (not in repo) |
| .env.example | Configuration template |
| requirements.txt | Python dependencies |

### Frontend Configuration

| File | Purpose |
|------|---------|
| .env | Runtime variables (not in repo) |
| .env.example | Environment template |
| vite.config.js | Build configuration |
| tailwind.config.js | Styling system |
| postcss.config.js | CSS processing |
| package.json | Dependencies & scripts |

## Generated Files (Not in Repo)

These are created at runtime:

```
backend/
├── venv/                    # Virtual environment
├── __pycache__/            # Python cache
├── uploads/*.pdf           # User uploads
├── db/saved_papers.json    # Generated on first run
├── embeddings/
│   ├── faiss.index         # Vector index
│   └── metadata.json       # Chunk metadata
└── .env                    # User's environment vars

frontend/
├── node_modules/           # Dependencies
├── dist/                   # Build output
└── .env                    # User's env vars
```

## How to Navigate the Project

### Find a specific feature:

1. **Search Papers** → `frontend/src/components/SearchBar.jsx`
2. **PDF Upload** → `frontend/src/components/PDFUpload.jsx`
3. **Summarization** → `backend/services/summarizer.py`
4. **Q&A (RAG)** → `backend/services/qa_agent.py`
5. **Vector Search** → `backend/services/vector_store.py`

### Modify a feature:

1. Check API endpoint in `backend/main.py`
2. Find service logic in `backend/services/`
3. Update component in `frontend/src/components/`
4. Test with API calls from `frontend/src/api/client.js`

### Add new feature:

1. Create API endpoint in `backend/main.py`
2. Create service in `backend/services/` if needed
3. Create frontend component in `frontend/src/components/`
4. Wire up with client in `frontend/src/api/client.js`

## Dependency Management

### Update Backend Dependencies

```bash
cd backend
pip list --outdated
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

### Update Frontend Dependencies

```bash
cd frontend
npm update
npm audit fix
npm install
```

## Backup Important Files

Keep these backed up:

- `db/saved_papers.json` - User library
- `embeddings/` - Vector store (all files)
- `uploads/*.pdf` - Uploaded papers
- `.env` - API keys

---

**File Manifest Version: 1.0**  
**Last Updated: January 2024**

For questions about specific files, check the README.md and relevant documentation.
