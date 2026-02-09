"""
ResearchPilot AI - MySQL Database Management
Provides utilities for database initialization, migrations, and queries
"""

import mysql.connector
from mysql.connector import Error
import os
import logging
from typing import Dict, List, Optional
from datetime import datetime
from pathlib import Path
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Manages MySQL database connections and operations"""
    
    def __init__(self, host: str = None, user: str = None, 
                 password: str = None, database: str = None):
        """Initialize database connection parameters from .env or arguments"""
        # Use provided parameters or fall back to environment variables
        self.host = host or os.getenv('DATABASE_HOST', 'localhost')
        self.user = user or os.getenv('DATABASE_USER', 'root')
        self.password = password or os.getenv('DATABASE_PASSWORD', '')
        self.database = database or os.getenv('DATABASE_NAME', 'research_pilot_db')
        self.port = int(os.getenv('DATABASE_PORT', 3306))
        self.connection = None
        self.cursor = None
    
    def connect(self) -> bool:
        """Establish MySQL connection"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database
            )
            self.cursor = self.connection.cursor(dictionary=True)
            logger.info(f"✅ Connected to MySQL: {self.database}@{self.host}:{self.port}")
            return True
        except Error as e:
            logger.error(f"❌ Database connection failed: {e}")
            return False
    
    def disconnect(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.connection and self.connection.is_connected():
            self.connection.close()
            logger.info("❌ Disconnected from MySQL")
    
    def execute_query(self, query: str, params: tuple = None) -> bool:
        """Execute a query (INSERT, UPDATE, DELETE)"""
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            self.connection.commit()
            logger.info(f"✅ Query executed: {query[:60]}...")
            return True
        except Error as e:
            logger.error(f"❌ Query error: {e}")
            self.connection.rollback()
            return False
    
    def fetch_all(self, query: str, params: tuple = None) -> List[Dict]:
        """Fetch multiple rows"""
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            return self.cursor.fetchall()
        except Error as e:
            logger.error(f"❌ Fetch error: {e}")
            return []
    
    def fetch_one(self, query: str, params: tuple = None) -> Optional[Dict]:
        """Fetch single row"""
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            return self.cursor.fetchone()
        except Error as e:
            logger.error(f"❌ Fetch error: {e}")
            return None
    
    def run_setup_script(self, script_path: str) -> bool:
        """Run SQL setup script from file"""
        try:
            if not os.path.exists(script_path):
                logger.error(f"❌ Setup script not found: {script_path}")
                return False
            
            with open(script_path, 'r') as f:
                script = f.read()
            
            # Split by semicolon and execute each statement
            statements = [s.strip() for s in script.split(';') if s.strip() and not s.strip().startswith('--')]
            
            for statement in statements:
                if statement:
                    self.cursor.execute(statement)
            
            self.connection.commit()
            logger.info(f"✅ Setup script executed successfully: {script_path}")
            return True
        except Error as e:
            logger.error(f"❌ Setup script error: {e}")
            self.connection.rollback()
            return False
    
    # =============== PAPER OPERATIONS ===============
    
    def save_paper(self, paper_id: str, title: str, authors: list, 
                   abstract: str, url: str, published_date: str, 
                   notes: str = "", content: str = "", file_path: str = "") -> bool:
        """Save a paper to database"""
        query = """
            INSERT INTO papers (paper_id, title, authors, abstract, url, published_date, notes, content, file_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                authors = VALUES(authors),
                abstract = VALUES(abstract),
                url = VALUES(url),
                notes = VALUES(notes),
                content = VALUES(content),
                file_path = VALUES(file_path),
                updated_at = CURRENT_TIMESTAMP
        """
        params = (paper_id, title, json.dumps(authors), abstract, url, published_date, notes, content, file_path)
        return self.execute_query(query, params)
    
    def get_paper(self, paper_id: str) -> Optional[Dict]:
        """Get a single paper by ID"""
        query = "SELECT * FROM papers WHERE paper_id = %s"
        return self.fetch_one(query, (paper_id,))
    
    def get_all_papers(self, limit: int = 100, offset: int = 0) -> List[Dict]:
        """Get all papers with pagination"""
        query = "SELECT * FROM papers ORDER BY saved_date DESC LIMIT %s OFFSET %s"
        return self.fetch_all(query, (limit, offset))
    
    def delete_paper(self, paper_id: str) -> bool:
        """Delete a paper (cascades to summaries, QA, etc.)"""
        query = "DELETE FROM papers WHERE paper_id = %s"
        return self.execute_query(query, (paper_id,))
    
    # =============== SUMMARY OPERATIONS ===============
    
    def save_summary(self, paper_id: str, title: str, summary: str, 
                    ai_provider: str = "unknown", word_count: int = 0) -> bool:
        """Save a paper summary"""
        query = """
            INSERT INTO summaries (paper_id, title, summary, ai_provider, word_count)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                summary = VALUES(summary),
                ai_provider = VALUES(ai_provider),
                word_count = VALUES(word_count),
                updated_at = CURRENT_TIMESTAMP
        """
        params = (paper_id, title, summary, ai_provider, word_count)
        return self.execute_query(query, params)
    
    def get_summary(self, paper_id: str) -> Optional[Dict]:
        """Get summary for a paper"""
        query = "SELECT * FROM summaries WHERE paper_id = %s"
        return self.fetch_one(query, (paper_id,))
    
    # =============== Q&A OPERATIONS ===============
    
    def save_qa(self, paper_id: str, question: str, answer: str, 
               ai_provider: str = "unknown", confidence_score: float = 0.0) -> bool:
        """Save a Q&A entry"""
        query = """
            INSERT INTO qa_entries (paper_id, question, answer, ai_provider, confidence_score)
            VALUES (%s, %s, %s, %s, %s)
        """
        params = (paper_id, question, answer, ai_provider, confidence_score)
        return self.execute_query(query, params)
    
    def get_qa_for_paper(self, paper_id: str) -> List[Dict]:
        """Get all Q&A for a paper"""
        query = "SELECT * FROM qa_entries WHERE paper_id = %s ORDER BY created_at DESC"
        return self.fetch_all(query, (paper_id,))
    
    # =============== RECOMMENDATION OPERATIONS ===============
    
    def save_recommendation(self, source_paper_id: str, recommended_paper_id: str,
                          similarity_score: float = 0.0, reason: str = "",
                          ai_provider: str = "unknown") -> bool:
        """Save a paper recommendation"""
        query = """
            INSERT INTO recommendations (source_paper_id, recommended_paper_id, similarity_score, reason, ai_provider)
            VALUES (%s, %s, %s, %s, %s)
        """
        params = (source_paper_id, recommended_paper_id, similarity_score, reason, ai_provider)
        return self.execute_query(query, params)
    
    def get_recommendations(self, source_paper_id: str, limit: int = 10) -> List[Dict]:
        """Get recommendations for a paper"""
        query = """
            SELECT * FROM recommendations 
            WHERE source_paper_id = %s 
            ORDER BY similarity_score DESC 
            LIMIT %s
        """
        return self.fetch_all(query, (source_paper_id, limit))
    
    # =============== STATISTICS ===============
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        stats = {}
        
        # Count papers
        result = self.fetch_one("SELECT COUNT(*) as count FROM papers")
        stats['total_papers'] = result['count'] if result else 0
        
        # Count summaries
        result = self.fetch_one("SELECT COUNT(*) as count FROM summaries")
        stats['total_summaries'] = result['count'] if result else 0
        
        # Count Q&A entries
        result = self.fetch_one("SELECT COUNT(*) as count FROM qa_entries")
        stats['total_qa'] = result['count'] if result else 0
        
        # Count uploads
        result = self.fetch_one("SELECT COUNT(*) as count FROM uploads")
        stats['total_uploads'] = result['count'] if result else 0
        
        return stats


def initialize_database(host: str = "localhost", user: str = "root", 
                       password: str = "", setup_script_path: str = None) -> bool:
    """Initialize the database from setup script"""
    
    try:
        # First, connect to MySQL without specifying database (to create it)
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        cursor = connection.cursor()
        
        # Read and execute setup script
        if setup_script_path and os.path.exists(setup_script_path):
            with open(setup_script_path, 'r') as f:
                script = f.read()
            
            # Execute script statements
            for statement in script.split(';'):
                statement = statement.strip()
                if statement and not statement.startswith('--'):
                    try:
                        cursor.execute(statement)
                    except Error as e:
                        logger.warning(f"⚠️  Statement skipped: {e}")
            
            connection.commit()
            cursor.close()
            connection.close()
            
            logger.info("✅ Database initialized successfully!")
            return True
        else:
            logger.error("❌ Setup script not found")
            return False
            
    except Error as e:
        logger.error(f"❌ Database initialization failed: {e}")
        return False


if __name__ == "__main__":
    # Example usage
    logging.basicConfig(level=logging.INFO)
    
    # Initialize database
    setup_script = Path(__file__).parent / "db_setup.sql"
    initialize_database(setup_script_path=str(setup_script))
    
    # Connect and test
    db = DatabaseManager()
    if db.connect():
        stats = db.get_stats()
        print("\n📊 Database Statistics:")
        print(f"  - Papers: {stats['total_papers']}")
        print(f"  - Summaries: {stats['total_summaries']}")
        print(f"  - Q&A Entries: {stats['total_qa']}")
        print(f"  - Uploads: {stats['total_uploads']}")
        db.disconnect()
