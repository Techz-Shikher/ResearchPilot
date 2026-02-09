# 🚀 Quick MySQL Setup - Your Credentials

## Your Database Credentials

```
Host: localhost
Port: 3306
User: root
Password: 123456789
Database: research_pilot_db
```

---

## Setup Steps

### Step 1: Install MySQL Connector (if not already installed)

```bash
cd ResearchPilot/backend
pip install mysql-connector-python
```

### Step 2: Create MySQL Database

Run the SQL setup script with your password:

```bash
# Using command line with password
cd ResearchPilot/backend
mysql -u root -p123456789 < db_setup.sql
```

Or in PowerShell:

```powershell
cd "ResearchPilot/backend"
mysql -u root -p123456789 < db_setup.sql
```

### Step 3: Verify Connection

```bash
python db_manager.py
```

Should output:
```
✅ Connected to MySQL: research_pilot_db@localhost:3306
📊 Database Statistics:
  - Papers: 0
  - Summaries: 0
  - Q&A Entries: 0
  - Uploads: 0
```

---

## ✅ Configuration Already Set

Your `.env` file has been updated with:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=123456789
DATABASE_NAME=research_pilot_db
```

**Everything is configured! Just run the setup command above.** ✨

---

## Test Database Connection

```python
from db_manager import DatabaseManager

db = DatabaseManager()
if db.connect():
    print("✅ Database connected successfully!")
    stats = db.get_stats()
    print(f"Papers: {stats['total_papers']}")
    db.disconnect()
```

---

## Windows PowerShell Quick Setup

```powershell
# Navigate to backend
cd "f:\hackathon project AI\ResearchPilot\backend"

# Install MySQL package
pip install mysql-connector-python -q

# Create database
mysql -u root -p123456789 < db_setup.sql

# Test connection
python -c "from db_manager import DatabaseManager; db = DatabaseManager(); db.connect() and print('✅ Connected!') or print('❌ Failed'); db.disconnect()"
```

---

## If You Need to Reset

Drop and recreate:

```bash
mysql -u root -p123456789 -e "DROP DATABASE IF EXISTS research_pilot_db;"
mysql -u root -p123456789 < db_setup.sql
```

---

**You're ready to use MySQL!** 🗄️
