-- ResearchPilot AI - MySQL Database Setup
-- This script creates all necessary tables for the ResearchPilot application
-- Run this with: mysql -u root -p < db_setup.sql

-- Create database
CREATE DATABASE IF NOT EXISTS research_pilot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE research_pilot_db;

-- ===============================
-- PAPERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paper_id VARCHAR(255) UNIQUE NOT NULL COMMENT 'Unique identifier from arxiv or external source',
    title VARCHAR(500) NOT NULL COMMENT 'Paper title',
    authors JSON COMMENT 'Array of authors',
    abstract LONGTEXT COMMENT 'Paper abstract',
    url VARCHAR(500) COMMENT 'URL to paper',
    published_date DATETIME COMMENT 'Publication date',
    saved_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'When saved to library',
    notes LONGTEXT COMMENT 'User notes about the paper',
    content LONGTEXT COMMENT 'Full paper content (for uploaded PDFs)',
    file_path VARCHAR(500) COMMENT 'Path to uploaded PDF file',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_paper_id (paper_id),
    INDEX idx_saved_date (saved_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores research papers';

-- ===============================
-- SUMMARIES TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS summaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paper_id VARCHAR(255) NOT NULL COMMENT 'Reference to papers table',
    title VARCHAR(500) COMMENT 'Paper title (denormalized for convenience)',
    summary LONGTEXT NOT NULL COMMENT 'AI-generated summary',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ai_provider VARCHAR(50) COMMENT 'Which AI provider generated this (gemini, groq, openai, hf)',
    word_count INT COMMENT 'Number of words in summary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_paper_summary (paper_id),
    FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    INDEX idx_paper_id (paper_id),
    INDEX idx_generated_at (generated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores AI-generated summaries of papers';

-- ===============================
-- Q&A TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS qa_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paper_id VARCHAR(255) NOT NULL COMMENT 'Reference to papers table',
    question VARCHAR(1000) NOT NULL COMMENT 'User question about the paper',
    answer LONGTEXT NOT NULL COMMENT 'AI-generated answer',
    ai_provider VARCHAR(50) COMMENT 'Which AI provider generated this',
    confidence_score FLOAT COMMENT 'Confidence in the answer (0-1)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    INDEX idx_paper_id (paper_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores Q&A interactions with papers';

-- ===============================
-- RECOMMENDATIONS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_paper_id VARCHAR(255) NOT NULL COMMENT 'Reference to papers table (source paper)',
    recommended_paper_id VARCHAR(255) NOT NULL COMMENT 'Recommended related paper ID',
    similarity_score FLOAT COMMENT 'Similarity score (0-1)',
    reason TEXT COMMENT 'Why this paper was recommended',
    ai_provider VARCHAR(50) COMMENT 'Which AI provider generated this',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    INDEX idx_source_paper (source_paper_id),
    INDEX idx_recommended_paper (recommended_paper_id),
    INDEX idx_similarity (similarity_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores AI-generated paper recommendations';

-- ===============================
-- LITERATURE REVIEWS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS literature_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id VARCHAR(255) UNIQUE NOT NULL COMMENT 'Unique review identifier',
    topic VARCHAR(500) NOT NULL COMMENT 'Topic of the literature review',
    papers JSON NOT NULL COMMENT 'Array of paper_ids included in the review',
    review_content LONGTEXT COMMENT 'Generated literature review content',
    ai_provider VARCHAR(50) COMMENT 'Which AI provider generated this',
    num_papers INT COMMENT 'Number of papers included',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_topic (topic),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores generated literature reviews';

-- ===============================
-- SEARCH HISTORY TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query VARCHAR(1000) NOT NULL COMMENT 'Search query',
    results_count INT COMMENT 'Number of results returned',
    search_source VARCHAR(100) COMMENT 'Source of search (arxiv, uploaded, saved)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_query (query),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Search activity log for analytics';

-- ===============================
-- UPLOADS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(500) NOT NULL COMMENT 'Original filename',
    file_path VARCHAR(500) NOT NULL COMMENT 'Path to file on disk',
    file_size BIGINT COMMENT 'File size in bytes',
    paper_id VARCHAR(255) COMMENT 'Associated paper ID (after processing)',
    extracted_text LONGTEXT COMMENT 'Extracted text from PDF',
    processing_status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, processed, error',
    error_message TEXT COMMENT 'Error details if processing failed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE SET NULL,
    INDEX idx_paper_id (paper_id),
    INDEX idx_status (processing_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PDF upload tracking';

-- ===============================
-- USERS TABLE (Optional - for future multi-user support)
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) COMMENT 'Hashed password',
    api_key VARCHAR(255) UNIQUE COMMENT 'API key for external integrations',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_api_key (api_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts (for future multi-user support)';

-- ===============================
-- SYSTEM CONFIG TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value LONGTEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System configuration settings';

-- ===============================
-- SAMPLE DATA (Optional - Remove if not needed)
-- ===============================
-- INSERT INTO papers (paper_id, title, authors, abstract, url, published_date) VALUES
-- ('arxiv_001', 'Quantum Transformers v2', '["Dr. Smith", "Dr. Johnson"]', 'This paper proposes...', 'https://arxiv.org/abs/xxxx', NOW());

-- ===============================
-- VIEWS (Optional - for convenience)
-- ===============================
-- View: Papers with their latest summary
CREATE OR REPLACE VIEW v_papers_with_summaries AS
SELECT 
    p.paper_id,
    p.title,
    p.authors,
    p.published_date,
    p.saved_date,
    s.summary,
    s.generated_at
FROM papers p
LEFT JOIN summaries s ON p.paper_id = s.paper_id;

-- View: Paper Q&A count
CREATE OR REPLACE VIEW v_paper_qa_stats AS
SELECT 
    paper_id,
    COUNT(*) as qa_count,
    MAX(created_at) as last_qa_date
FROM qa_entries
GROUP BY paper_id;

-- ===============================
-- CREATE INDEXES FOR PERFORMANCE
-- ===============================
-- Already created above with table definitions

PRINT '\n✅ Database setup complete! Tables created successfully.\n';
