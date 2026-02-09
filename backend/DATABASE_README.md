# 🗄️ ResearchPilot MySQL Database Setup - Quick Start

## What I've Created For You

I've created a complete MySQL database setup for your ResearchPilot AI project. Here's what was generated:

### 📁 Files Created

1. **`db_setup.sql`** - Complete MySQL database schema
   - Creates `research_pilot_db` database
   - 8 main tables with proper relationships
   - Indexes for performance
   - Views for convenience queries

2. **`db_manager.py`** - Python database wrapper
   - Easy connection management
   - CRUD operations for all tables
   - Built-in error handling
   - Statistics tracking

3. **`MYSQL_SETUP_GUIDE.md`** - Comprehensive setup guide
   - Step-by-step installation instructions
   - Configuration examples
   - Troubleshooting tips
   - Code examples

4. **`setup_mysql.ps1`** - Windows PowerShell setup script
   - Automated MySQL verification
   - Database creation
   - Python connector installation
   - One-command setup

5. **`requirements.txt`** - Updated with MySQL connector

---

## ⚡ Quick Setup (5 Minutes)

### Windows PowerShell (Fastest)
```powershell
# Navigate to backend folder
cd "ResearchPilot/backend"

# Run the setup script (requires admin or MySQL already installed)
powershell -ExecutionPolicy Bypass -File setup_mysql.ps1
```

### Manual Setup

**Step 1: Install MySQL Connector**
```bash
pip install mysql-connector-python
```

**Step 2: Create Database**
```bash
# Navigate to backend folder
cd ResearchPilot/backend

# Run setup script with your MySQL credentials
mysql -u root -p < db_setup.sql
# Or if no password:
mysql -u root < db_setup.sql
```

**Step 3: Verify (Optional)**
```bash
python db_manager.py
```

---

## 📊 Database Schema

### Tables Created

#### 1. **papers**
Stores research papers and metadata
```
- paper_id (PK)      : Unique identifier
- title              : Paper title
- authors            : JSON array
- abstract           : Paper abstract
- url                : Link to paper
- published_date     : Publication date
- content            : Full text content
- notes              : User notes
```

#### 2. **summaries**
AI-generated paper summaries
```
- paper_id (FK)      : Reference to paper
- summary            : Generated summary
- ai_provider        : Which AI generated it (gemini/groq/openai)
- word_count         : Summary length
```

#### 3. **qa_entries**
Q&A pairs about papers
```
- paper_id (FK)      : Reference to paper
- question           : User question
- answer             : AI answer
- ai_provider        : Which AI generated it
- confidence_score   : Confidence (0-1)
```

#### 4. **recommendations**
Paper recommendations based on similarity
```
- source_paper_id    : Paper being analyzed
- recommended_paper_id : Similar paper
- similarity_score   : How similar (0-1)
```

#### 5. **literature_reviews**
Complete literature review documents
```
- review_id          : Unique review ID
- topic              : Review topic
- papers             : JSON array of papers included
- review_content     : Full review text
```

#### 6. **uploads**
Track PDF file uploads
```
- filename           : Original filename
- file_path          : Path on disk
- paper_id           : Associated paper
- extracted_text     : Text from PDF
- processing_status  : pending/processed/error
```

#### 7. **search_history**
Search queries log
```
- query              : Search query
- results_count      : Number of results
- search_source      : Where from (arxiv/uploaded/saved)
```

#### 8. **users** (Optional)
For future multi-user support
```
- username           : User login
- email              : User email
- api_key            : API access key
```

---

## 🔧 Configuration

### Update `.env` File

Add these to your `.env` file:
```env
# MySQL Configuration
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=research_pilot_db

# (Keep your existing API keys below)
```

### Update `main_enhanced.py`

Replace the JSON storage lines:
```python
# OLD (JSON-based):
db_path = Path(__file__).parent / "db" / "saved_papers.json"
def load_db():
    if db_path.exists():
        with open(db_path, 'r') as f:
            return json.load(f)
    return {}

# NEW (MySQL-based):
from db_manager import DatabaseManager

db_manager = DatabaseManager(
    host=os.getenv('DATABASE_HOST', 'localhost'),
    user=os.getenv('DATABASE_USER', 'root'),
    password=os.getenv('DATABASE_PASSWORD', ''),
    database=os.getenv('DATABASE_NAME', 'research_pilot_db')
)

if not db_manager.connect():
    logger.error("Failed to connect to database")
    sys.exit(1)
```

---

## 💻 Python Usage Examples

### Save a Paper
```python
from db_manager import DatabaseManager

db = DatabaseManager()
db.connect()

db.save_paper(
    paper_id='arxiv_123',
    title='Quantum Computing Advances',
    authors=['Dr. Smith', 'Dr. Johnson'],
    abstract='This paper explores...',
    url='https://arxiv.org/abs/2401.xxxxx',
    published_date='2024-01-15'
)

db.disconnect()
```

### Save a Summary
```python
db.save_summary(
    paper_id='arxiv_123',
    title='Quantum Computing Advances',
    summary='This paper proposes a new approach to quantum computing...',
    ai_provider='gemini',
    word_count=250
)
```

### Save Q&A
```python
db.save_qa(
    paper_id='arxiv_123',
    question='What is the main contribution?',
    answer='The main contribution is a new quantum algorithm that...',
    ai_provider='groq',
    confidence_score=0.95
)
```

### Get Statistics
```python
stats = db.get_stats()
print(f"Total Papers: {stats['total_papers']}")
print(f"Total Summaries: {stats['total_summaries']}")
print(f"Total Q&A Entries: {stats['total_qa']}")
```

---

## 🚀 Getting Started

### Option 1: Import Existing JSON Data
```python
import json
from db_manager import DatabaseManager

# Load JSON
with open('db/saved_papers.json', 'r') as f:
    data = json.load(f)

# Connect to MySQL
db = DatabaseManager()
db.connect()

# Migrate each paper
for paper_id, paper_info in data.items():
    db.save_paper(
        paper_id=paper_id,
        title=paper_info.get('title', ''),
        authors=paper_info.get('authors', []),
        abstract=paper_info.get('abstract', ''),
        url=paper_info.get('url', ''),
        published_date=paper_info.get('published_date', ''),
        notes=paper_info.get('notes', '')
    )

print(f"✅ Migrated {data.keys().__len__()} papers")
db.disconnect()
```

### Option 2: Start Fresh
Just start using the database - it's ready to go!

---

## ✅ Verification

### Check Database
```bash
# Connect to MySQL
mysql -u root research_pilot_db

# List tables
SHOW TABLES;

# Check table structure
DESCRIBE papers;

# Count records
SELECT COUNT(*) as total_papers FROM papers;
```

### Test Python Connection
```bash
python db_manager.py
# Should show database statistics
```

---

## 🔄 Backup & Restore

### Backup
```bash
mysqldump -u root research_pilot_db > backup.sql
```

### Restore
```bash
mysql -u root research_pilot_db < backup.sql
```

---

## ❓ FAQ

**Q: Do I have to use MySQL?**
A: No! You can keep using JSON. MySQL is just more scalable and better for production.

**Q: What if I don't have a password set for MySQL root?**
A: Just omit the `-p` flag:
```bash
mysql -u root < db_setup.sql
```

**Q: Can I use a different MySQL version?**
A: Yes! The schema works with MySQL 5.7+ and MariaDB

**Q: How do I reset the database?**
A: Drop and recreate it:
```sql
DROP DATABASE research_pilot_db;
-- Then run db_setup.sql again
```

**Q: How do I change the database name?**
A: Edit `db_setup.sql` line 5 and your `.env` file

---

## 📚 Documentation

- **`MYSQL_SETUP_GUIDE.md`** - Full setup guide with troubleshooting
- **`db_manager.py`** - Source code with built-in documentation
- **`db_setup.sql`** - Complete schema with comments

---

## 🎯 Next Steps

1. ✅ Run the setup script: `powershell -ExecutionPolicy Bypass -File setup_mysql.ps1`
2. ✅ Update your `.env` file with database credentials
3. ✅ Update `main_enhanced.py` to use `db_manager.py` instead of JSON
4. ✅ Test with `python db_manager.py`
5. ✅ Start your backend: `python main_enhanced.py`

---

## 🆘 Troubleshooting

**Error: "Can't connect to MySQL server"**
- Check MySQL is running: `Get-Service MySQL*`
- Verify credentials in `.env`
- Check host/port

**Error: "database already exists"**
- Run with `--skip-if-exists` or drop the database first

**Error: "Table already exists"**
- Normal on second run, can safely ignore

**Python won't import mysql.connector**
- Install it: `pip install mysql-connector-python`

For more help, see **`MYSQL_SETUP_GUIDE.md`**

---

**You're all set! 🎉 Your ResearchPilot AI now has a professional MySQL database.**

Need help? Check the setup guide or run the PowerShell script for guided setup.
