# Architecture Documentation - ResearchPilot AI

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  React 18 + Tailwind CSS (http://localhost:5173)               │
│  ├─ Search Interface                                            │
│  ├─ PDF Upload Component                                        │
│  ├─ Paper Details & Metadata                                    │
│  ├─ Summarization Display                                       │
│  ├─ Chat Interface (Q&A)                                        │
│  └─ Paper Library Management                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP/REST
                       │ JSON
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                         API Layer                                │
│  FastAPI (http://localhost:8000)                               │
│  ├─ /api/search          - arXiv integration                    │
│  ├─ /api/upload          - PDF file handling                    │
│  ├─ /api/summarize       - LLM summarization                    │
│  ├─ /api/ask             - RAG Q&A system                       │
│  ├─ /api/save            - Paper management                     │
│  ├─ /api/recommend       - Vector similarity search             │
│  └─ /api/literature-review - Multi-paper analysis               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│   Services   │ │ Storage  │ │ Vector DB  │
└──────────────┘ └──────────┘ └────────────┘
```

## Detailed Component Architecture

### 1. Frontend Architecture

```
src/
├── App.jsx                    # Main app component with routing
├── main.jsx                   # React entry point
├── index.css                  # Global styles
├── api/
│   └── client.js             # Axios client for API calls
├── pages/
│   ├── HomePage.jsx          # Search & discovery
│   └── PaperDetailsPage.jsx   # Paper view & interaction
├── components/
│   ├── SearchBar.jsx         # Search + results
│   ├── PDFUpload.jsx         # File upload
│   ├── PaperSummary.jsx      # Summary display
│   ├── ChatWithPaper.jsx     # Q&A interface
│   └── SavedPapers.jsx       # Library view
└── styles/
    └── globals.css           # Tailwind configuration
```

**Data Flow:**
```
User Input
    ↓
Component State
    ↓
API Call (axios)
    ↓
Backend Response
    ↓
State Update
    ↓
Re-render
```

### 2. Backend Architecture

```
backend/
├── main.py                   # FastAPI app + endpoints
├── requirements.txt          # Dependencies
├── .env.example             # Configuration template
├── services/
│   ├── arxiv_fetch.py       # arXiv API client
│   ├── pdf_parser.py        # PDF text extraction
│   ├── summarizer.py        # LLM integration
│   ├── qa_agent.py          # RAG implementation
│   └── vector_store.py      # FAISS management
├── db/
│   └── saved_papers.json    # Paper metadata
├── uploads/                 # User-uploaded PDFs
└── embeddings/              # FAISS index files
```

**Request Processing Pipeline:**
```
HTTP Request
    ↓
FastAPI Route Handler
    ↓
Input Validation
    ↓
Business Logic (Services)
    ↓
External API Calls (if needed)
    ↓
Database Operations
    ↓
JSON Response
```

## Data Models

### Paper Data Structure

```python
{
    "paper_id": "2401.12345",
    "title": "string",
    "authors": ["string"],
    "abstract": "string",
    "published_date": "YYYY-MM-DD",
    "pdf_url": "url",
    "arxiv_url": "url",
    "categories": ["string"],
    # For uploaded papers:
    "text": "extracted_text",
    "page_count": int,
    "upload_date": "ISO-timestamp"
}
```

### Summary Response Structure

```python
{
    "summary": "5-line concise overview",
    "key_contributions": ["contribution1", "contribution2", ...],
    "methodology": "description",
    "limitations": "description",
    "future_scope": "description"
}
```

### Q&A Response Structure

```python
{
    "answer": "answer_text",
    "sources": [
        {
            "text": "source_excerpt",
            "score": 0.95,
            "doc_id": "paper_id"
        }
    ],
    "confidence": 0.92
}
```

## Vector Store Design

### FAISS Index Architecture

```
Papers
    ↓
Text Chunking (overlapping)
    ↓
Embedding Generation (sentence-transformers)
    ↓
FAISS Index (FlatL2)
    ↓
Metadata Storage (JSON)
```

**Chunking Strategy:**
- Chunk size: 300 tokens
- Overlap: 50 tokens
- Minimum chunk: 5 words

**Embedding Model:**
- Model: sentence-transformers/all-MiniLM-L6-v2
- Dimension: 384
- Type: Dense vector embeddings

**Vector Search:**
- Algorithm: L2 distance
- Top-K retrieval: 3-5 results
- Similarity calculation: 1 / (1 + distance)

## API Request/Response Flow

### Search Papers Flow

```
User types query
    ↓
SearchBar.jsx sends GET /api/search
    ↓
main.py receives request
    ↓
arxiv_fetch.py queries arXiv API
    ↓
Results formatted to JSON
    ↓
Response sent to frontend
    ↓
SearchResults.jsx displays cards
```

### Summarization Flow

```
User clicks "Generate Summary"
    ↓
PaperSummary.jsx sends POST /api/summarize
    ↓
main.py receives (paper_id, text)
    ↓
summarizer.py creates prompt
    ↓
LLM API called (Gemini/OpenAI)
    ↓
JSON response parsed
    ↓
Frontend receives structured summary
    ↓
Components render summary sections
```

### RAG Q&A Flow

```
User asks question
    ↓
ChatWithPaper.jsx sends POST /api/ask
    ↓
qa_agent.py creates query
    ↓
vector_store.py.search() retrieves chunks
    ↓
Chunks + question sent to LLM
    ↓
LLM generates grounded answer
    ↓
Sources extracted and scored
    ↓
Response sent to frontend
    ↓
Messages displayed with citations
```

## Technology Stack Details

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI framework |
| Vite | 5+ | Build tool |
| Tailwind CSS | 3+ | Styling |
| Axios | 1.6+ | HTTP client |
| Lucide React | Latest | Icons |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | 0.104+ | Web framework |
| Python | 3.8+ | Language |
| Uvicorn | 0.24+ | ASGI server |
| PyMuPDF | 1.23+ | PDF parsing |
| pdfplumber | 0.10+ | PDF extraction |
| arxiv | 2.1+ | Paper search |
| FAISS | 1.7+ | Vector search |
| Sentence Transformers | 2.2+ | Embeddings |
| google-generativeai | Latest | Gemini API |
| openai | Latest | OpenAI API |

### Storage

| System | Purpose | Format |
|--------|---------|--------|
| File System | PDF uploads | .pdf |
| JSON | Paper metadata | .json |
| FAISS | Vector index | .index |
| JSON | Embeddings metadata | .json |

## Security Architecture

### Input Validation

```
User Input
    ↓
Type checking (Pydantic)
    ↓
Length validation
    ↓
Content validation
    ↓
File type validation (for uploads)
    ↓
Processed safely
```

### API Security

```
CORS Configuration
    ↓
Content-Type validation
    ↓
Request size limits
    ↓
File upload limits (50MB)
    ↓
Error handling (no info leakage)
    ↓
Response validation
```

### Data Privacy

```
User Input
    ↓
No storage of raw queries
    ↓
Vector embeddings generated locally
    ↓
Local FAISS storage only
    ↓
API calls to LLM (with content only)
    ↓
No personal data in logs
```

## Scalability Considerations

### Current Architecture (Single Server)

- Good for: Hackathons, demos, small teams
- Users: 1-10 concurrent
- Papers: 100-1000 in vector store
- Storage: < 1GB

### Scaling Strategies

#### Horizontal Scaling

```
Load Balancer
    ↓
    ├─ Backend Instance 1
    ├─ Backend Instance 2
    └─ Backend Instance 3
    
Shared Storage:
    ├─ PostgreSQL (metadata)
    └─ Object Storage (PDFs)
```

#### Vector Database Scaling

```
Current: Single FAISS file
Improved: Distributed FAISS or Pinecone
Advanced: Elasticsearch, Milvus, Weaviate
```

## Performance Optimization

### Search Optimization

- Query limiting: max 100 results
- Pagination support
- Result caching (frontend)
- Index optimization (FAISS FlatL2)

### Summarization Optimization

- Input truncation (4000 chars)
- Cached results (JSON)
- Streaming responses (optional)
- Batch processing (future)

### RAG Optimization

- Query chunking (50 tokens)
- Top-K limiting (5 results)
- Similarity thresholding (0.7+)
- Context window management

## Error Handling Strategy

```
Try-Except Wrapping
    ↓
    ├─ API Errors → HTTP 500
    ├─ Validation Errors → HTTP 400
    ├─ Not Found Errors → HTTP 404
    └─ Rate Limit → HTTP 429
    
All errors logged to console
All errors returned as JSON
Frontend handles gracefully
```

## Caching Strategy

### Frontend Caching

```javascript
// Browser cache
sessionStorage: Search results
localStorage: Saved papers
```

### Backend Caching

```python
# In-memory caching (future)
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_summary(paper_id):
    ...
```

## Database Schema

### saved_papers.json

```json
{
  "paper_id_1": {
    "paper_id": "arxiv_id",
    "title": "string",
    "authors": ["array"],
    "abstract": "string",
    "url": "string",
    "published_date": "string",
    "saved_date": "ISO-timestamp",
    "notes": "string"
  }
}
```

### Vector Store Metadata

```json
{
  "chunk_id": {
    "doc_id": "paper_id",
    "chunk_index": 0,
    "text": "chunk text",
    "metadata": {
      "filename": "filename",
      "page_count": 10,
      "upload_date": "timestamp"
    }
  }
}
```

## Deployment Architecture

### Local Development

```
Windows/Mac/Linux
├── Backend (localhost:8000)
├── Frontend (localhost:5173)
└── All data local
```

### Production (Recommended)

```
GitHub Repository
    ↓
    ├─ Backend Branch → Render
    │   ├─ Environment vars
    │   ├─ Auto-scaling
    │   └─ CDN
    │
    └─ Frontend Branch → Vercel
        ├─ Static hosting
        ├─ Auto-deployment
        └─ CDN
```

## Monitoring & Logging

### Backend Logging

```python
logger.info(f"Searching arXiv for: {query}")
logger.error(f"Error parsing PDF: {str(e)}")
logger.debug(f"Vector search returned {len(results)} results")
```

### Frontend Logging

```javascript
console.log('Search submitted:', query);
console.error('API error:', error);
```

---

**Architecture Version: 1.0.0**  
**Last Updated: January 2024**
