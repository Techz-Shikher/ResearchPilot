# ✅ ResearchPilot MySQL Database Setup - Complete

## 📦 Files Created for You

1. **db_setup.sql** - Complete MySQL schema with 8 tables
2. **db_manager.py** - Python database wrapper with CRUD operations  
3. **setup_database.py** - Automated setup script
4. **QUICK_DB_SETUP.md** - Fast setup instructions
5. **.env** - Updated with your database credentials
6. **MYSQL_SETUP_GUIDE.md** - Comprehensive setup guide
7. **DATABASE_README.md** - Database overview and usage
8. **MYSQL_INTEGRATION.md** - Integration guide for main_enhanced.py
9. **setup_mysql.ps1** - Windows PowerShell setup script

---

## 🎯 Your Credentials

```
Host: localhost
Port: 3306
User: root
Password: 123456789
Database Name: research_pilot_db
```

✅ **Already added to `.env` file**

---

## ⚡ Quick Start (2 Steps)

### Step 1: Install MySQL Connector
```bash
pip install mysql-connector-python
```

### Step 2: Create Database
```bash
# Navigate to backend folder
cd ResearchPilot/backend

# Run automated setup (Windows)
python setup_database.py

# Or manually
mysql -u root -p123456789 < db_setup.sql
```

**Done!** ✨

---

## 📚 Database Tables

| Table | Purpose |
|-------|---------|
| `papers` | Store research papers & metadata |
| `summaries` | AI-generated summaries |
| `qa_entries` | Q&A interactions |
| `recommendations` | Similar paper suggestions |
| `literature_reviews` | Full review documents |
| `uploads` | PDF file tracking |
| `search_history` | Search activity log |
| `users` | User accounts (optional) |

---

## 🔧 Using the Database in Python

### Connect
```python
from db_manager import DatabaseManager

db = DatabaseManager()
db.connect()
```

### Save a Paper
```python
db.save_paper(
    paper_id='arxiv_123',
    title='Quantum Computing',
    authors=['Dr. Smith'],
    abstract='Abstract text...',
    url='https://arxiv.org/abs/xxxx',
    published_date='2024-01-01'
)
```

### Get Papers
```python
papers = db.get_all_papers(limit=100)
for paper in papers:
    print(f"{paper['paper_id']}: {paper['title']}")
```

### Save Summary
```python
db.save_summary(
    paper_id='arxiv_123',
    title='Quantum Computing',
    summary='AI-generated summary...',
    ai_provider='gemini',
    word_count=250
)
```

### Save Q&A
```python
db.save_qa(
    paper_id='arxiv_123',
    question='What is the main contribution?',
    answer='The paper proposes...',
    ai_provider='groq',
    confidence_score=0.95
)
```

### Get Stats
```python
stats = db.get_stats()
print(f"Papers: {stats['total_papers']}")
print(f"Summaries: {stats['total_summaries']}")
print(f"Q&A: {stats['total_qa']}")
```

### Disconnect
```python
db.disconnect()
```

---

## 🔗 Integrating with main_enhanced.py

See **MYSQL_INTEGRATION.md** for detailed steps to:
1. Replace JSON storage with MySQL
2. Update each endpoint
3. Migrate existing data

Quick summary:
- Replace `load_db()` / `save_db()` with `DatabaseManager`
- Update `/api/save` endpoint to use `db_manager.save_paper()`
- Update `/api/saved` endpoint to use `db_manager.get_all_papers()`
- Add startup/shutdown events for connection management

---

## ✅ Verification

### Test Connection
```bash
python -c "from db_manager import DatabaseManager; db = DatabaseManager(); db.connect() and print('✅ Connected!') or print('❌ Failed'); db.disconnect()"
```

### Check Database via MySQL
```bash
mysql -u root -p123456789 research_pilot_db
mysql> SHOW TABLES;
mysql> SELECT COUNT(*) FROM papers;
```

### Run Full Setup Script
```bash
python setup_database.py
```

---

## 🚀 Next Steps

1. **Install package**: `pip install mysql-connector-python`
2. **Create database**: `python setup_database.py` or `mysql -u root -p123456789 < db_setup.sql`
3. **Test connection**: Run verification above
4. **Integrate with backend**: Follow MYSQL_INTEGRATION.md
5. **Migrate data**: If you have existing JSON data, see MYSQL_INTEGRATION.md
6. **Test endpoints**: Start backend and test `/api/save`, `/api/saved`

---

## 📖 Documentation

- **QUICK_DB_SETUP.md** - Simple setup instructions
- **MYSQL_SETUP_GUIDE.md** - Detailed setup with troubleshooting
- **MYSQL_INTEGRATION.md** - How to integrate with main_enhanced.py
- **DATABASE_README.md** - Complete database overview
- **db_manager.py** - Built-in documentation in code

---

## 🐛 Troubleshooting

**Q: Can't connect to database**
- Check MySQL is running
- Verify credentials in .env match your MySQL setup
- Try `mysql -u root -p123456789 research_pilot_db` to test

**Q: "Database already exists"**
- Normal on second run, safe to ignore

**Q: "Table already exists"  **
- Normal on second run, safe to ignore

**Q: MySQL password not working**
- Verify exact password: `123456789`
- Check if MySQL root has a different password set
- Reset MySQL root password if needed

**Q: Need to reset everything**
```bash
mysql -u root -p123456789 -e "DROP DATABASE IF EXISTS research_pilot_db;"
python setup_database.py
```

---

## 📊 Database Statistics

After setup, check your database:
```bash
python db_manager.py
```

Output:
```
✅ Connected to MySQL: research_pilot_db@localhost:3306
📊 Database Statistics:
   - Papers: 0
   - Summaries: 0
   - Q&A Entries: 0
   - Uploads: 0
```

---

## 🎉 You're All Set!

Your ResearchPilot AI now has a professional MySQL database backend.

**Start using it:**
```python
from db_manager import DatabaseManager

db = DatabaseManager()
db.connect()

# Your code here
db.disconnect()
```

**Questions?** Check the markdown files in this directory.

---

**Happy researching!** 🚀
