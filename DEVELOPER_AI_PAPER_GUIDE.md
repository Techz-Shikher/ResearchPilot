# 🚀 AI Paper Generation - Developer Quick Reference

## Quick Start

### Backend Endpoints

#### 1. Generate Individual Paper Section
```bash
POST /api/generate-paper-section

curl -X POST http://localhost:8000/api/generate-paper-section \
  -H "Content-Type: application/json" \
  -d '{
    "type": "abstract",
    "title": "ML in Healthcare",
    "topic": "Using deep learning for disease diagnosis",
    "keywords": ["machine learning", "healthcare", "diagnosis"],
    "words": 300,
    "style": "technical",
    "aiProvider": "groq"
  }'
```

#### 2. Create Complete Paper with AI
```bash
POST /api/create-paper-with-ai

curl -X POST http://localhost:8000/api/create-paper-with-ai \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Machine Learning in Healthcare",
    "topic": "Exploring deep learning for disease diagnosis",
    "keywords": ["ML", "healthcare", "diagnosis"],
    "numSections": 5,
    "wordsPerSection": 600,
    "researchStyle": "technical",
    "aiProvider": "openai",
    "language": "english",
    "includeReferences": true
  }'
```

## Frontend Integration

### GeneratePaper Component Usage

```jsx
import { GeneratePaperPage } from './pages/GeneratePaper';

// Auto-generated paper component handles:
// - Configuration (title, topic, keywords, style, provider)
// - Section-by-section generation
// - Complete paper generation
// - Download and publishing
```

### State Management
```jsx
const [paperConfig, setPaperConfig] = useState({
  title: '',
  topic: '',
  abstract: '',
  keywords: [],
  numSections: 5,
  wordsPerSection: 500,
  researchStyle: 'comprehensive',
  aiProvider: 'groq',
  language: 'english',
});

const [generatedPaper, setGeneratedPaper] = useState(null);
const [sections, setSections] = useState({});
```

## Key Features Implementation

### Feature 1: Smart AI Provider Selection
```python
# Backend automatically tries providers in order:
# 1. Gemini (unlimited, free)
# 2. Groq (fast, rate-limited)
# 3. OpenAI (best quality, paid)
# 4. HuggingFace (free fallback)

def call_ai(prompt: str, max_tokens: int = 1000) -> str:
    # Fallback chain implemented
```

### Feature 2: Section-Specific Prompts
```python
section_prompts = {
    'introduction': "Write compelling introduction with...",
    'literature_review': "Synthesize existing research about...",
    'methodology': "Explain research approach for...",
    'results': "Present findings objectively about...",
    'discussion': "Interpret results in context of...",
    'conclusion': "Summarize contributions and implications...",
    'references': "Generate academic citations in APA format..."
}
```

### Feature 3: Flexible Configuration
```python
# Supports customization:
- Number of sections (3-10)
- Words per section (200-2000)
- Research styles (Comprehensive, Technical, General)
- AI providers (Gemini, Groq, OpenAI, HF)
- Languages (currently English, extensible)
```

## File Structure

```
ResearchPilot/
├── backend/
│   └── main_enhanced.py (NEW: AI paper generation endpoints)
│       ├── GeneratePaperSectionRequest (model)
│       ├── CreateFullPaperRequest (model)
│       ├── generate_paper_abstract() (function)
│       ├── generate_paper_section() (function)
│       ├── /api/generate-paper-section (endpoint)
│       └── /api/create-paper-with-ai (endpoint)
│
├── frontend/
│   └── src/pages/
│       └── GeneratePaper.jsx (UPDATED: enhanced for AI generation)
│           ├── Configuration step
│           ├── Generation step
│           └── Review & download step
│
└── AI_PAPER_GENERATION_GUIDE.md (NEW: user guide)
```

## Database Integration

### Paper Storage
```python
# Saves generated papers to database
{
    "paper_id": "ai_1707234567890_1234",
    "title": "Research Paper Title",
    "authors": "ResearchPilot AI",
    "abstract": "Paper abstract...",
    "content": "Full paper content...",
    "published_date": "2026-02-09",
    "notes": "AI-generated, Category: Technology"
}
```

## Error Handling

### Try-Catch Flow
```
User Request
    ↓
Validate Input
    ↓
Call AI Providers (Gemini → Groq → OpenAI → HF)
    ↓
Success? Return Content
    ↓
All Failed? Return Smart Mock
    ↓
Log Errors & Return Response
```

## Performance Metrics

### Generation Time (Approximations)
```
Abstract:              30-60 seconds
Single Section:        1-3 minutes
Complete Paper (5 sec): 3-8 minutes
Complete Paper (10 sec): 5-15 minutes

Fastest: Groq (⚡ 30-60 sec per section)
Best Quality: OpenAI (🌟 1-2 min per section)
Balanced: Gemini (🚀 45-90 sec per section)
```

### Word Count Handling
```
- Abstract: 200-300 words
- Section: 200-2000 words (configurable)
- Complete Paper: Total = Abstract + (Sections × NumSections)
- With References: Add 200-400 words
```

## Testing

### Test Generate Abstract
```bash
# Quick test
curl -X POST http://localhost:8000/api/generate-paper-section \
  -H "Content-Type: application/json" \
  -d '{
    "type": "abstract",
    "title": "Test Paper",
    "topic": "Test topic",
    "keywords": ["test"],
    "words": 200,
    "style": "general",
    "aiProvider": "groq"
  }'
```

### Test Complete Paper
```bash
# Full paper generation test
curl -X POST http://localhost:8000/api/create-paper-with-ai \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Research Paper",
    "topic": "Testing AI paper generation",
    "keywords": ["test", "AI", "generation"],
    "numSections": 3,
    "wordsPerSection": 300,
    "researchStyle": "general",
    "aiProvider": "groq",
    "language": "english",
    "includeReferences": true
  }' | jq .
```

## Configuration

### Environment Variables Required
```env
# At least ONE AI provider must be configured:
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=sk-your_openai_key
HF_API_KEY=your_hf_key
```

## Common Issues & Fix

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| 400 Bad Request | Invalid request format | Check JSON structure matches models |
| 500 Server Error | AI provider failure | Check API keys, try different provider |
| Slow generation | Provider rate limit | Use Groq instead of OpenAI |
| Empty response | Provider quota exceeded | Add credits to OpenAI or try free providers |
| Connection timeout | Network issue | Increase request timeout, check internet |

## Code Examples

### Python: Generate Paper Section
```python
import requests

response = requests.post(
    'http://localhost:8000/api/generate-paper-section',
    json={
        'type': 'introduction',
        'title': 'My Research Paper',
        'topic': 'Topic description',
        'abstract': '',
        'sectionName': 'introduction',
        'keywords': ['keyword1', 'keyword2'],
        'words': 600,
        'style': 'technical',
        'aiProvider': 'openai'
    }
)

section_content = response.json()['content']
print(section_content)
```

### JavaScript: Generate Complete Paper
```javascript
const response = await fetch('/api/create-paper-with-ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Research Paper',
    topic: 'Topic description',
    keywords: ['keyword1', 'keyword2'],
    numSections: 5,
    wordsPerSection: 500,
    researchStyle: 'comprehensive',
    aiProvider: 'groq',
    language: 'english',
    includeReferences: true
  })
});

const paper = await response.json();
console.log(`Generated ${paper.sections_generated} sections`);
console.log(`Total words: ${paper.word_count}`);
```

## Next Steps

### For Users
1. ✅ Install/run the application
2. ✅ Navigate to "Generate Paper"
3. ✅ Configure your paper
4. ✅ Generate sections or complete paper
5. ✅ Download and edit

### For Developers
1. ✅ Review the backend code in `main_enhanced.py`
2. ✅ Test API endpoints with curl/Postman
3. ✅ Check frontend components in `GeneratePaper.jsx`
4. ✅ Extend with new features (PDF export, publishing, etc.)
5. ✅ Optimize for performance

---

**Version**: 1.0.0
**Last Updated**: February 9, 2026
**Status**: ✅ Production Ready
