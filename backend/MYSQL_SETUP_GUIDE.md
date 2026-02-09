# MySQL Database Setup Guide for ResearchPilot AI

This guide will help you set up MySQL database for the ResearchPilot AI application.

## Prerequisites

- MySQL Server (5.7 or higher, MySQL 8.0+ recommended)
- Python 3.7+
- `mysql-connector-python` package

## 1. Install MySQL

### Windows
- Download from: https://dev.mysql.com/downloads/mysql/
- Or use: `choco install mysql`
- Or use: `winget install MySQL.Server`

### macOS
```bash
brew install mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
```

## 2. Start MySQL Server

### Windows
```powershell
# MySQL is usually installed as a service, verify it's running:
Get-Service MySQL80  # or MySQL57, depending on your version
# If not running, start it:
Start-Service MySQL80
```

### macOS/Linux
```bash
mysql.server start
# or
sudo systemctl start mysql
```

## 3. Verify MySQL Installation

```bash
mysql --version
# Should show: mysql  Ver 8.0.x or similar
```

## 4. Create MySQL User (Optional but Recommended)

```bash
# Login to MySQL as root
mysql -u root -p
# Enter your root password (or leave empty if no password set)
```

Then run in MySQL:
```sql
-- Create a new user for ResearchPilot
CREATE USER 'researchpilot'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant full privileges on the database
GRANT ALL PRIVILEGES ON research_pilot_db.* TO 'researchpilot'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

## 5. Install Python MySQL Connector

```bash
# Navigate to backend directory
cd ResearchPilot/backend

# Install the MySQL connector
pip install mysql-connector-python
```

## 6. Set Up the Database

### Option A: Using Python Script (Recommended)

```bash
# Navigate to backend directory
cd ResearchPilot/backend

# Run the database setup
python db_manager.py
```

This will:
- Connect to MySQL
- Create the `research_pilot_db` database
- Create all necessary tables
- Display database statistics

### Option B: Using MySQL Command Line

```bash
# Navigate to backend directory
cd ResearchPilot/backend

# Run the setup script
mysql -u root -p < db_setup.sql
# Enter your MySQL root password when prompted

# Or if you created a researchpilot user:
mysql -u researchpilot -p research_pilot_db < db_setup.sql
```

### Option C: Using MySQL Workbench

1. Open MySQL Workbench
2. Create a new connection to your MySQL server
3. Open the `db_setup.sql` file
4. Execute the script (Ctrl + Shift + Enter or click the lightning bolt)

## 7. Update Your Backend Configuration

Modify `main_enhanced.py` or create a `.env` file to use MySQL instead of JSON:

### Option 1: Update `.env` file

Add these variables:
```env
# MySQL Configuration
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=research_pilot_db
```

### Option 2: Update main_enhanced.py

Replace the current JSON-based storage with MySQL calls:

```python
from db_manager import DatabaseManager

# Initialize database manager
db_manager = DatabaseManager(
    host=os.getenv('DATABASE_HOST', 'localhost'),
    user=os.getenv('DATABASE_USER', 'root'),
    password=os.getenv('DATABASE_PASSWORD', ''),
    database=os.getenv('DATABASE_NAME', 'research_pilot_db')
)

# Connect on startup
if not db_manager.connect():
    logger.error("Failed to connect to database")
    sys.exit(1)

# Replace save_paper endpoint
@app.post("/api/save")
async def save_paper(request: SavePaperRequest):
    """Save paper to MySQL database"""
    try:
        db_manager.save_paper(
            paper_id=request.paper_id,
            title=request.title,
            authors=request.authors,
            abstract=request.abstract,
            url=request.url,
            published_date=request.published_date
        )
        return {"status": "saved", "paper_id": request.paper_id}
    except Exception as e:
        logger.error(f"Save error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

## 8. Verify Database Setup

```bash
# Connect to MySQL
mysql -u root -p research_pilot_db

# Check tables
SHOW TABLES;

# Check papers table structure
DESCRIBE papers;

# Exit
EXIT;
```

You should see these tables:
- `papers` - Main paper storage
- `summaries` - AI-generated summaries
- `qa_entries` - Question and answer pairs
- `recommendations` - Paper recommendations
- `literature_reviews` - Generated reviews
- `search_history` - Search logs
- `uploads` - PDF upload tracking
- `users` - User accounts (optional)
- `system_config` - System settings

## 9. Database Tables Overview

### Papers Table
Stores research papers with metadata:
- `paper_id` - Unique identifier
- `title` - Paper title
- `authors` - Author list (JSON)
- `abstract` - Paper abstract
- `url` - Link to paper
- `published_date` - Publication date
- `content` - Full text (for PDFs)
- `notes` - User notes

### Summaries Table
Stores AI-generated summaries:
- `paper_id` - Reference to paper
- `summary` - Generated summary text
- `ai_provider` - Which AI generated it
- `word_count` - Summary length

### Q&A Entries Table
Stores question-answer pairs:
- `paper_id` - Reference to paper
- `question` - User question
- `answer` - AI-generated answer
- `ai_provider` - Which AI generated it

### Other Tables
- **recommendations** - Similar paper suggestions
- **literature_reviews** - Full review documents
- **uploads** - PDF file tracking
- **search_history** - Search analytics
- **users** - Multi-user support (future)
- **system_config** - Configuration values

## 10. Backup and Restore

### Backup Database
```bash
mysqldump -u root -p research_pilot_db > backup.sql
# Or with username/password in one line:
mysqldump -u root research_pilot_db > backup.sql
```

### Restore Database
```bash
mysql -u root -p research_pilot_db < backup.sql
```

## 11. Common Issues

### Issue: "Can't connect to MySQL server"
**Solution:**
- Check if MySQL is running: `mysql --version`
- Restart MySQL server
- Verify connection credentials

### Issue: "Unknown database 'research_pilot_db'"
**Solution:**
- Run the setup script again: `python db_manager.py`
- Or manually: `mysql -u root -p < db_setup.sql`

### Issue: "Access denied for user 'root'@'localhost'"
**Solution:**
- Check your MySQL password
- Reset MySQL root password if needed
- Use a different user account

### Issue: "mysql-connector-python not found"
**Solution:**
```bash
pip install mysql-connector-python
```

## 12. Example Usage in Python

```python
from db_manager import DatabaseManager

# Create database manager
db = DatabaseManager(host='localhost', user='root', password='')

# Connect
if db.connect():
    # Save a paper
    db.save_paper(
        paper_id='arxiv_001',
        title='Quantum Transformers',
        authors=['Dr. Smith', 'Dr. Johnson'],
        abstract='A novel approach to quantum computing...',
        url='https://arxiv.org/abs/xxxx',
        published_date='2024-01-15'
    )
    
    # Get paper
    paper = db.get_paper('arxiv_001')
    print(paper)
    
    # Save summary
    db.save_summary('arxiv_001', 'Quantum Transformers', 'This paper proposes...', 'gemini', 250)
    
    # Save Q&A
    db.save_qa('arxiv_001', 'What is the main contribution?', 'The paper introduces...', 'groq', 0.95)
    
    # Get statistics
    stats = db.get_stats()
    print(f"Total papers: {stats['total_papers']}")
    
    # Disconnect
    db.disconnect()
```

## 13. Migration from JSON to MySQL

If you're migrating from the existing JSON database:

```python
import json
from db_manager import DatabaseManager
from pathlib import Path

# Load JSON data
json_path = Path('db/saved_papers.json')
with open(json_path, 'r') as f:
    json_data = json.load(f)

# Connect to MySQL
db = DatabaseManager()
db.connect()

# Migrate each paper
for paper_id, paper_data in json_data.items():
    db.save_paper(
        paper_id=paper_id,
        title=paper_data.get('title', ''),
        authors=paper_data.get('authors', []),
        abstract=paper_data.get('abstract', ''),
        url=paper_data.get('url', ''),
        published_date=paper_data.get('published_date', ''),
        notes=paper_data.get('notes', '')
    )

# Get stats
stats = db.get_stats()
print(f"✅ Migrated {stats['total_papers']} papers to MySQL")

db.disconnect()
```

## Support

If you encounter issues:
1. Check MySQL is running and accessible
2. Verify database credentials
3. Review MySQL error logs
4. Check the application logs for detailed error messages

---

**Ready to use! Your ResearchPilot AI now has a professional MySQL database backend.** 🚀
