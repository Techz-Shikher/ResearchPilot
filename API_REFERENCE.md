# API Reference - ResearchPilot AI

Complete API documentation for all endpoints.

## Base Configuration

```
Base URL: http://localhost:8000/api
Timeout: 30 seconds
Content-Type: application/json (unless multipart)
```

## 1. Search Endpoints

### 1.1 Search Papers from arXiv

Search across arXiv database for papers.

```http
GET /api/search?query=<query>&max_results=<number>
```

**Query Parameters:**
- `query` (string, required): Search term (e.g., "machine learning", "AI in healthcare")
- `max_results` (integer, optional): 1-100, default 20

**Example Request:**
```bash
curl "http://localhost:8000/api/search?query=deep%20learning%20healthcare&max_results=10"
```

**Example Response:**
```json
{
  "success": true,
  "query": "deep learning healthcare",
  "total_results": 10,
  "results": [
    {
      "paper_id": "2401.12345",
      "title": "Deep Learning Applications in Medical Imaging",
      "authors": ["Dr. Jane Smith", "Prof. John Doe"],
      "abstract": "This paper explores the application of deep learning techniques...",
      "published_date": "2024-01-15",
      "updated_date": "2024-01-16",
      "pdf_url": "https://arxiv.org/pdf/2401.12345.pdf",
      "arxiv_url": "https://arxiv.org/abs/2401.12345",
      "categories": ["cs.LG", "cs.CV", "q-bio.QM"],
      "arxiv_id": "2401.12345"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid query
- `500`: Search failed

**Common Search Queries:**
- `"machine learning"` - General ML
- `"deep learning healthcare"` - Specific domain
- `"neural networks optimization"` - Specific technique
- `"quantum computing"` - Emerging field

---

## 2. Upload Endpoints

### 2.1 Upload PDF File

Upload a PDF document for local processing.

```http
POST /api/upload
Content-Type: multipart/form-data
```

**Body:**
- `file` (file, required): PDF file (max 50MB)

**Example Request:**
```bash
curl -F "file=@research_paper.pdf" http://localhost:8000/api/upload
```

**Example Response:**
```json
{
  "success": true,
  "filename": "research_paper.pdf",
  "paper_id": "local_1705779001.5",
  "text": "Abstract: This paper presents a novel approach to...",
  "page_count": 12,
  "message": "PDF uploaded and processed successfully"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid file type
- `413`: File too large
- `500`: Processing failed

**Limitations:**
- Only PDF files accepted
- Maximum 50MB
- Complex layouts may lose formatting

---

## 3. Summarization Endpoints

### 3.1 Generate Paper Summary

Create AI-powered structured summary.

```http
POST /api/summarize
Content-Type: application/json
```

**Body:**
```json
{
  "paper_id": "2401.12345",
  "text": "Full paper text content..."
}
```

**Example Response:**
```json
{
  "success": true,
  "paper_id": "2401.12345",
  "summary": "This paper presents a novel deep learning approach for medical image segmentation. The method achieves state-of-the-art results on benchmark datasets with 95% accuracy. The authors propose a hybrid architecture combining convolutional neural networks with attention mechanisms.",
  "key_contributions": [
    "Novel hybrid CNN-attention architecture for medical imaging",
    "Achieved 95% accuracy on ImageNet medical subset",
    "Reduced computational complexity by 40% vs. baseline models",
    "Demonstrated transferability across different medical imaging modalities"
  ],
  "methodology": "The research employs a hybrid deep learning approach combining convolutional neural networks with self-attention mechanisms. The model is trained on a dataset of 50,000 annotated medical images using cross-entropy loss and Adam optimizer.",
  "limitations": "The study is limited to 2D images; extension to 3D volumetric data requires additional research. Performance may vary on images from different medical imaging equipment.",
  "future_scope": "Future work should explore 3D volumetric medical imaging, real-time processing optimization, and deployment in clinical settings."
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing text
- `500`: Summarization failed

**Notes:**
- Uses Gemini API if key provided
- Falls back to transformer model if no API key
- Typical response time: 3-10 seconds
- Handles documents up to 4000 characters

---

## 4. Question & Answer Endpoints

### 4.1 Ask Question About Paper (RAG)

Ask contextual questions using RAG retrieval.

```http
POST /api/ask
Content-Type: application/json
```

**Body:**
```json
{
  "paper_id": "2401.12345",
  "question": "What is the main finding of this research?",
  "text": "Full paper text content..."
}
```

**Example Response:**
```json
{
  "success": true,
  "paper_id": "2401.12345",
  "question": "What is the main finding of this research?",
  "answer": "The main finding demonstrates that the hybrid CNN-attention architecture achieves 95% accuracy on medical image segmentation tasks, outperforming previous approaches by 5%. This improvement comes from the model's ability to focus on salient features while maintaining computational efficiency.",
  "sources": [
    {
      "text": "Our hybrid architecture combines CNNs with self-attention mechanisms, achieving 95% accuracy on medical image segmentation. The model reduces computational complexity by 40%...",
      "score": 0.94,
      "doc_id": "2401.12345"
    },
    {
      "text": "Compared to baseline models, our approach reduces training time from 8 hours to 4.8 hours while maintaining accuracy. This efficiency is crucial for clinical deployment...",
      "score": 0.87,
      "doc_id": "2401.12345"
    }
  ],
  "confidence": 0.92
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing question or text
- `500`: Processing failed

**Confidence Score Interpretation:**
- `0.9+`: Very confident answer
- `0.7-0.9`: Good confidence
- `0.5-0.7`: Moderate confidence
- `<0.5`: Lower confidence

---

## 5. Paper Management Endpoints

### 5.1 Save Paper to Library

Save a paper to your personal library.

```http
POST /api/save
Content-Type: application/json
```

**Body:**
```json
{
  "paper_id": "2401.12345",
  "title": "Deep Learning for Medical Imaging",
  "authors": ["Dr. Jane Smith", "Prof. John Doe"],
  "abstract": "This paper explores...",
  "url": "https://arxiv.org/abs/2401.12345",
  "published_date": "2024-01-15"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Paper saved successfully",
  "paper_id": "2401.12345"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid data
- `500`: Save failed

---

### 5.2 Get Saved Papers

Retrieve all papers in your library.

```http
GET /api/saved
```

**Example Response:**
```json
{
  "success": true,
  "total": 3,
  "papers": [
    {
      "paper_id": "2401.12345",
      "title": "Deep Learning for Medical Imaging",
      "authors": ["Dr. Jane Smith"],
      "abstract": "This paper explores...",
      "url": "https://arxiv.org/abs/2401.12345",
      "published_date": "2024-01-15",
      "saved_date": "2024-01-20T10:30:00",
      "notes": ""
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `500`: Retrieval failed

---

## 6. Recommendation Endpoints

### 6.1 Get Similar Papers

Find papers similar to a given paper.

```http
GET /api/recommend?paper_id=<paper_id>
```

**Query Parameters:**
- `paper_id` (string, required): ID of reference paper

**Example Response:**
```json
{
  "success": true,
  "paper_id": "2401.12345",
  "similar_papers": [
    {
      "doc_id": "2401.54321",
      "text": "This paper presents an enhanced CNN architecture with attention mechanisms for medical imaging applications...",
      "score": 0.92,
      "metadata": {}
    },
    {
      "doc_id": "2401.98765",
      "text": "Deep learning methods for biomedical image analysis have shown remarkable progress in recent years...",
      "score": 0.87,
      "metadata": {}
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid paper_id
- `500`: Search failed

---

## 7. Literature Review Endpoints

### 7.1 Generate Literature Review

Generate comprehensive literature review for a topic.

```http
POST /api/literature-review
Content-Type: application/json
```

**Body:**
```json
{
  "topic": "Deep Learning in Medical Imaging",
  "num_papers": 5
}
```

**Example Response:**
```json
{
  "success": true,
  "review": {
    "topic": "Deep Learning in Medical Imaging",
    "generated_date": "2024-01-20T10:30:00",
    "introduction": "This literature review explores recent research on deep learning in medical imaging. The following 5 key papers provide insights into current trends and developments in this rapidly evolving field.",
    "papers": [
      {
        "title": "Deep Learning Applications in Medical Imaging",
        "authors": ["Dr. Jane Smith"],
        "summary": "This paper reviews deep learning techniques applied to medical image analysis...",
        "key_contributions": [
          "Survey of CNN architectures for medical imaging",
          "Comparison of training strategies"
        ]
      }
    ],
    "research_gaps": [
      "Limited cross-disciplinary approaches",
      "Need for more real-world applications",
      "Lack of standardized evaluation metrics",
      "Limited long-term impact studies"
    ],
    "conclusion": "The research on deep learning in medical imaging shows diverse approaches and methodologies. Future work should focus on integrating these approaches and addressing remaining gaps."
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid topic
- `500`: Generation failed

---

## 8. Health & Status Endpoints

### 8.1 Health Check

Check API and service status.

```http
GET /api/health
```

**Example Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00",
  "vector_store_ready": true,
  "uploads_dir": true,
  "db_dir": true
}
```

**Status Codes:**
- `200`: Healthy
- `500`: Service issues

---

### 8.2 Root Health Check

Quick API health check.

```http
GET /
```

**Example Response:**
```json
{
  "status": "operational",
  "message": "ResearchPilot AI Agent is running",
  "version": "1.0.0"
}
```

---

## Error Handling

### Error Response Format

All errors return consistent format:

```json
{
  "detail": "Description of what went wrong"
}
```

### Common Errors

| Status | Message | Cause | Solution |
|--------|---------|-------|----------|
| 400 | File must be a PDF | Uploaded non-PDF | Upload PDF file |
| 400 | Query is required | Missing search query | Provide query parameter |
| 413 | File too large | Exceeded 50MB | Use smaller PDF |
| 500 | Internal server error | Server crashed | Check server logs |
| 502 | Bad gateway | Backend unavailable | Restart backend |

---

## Rate Limiting

Current limits (per IP):
- Search: 100 requests/minute
- Upload: 10 files/minute
- Ask: 50 questions/minute

Gemini API limits:
- Free tier: 60 requests/minute
- Paid tier: 2000+ requests/minute

---

## Best Practices

### 1. Error Handling
Always check `success` field before using response:
```javascript
if (response.data.success) {
  // Use response data
}
```

### 2. Timeout Handling
Summarization and Q&A can take 5-10 seconds:
```javascript
axios.defaults.timeout = 30000; // 30 seconds
```

### 3. File Upload
Always validate file type on client:
```javascript
if (!file.type.includes('pdf')) {
  alert('Please upload a PDF');
}
```

### 4. Search Optimization
Use specific terms for better results:
```
Good: "transformer models natural language processing"
Poor: "AI"
```

---

## Code Examples

### JavaScript/React
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

// Search
const results = await api.get('/search', {
  params: { query: 'machine learning', max_results: 10 }
});

// Ask question
const answer = await api.post('/ask', {
  paper_id: '2401.12345',
  question: 'What is the main finding?',
  text: paperText
});
```

### Python
```python
import requests

BASE_URL = 'http://localhost:8000/api'

# Search
response = requests.get(f'{BASE_URL}/search', 
  params={'query': 'machine learning', 'max_results': 10})

# Ask question
response = requests.post(f'{BASE_URL}/ask',
  json={
    'paper_id': '2401.12345',
    'question': 'What is the main finding?',
    'text': paper_text
  })
```

### cURL
```bash
# Search
curl "http://localhost:8000/api/search?query=machine%20learning&max_results=10"

# Save paper
curl -X POST http://localhost:8000/api/save \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "2401.12345",
    "title": "Paper Title",
    "authors": ["Author 1"],
    "abstract": "...",
    "url": "https://arxiv.org/abs/...",
    "published_date": "2024-01-15"
  }'
```

---

Last Updated: January 2024 | API Version: 1.0.0
