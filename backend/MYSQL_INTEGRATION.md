# 🔗 MySQL Integration Guide for main_enhanced.py

This guide shows you how to integrate MySQL into your existing FastAPI backend.

## Current Setup

Your project currently stores papers in a **JSON file** (`db/saved_papers.json`).
We're upgrading it to use **MySQL database** for better scalability and performance.

---

## Integration Steps

### Step 1: Install MySQL Connector

```bash
pip install mysql-connector-python
```

Check it's installed:
```bash
pip list | grep mysql-connector
```

### Step 2: Set Up Database

Run the automated setup:

```bash
python setup_database.py
```

Or manually:
```bash
mysql -u root -p123456789 < db_setup.sql
```

### Step 3: Update main_enhanced.py

Replace the JSON database code with MySQL.

#### Find and Replace These Sections:

**OLD CODE (JSON-based):**
```python
# Lines 105-117 in current main_enhanced.py
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
```

**NEW CODE (MySQL-based):**
```python
from db_manager import DatabaseManager

# Initialize database manager
db_manager = DatabaseManager()

# Connect on startup
if not db_manager.connect():
    logger.error("❌ Failed to connect to database - using mock mode")
    db_manager = None
```

---

### Step 4: Update Each Endpoint

#### Save Paper Endpoint

**OLD:**
```python
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
        return {"status": "saved", "paper_id": request.paper_id}
    except Exception as e:
        logger.error(f"Save error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

**NEW:**
```python
@app.post("/api/save")
async def save_paper(request: SavePaperRequest):
    """Save paper to library"""
    try:
        if not db_manager:
            raise HTTPException(status_code=500, detail="Database not available")
        
        success = db_manager.save_paper(
            paper_id=request.paper_id,
            title=request.title,
            authors=request.authors,
            abstract=request.abstract,
            url=request.url,
            published_date=request.published_date
        )
        
        if success:
            logger.info(f"✅ Saved paper: {request.paper_id}")
            return {"status": "saved", "paper_id": request.paper_id}
        else:
            raise HTTPException(status_code=500, detail="Failed to save paper")
    except Exception as e:
        logger.error(f"Save error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

#### Get Saved Papers Endpoint

**OLD:**
```python
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
```

**NEW:**
```python
@app.get("/api/saved")
async def get_saved_papers():
    """Get all saved papers"""
    try:
        if not db_manager:
            raise HTTPException(status_code=500, detail="Database not available")
        
        papers = db_manager.get_all_papers(limit=1000)
        papers_dict = {p['paper_id']: {
            'title': p['title'],
            'authors': json.loads(p['authors']) if isinstance(p['authors'], str) else p['authors'],
            'abstract': p['abstract'],
            'url': p['url'],
            'published_date': p['published_date'],
            'saved_date': p['saved_date'].isoformat() if p['saved_date'] else None,
            'notes': p['notes']
        } for p in papers}
        
        return {
            "papers": papers_dict,
            "count": len(papers_dict)
        }
    except Exception as e:
        logger.error(f"Retrieve error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

#### Save Summary

**OLD:**
```python
# If you're storing summaries in JSON
```

**NEW:**
```python
@app.post("/api/summary/save")
async def save_summary(paper_id: str, summary: str, title: str = "", ai_provider: str = "unknown"):
    """Save AI-generated summary"""
    try:
        if not db_manager:
            raise HTTPException(status_code=500, detail="Database not available")
        
        success = db_manager.save_summary(
            paper_id=paper_id,
            title=title,
            summary=summary,
            ai_provider=ai_provider,
            word_count=len(summary.split())
        )
        
        return {"status": "saved", "word_count": len(summary.split())}
    except Exception as e:
        logger.error(f"Summary save error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

---

### Step 5: Startup Check

Add this to your app startup:

```python
@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("🚀 ResearchPilot AI Starting...")
    
    if db_manager and db_manager.connection:
        stats = db_manager.get_stats()
        logger.info(f"📊 Database: {stats['total_papers']} papers, {stats['total_summaries']} summaries")
    else:
        logger.warning("⚠️  Database not available - using fallback mode")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    if db_manager and db_manager.connection:
        db_manager.disconnect()
        logger.info("✅ Database disconnected")
```

---

## Migration Helper

If you want to migrate existing JSON data to MySQL:

```python
# migration.py
import json
from pathlib import Path
from db_manager import DatabaseManager

def migrate_json_to_mysql():
    """Migrate existing JSON data to MySQL"""
    
    # Load JSON
    json_path = Path("db/saved_papers.json")
    if not json_path.exists():
        print("No JSON data to migrate")
        return
    
    with open(json_path, 'r') as f:
        json_data = json.load(f)
    
    # Connect to MySQL
    db = DatabaseManager()
    if not db.connect():
        print("❌ Database connection failed")
        return
    
    # Migrate each paper
    migrated = 0
    for paper_id, paper_info in json_data.items():
        try:
            db.save_paper(
                paper_id=paper_id,
                title=paper_info.get('title', ''),
                authors=paper_info.get('authors', []),
                abstract=paper_info.get('abstract', ''),
                url=paper_info.get('url', ''),
                published_date=paper_info.get('published_date', ''),
                notes=paper_info.get('notes', '')
            )
            migrated += 1
        except Exception as e:
            print(f"❌ Error migrating {paper_id}: {e}")
    
    print(f"\n✅ Migrated {migrated} papers to MySQL")
    
    # Get stats
    stats = db.get_stats()
    print(f"\n📊 Database Statistics:")
    print(f"   Total Papers: {stats['total_papers']}")
    print(f"   Total Summaries: {stats['total_summaries']}")
    print(f"   Total Q&A: {stats['total_qa']}")
    
    db.disconnect()

if __name__ == "__main__":
    migrate_json_to_mysql()
```

Run it:
```bash
python migration.py
```

---

## Summary Format

If your summaries are stored separately, adapt similarly:

```python
# Storing summaries with metadata
db_manager.save_summary(
    paper_id="arxiv_123",
    title="Paper Title",
    summary="The AI-generated summary...",
    ai_provider="gemini",  # or groq, openai, hf
    word_count=250
)

# Retrieving
summary = db_manager.get_summary("arxiv_123")
print(summary['summary'])
```

---

## Q&A Integration

For Q&A storage:

```python
# Save Q&A
db_manager.save_qa(
    paper_id="arxiv_123",
    question="What is the main contribution?",
    answer="The paper proposes...",
    ai_provider="groq",
    confidence_score=0.95
)

# Get Q&A for a paper
qa_history = db_manager.get_qa_for_paper("arxiv_123")
for qa in qa_history:
    print(f"Q: {qa['question']}")
    print(f"A: {qa['answer']}\n")
```

---

## Testing Your Integration

```bash
# Start your backend
python main_enhanced.py

# In another terminal, test the save endpoint
curl -X POST http://localhost:8000/api/save \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "test_001",
    "title": "Test Paper",
    "authors": ["Author 1"],
    "abstract": "Test abstract",
    "url": "https://example.com",
    "published_date": "2024-01-01"
  }'

# Test get endpoint
curl http://localhost:8000/api/saved | python -m json.tool
```

---

## Environment Variables

Make sure these are set in your `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=123456789
DATABASE_NAME=research_pilot_db
```

---

## Troubleshooting

**Problem:** "Can't connect to MySQL"
**Solution:** Check MySQL is running and credentials are correct

**Problem:** "Table already exists"
**Solution:** This is normal on second run, it's okay

**Problem:** "Access denied for user 'root'"
**Solution:** Check your password in `.env` matches your MySQL password

---

**You're ready to integrate MySQL!** 🎉
