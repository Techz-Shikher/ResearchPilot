"""
ResearchPilot AI - Simplified Demo Version
Running without heavy dependencies
"""
import os
import json
import logging
from pathlib import Path
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ResearchPilot AI",
    description="Autonomous Research Intelligence Hub",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class SearchQuery(BaseModel):
    query: str

class AnswerRequest(BaseModel):
    paper_id: str
    question: str

class SummarizeRequest(BaseModel):
    paper_id: str
    text: Optional[str] = None

class SavePaperRequest(BaseModel):
    paper_id: str
    title: str
    authors: list
    abstract: str
    url: str
    published_date: str

class RecommendRequest(BaseModel):
    paper_id: str

class LiteratureReviewRequest(BaseModel):
    papers: list
    topic: Optional[str] = None
    num_papers: Optional[int] = 5

# Database
db_path = Path(__file__).parent / "db" / "saved_papers.json"
db_path.parent.mkdir(exist_ok=True)

def load_db():
    if db_path.exists():
        with open(db_path, 'r') as f:
            return json.load(f)
    return {}

def save_db(data):
    with open(db_path, 'w') as f:
        json.dump(data, f, indent=2)

# Routes

@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "message": "ResearchPilot AI is running!"}

@app.post("/api/search")
async def search_papers(query: SearchQuery):
    """Search for papers (demo with mock data)"""
    try:
        logger.info(f"Searching for: {query.query}")
        
        # Mock search results
        mock_papers = [
            {
                "id": "2401.12345",
                "title": f"A Study on {query.query}",
                "authors": ["Dr. Alice", "Dr. Bob"],
                "abstract": f"This paper explores {query.query} using advanced techniques...",
                "published_date": "2024-01-15",
                "url": "https://arxiv.org/pdf/2401.12345.pdf",
                "categories": ["cs.AI", "cs.LG"]
            },
            {
                "id": "2312.54321",
                "title": f"{query.query}: A Comprehensive Review",
                "authors": ["Prof. Carol"],
                "abstract": f"A comprehensive review of current approaches to {query.query}...",
                "published_date": "2023-12-01",
                "url": "https://arxiv.org/pdf/2312.54321.pdf",
                "categories": ["cs.AI"]
            }
        ]
        
        return {
            "query": query.query,
            "papers": mock_papers,
            "count": len(mock_papers)
        }
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and parse PDF"""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files allowed")
        
        upload_dir = Path(__file__).parent / "uploads"
        upload_dir.mkdir(exist_ok=True)
        
        file_path = upload_dir / file.filename
        with open(file_path, 'wb') as f:
            content = await file.read()
            f.write(content)
        
        logger.info(f"PDF uploaded: {file.filename}")
        
        return {
            "filename": file.filename,
            "size": len(content),
            "message": "PDF uploaded successfully",
            "extracted_text": f"Sample text from {file.filename}..."
        }
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize")
async def summarize(request: SummarizeRequest):
    """Generate AI summary"""
    try:
        logger.info(f"Summarizing paper: {request.paper_id}")
        
        return {
            "paper_id": request.paper_id,
            "summary": "This paper presents a comprehensive approach to addressing key challenges in the field. It introduces novel methodologies and demonstrates significant improvements over existing approaches.",
            "key_contributions": [
                "Novel methodology with improved efficiency",
                "Improved performance metrics by 25-40%",
                "Practical applications with real-world validation"
            ],
            "methodology": "Used deep learning techniques with dataset of 10k samples",
            "limitations": "Limited to English papers, requires 4+ GB RAM",
            "future_scope": "Extend to multilingual papers, optimize for edge devices"
        }
    except Exception as e:
        logger.error(f"Summarize error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ask")
async def ask_question(request: AnswerRequest):
    """Ask a question about the paper (Q&A)"""
    try:
        logger.info(f"Question about {request.paper_id}: {request.question}")
        
        return {
            "paper_id": request.paper_id,
            "question": request.question,
            "answer": f"Based on the paper content, the answer to '{request.question}' is...",
            "sources": [
                {"text": "Relevant passage from page 2", "score": 0.95},
                {"text": "Related methodology from page 5", "score": 0.87}
            ],
            "confidence": 0.91
        }
    except Exception as e:
        logger.error(f"Q&A error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save")
async def save_paper(request: SavePaperRequest):
    """Save paper to library"""
    try:
        db = load_db()
        db[request.paper_id] = {
            "title": request.title,
            "authors": request.authors,
            "abstract": request.abstract,
            "url": request.url,
            "published_date": request.published_date,
            "saved_date": datetime.now().isoformat(),
            "notes": ""
        }
        save_db(db)
        
        logger.info(f"Saved paper: {request.paper_id}")
        return {"status": "saved", "paper_id": request.paper_id}
    except Exception as e:
        logger.error(f"Save error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/saved")
async def get_saved_papers():
    """Get all saved papers"""
    try:
        db = load_db()
        return {
            "papers": db,
            "count": len(db)
        }
    except Exception as e:
        logger.error(f"Retrieve error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommend")
async def recommend_papers(request: RecommendRequest):
    """Get similar paper recommendations"""
    try:
        logger.info(f"Getting recommendations for: {request.paper_id}")
        
        return {
            "source_paper": request.paper_id,
            "recommendations": [
                {
                    "id": "2401.99999",
                    "title": "Related Research on Similar Topics",
                    "authors": ["Dr. David", "Dr. Emma"],
                    "similarity": 0.92
                },
                {
                    "id": "2312.88888",
                    "title": "Advanced Methods in the Field",
                    "authors": ["Prof. Frank"],
                    "similarity": 0.87
                }
            ]
        }
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/literature-review")
async def generate_literature_review(request: LiteratureReviewRequest):
    """Generate literature review from papers"""
    try:
        logger.info(f"Generating literature review for {len(request.papers)} papers")
        
        return {
            "introduction": "This literature review covers the latest developments and research in the field. It synthesizes key findings from leading research groups worldwide.",
            "key_papers": request.papers[:3] if request.papers else [],
            "research_gaps": [
                "Limited research on real-world applications",
                "Need for larger scale studies across domains",
                "Lack of standardized benchmarks for comparison"
            ],
            "future_directions": "Future research should focus on scalability, generalization, and practical deployment in production environments.",
            "conclusion": "In summary, the field is rapidly evolving with significant advances in methodology and applications. Continued research in identified gaps will drive innovation."
        }
    except Exception as e:
        logger.error(f"Literature review error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
