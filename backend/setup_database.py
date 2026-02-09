#!/usr/bin/env python
"""
ResearchPilot MySQL Database - Automated Setup Script
Run this script to automatically set up your MySQL database
"""

import subprocess
import sys
import logging
from pathlib import Path
from db_manager import DatabaseManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_mysql_installed():
    """Check if MySQL is installed"""
    logger.info("📋 Checking MySQL installation...")
    try:
        result = subprocess.run(['mysql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            logger.info(f"✅ MySQL found: {result.stdout.strip()}")
            return True
        else:
            logger.error("❌ MySQL not found in PATH")
            return False
    except FileNotFoundError:
        logger.error("❌ MySQL is not installed or not in PATH")
        return False

def run_sql_setup():
    """Run the SQL setup script"""
    logger.info("📋 Creating MySQL database...")
    
    setup_script = Path(__file__).parent / "db_setup.sql"
    if not setup_script.exists():
        logger.error(f"❌ Setup script not found: {setup_script}")
        return False
    
    # Get credentials from environment
    user = os.getenv('DATABASE_USER', 'root')
    password = os.getenv('DATABASE_PASSWORD', '')
    
    try:
        # Run mysql with the setup script
        cmd = f'mysql -u {user} -p{password} < "{setup_script}"'
        
        # On Windows, we need to handle this differently
        if sys.platform == 'win32':
            # Use shell=True on Windows
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        else:
            # On Unix, use shell=False and list format
            with open(setup_script, 'r') as f:
                sql_content = f.read()
            cmd = ['mysql', '-u', user, f'-p{password}']
            result = subprocess.run(cmd, input=sql_content, capture_output=True, text=True)
        
        if result.returncode == 0:
            logger.info("✅ Database created successfully!")
            if result.stdout:
                logger.info(result.stdout)
            return True
        else:
            logger.error(f"❌ Error creating database: {result.stderr}")
            return False
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        return False

def verify_connection():
    """Verify database connection"""
    logger.info("📋 Verifying database connection...")
    
    db = DatabaseManager()
    if db.connect():
        logger.info("✅ Database connection successful!")
        
        # Get statistics
        stats = db.get_stats()
        logger.info(f"\n📊 Database Statistics:")
        logger.info(f"   - Papers: {stats['total_papers']}")
        logger.info(f"   - Summaries: {stats['total_summaries']}")
        logger.info(f"   - Q&A Entries: {stats['total_qa']}")
        logger.info(f"   - Uploads: {stats['total_uploads']}")
        
        db.disconnect()
        return True
    else:
        logger.error("❌ Failed to connect to database")
        return False

def main():
    """Main setup flow"""
    print("\n" + "="*80)
    print("🗄️  ResearchPilot MySQL Database Setup")
    print("="*80 + "\n")
    
    # Step 1: Check MySQL installation
    if not check_mysql_installed():
        print("\n❌ Setup aborted: MySQL is not installed")
        print("Install MySQL from: https://dev.mysql.com/downloads/mysql/")
        sys.exit(1)
    
    # Step 2: Run SQL setup
    if not run_sql_setup():
        print("\n❌ Setup aborted: Failed to create database")
        sys.exit(1)
    
    # Step 3: Verify connection
    if not verify_connection():
        print("\n❌ Warning: Could not verify database connection")
        print("Check your MySQL credentials in .env file")
        sys.exit(1)
    
    # Success!
    print("\n" + "="*80)
    print("✅ DATABASE SETUP COMPLETE!")
    print("="*80)
    print("\n✨ Your ResearchPilot database is ready to use!\n")
    print("📝 Configuration Summary:")
    print(f"   • Host: {os.getenv('DATABASE_HOST', 'localhost')}")
    print(f"   • User: {os.getenv('DATABASE_USER', 'root')}")
    print(f"   • Database: {os.getenv('DATABASE_NAME', 'research_pilot_db')}")
    print(f"   • Port: {os.getenv('DATABASE_PORT', 3306)}")
    
    print("\n🚀 Next Steps:")
    print("   1. Update main_enhanced.py to use db_manager.py")
    print("   2. Replace JSON storage with MySQL calls")
    print("   3. Start your backend: python main_enhanced.py")
    print()

if __name__ == "__main__":
    main()
