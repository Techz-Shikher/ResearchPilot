# 🤖 ResearchPilot AI - Setup Guide

## ⚡ Quick Start (2 minutes)

The chat and PDF analysis issues are **NOW FIXED**! Here's what changed:

### ✅ What Was Fixed
1. **Chat responses** - Now uses full AI provider chain (Gemini → Groq → OpenAI → Hugging Face)
2. **PDF summarization** - Now extracts and analyzes full PDF content (not just abstract)
3. **AI fallback** - Added context-aware analysis when no AI provider is available
4. **Better logging** - You can now see exactly which AI provider is being used

### 🚀 Setup Steps

#### Step 1: Copy the environment file
```bash
cd ResearchPilot/backend
cp .env.example .env
```

#### Step 2: Add ONE AI Provider (choose one)

**Option A: Google Gemini (RECOMMENDED - Free & Unlimited)**
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create new API key for free
4. Copy it and paste into `.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

**Option B: Groq (Free tier, Ultra-fast)**
1. Go to https://console.groq.com/
2. Sign up for free
3. Create API key
4. Copy it to `.env`:
   ```
   GROQ_API_KEY=your_key_here
   ```

**Option C: OpenAI (Most reliable, requires payment)**
1. Go to https://platform.openai.com/api-keys
2. Sign up or login
3. Create new API key (requires payment method)
4. Copy it to `.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```

**Option D: Hugging Face (Free tier available)**
1. Go to https://huggingface.co/settings/tokens
2. Create new token
3. Copy it to `.env`:
   ```
   HF_API_KEY=your_key_here
   ```

#### Step 3: Install/update dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Run the backend
```bash
python main_enhanced.py
```

## 🔄 How AI Provider Chain Works

When you upload a PDF and ask questions:

1. **PDF Upload** → Extracts text using `pdfplumber` (always works)
2. **Ask Question** → Tries AI providers in order:
   - ✅ Try Gemini
   - ✅ Try Groq  
   - ✅ Try OpenAI
   - ✅ Try Hugging Face
   - ✅ Use smart context-aware mock if none available

3. **Summarize PDF** → Same AI chain, uses FULL extracted text

## 📊 Expected Results

### With Real AI (Recommended)
- ✅ Specific, detailed answers about your PDF
- ✅ Accurate summaries with real insights
- ✅ Content-aware responses using your PDF
- ✅ Proper analysis of methodology and findings

### Without Real AI (Mock/Context Analysis)
- ✅ Generic but relevant responses
- ✅ Based on detected topics in PDF
- ✅ Intelligent fallback analysis
- ✅ Still better than before!

## 🧪 Test Instructions

### 1. Verify API Connection
Run this to check if API is working:
```bash
curl http://localhost:8000/api/health
```

You should see something like:
```json
{
  "status": "ok",
  "message": "ResearchPilot AI is running!",
  "ai_enabled": true,
  "features": {
    "openai": true,
    "arxiv": true,
    "local_search": true
  }
}
```

### 2. Upload PDF and Get Summary
1. Go to http://localhost:5174 (frontend)
2. Upload a PDF file
3. Click "Summarize" 
4. Should now get REAL summary of your PDF (not generic)

### 3. Ask Questions
1. After uploading PDF, ask a question like:
   - "What is the main contribution of this paper?"
   - "What methodology did they use?"
   - "What are the limitations?"
2. Should get answer SPECIFIC TO YOUR PDF (not generic)

## 🐛 Troubleshooting

### Issue: "Still getting generic responses"
**Solution:**
1. Check `.env` file has your API key
2. Restart backend: `Ctrl+C` then `python main_enhanced.py`
3. Check logs for which provider was used
4. Wait 2-3 seconds for AI to respond (it takes time!)

### Issue: "API key not working"
1. Verify the key is correct (copy-paste exactly)
2. Check your account has API access/quota
3. Try a different provider
4. Check error logs in terminal

### Issue: "PDF extraction not working"
1. Ensure `pdfplumber==0.10.3` is installed
2. Run: `pip install pdfplumber==0.10.3`
3. Try uploading a different PDF

### Issue: Backend won't start
```bash
# If port 8000 is taken, use different port:
python main_enhanced.py --port 8001

# Or kill existing process:
lsof -ti:8000 | xargs kill -9  # macOS/Linux
# Or on Windows, find process using port 8000 and kill it
```

## 📈 Performance Tips

1. **PDF Upload**: Files work best when < 50MB
2. **Question Answering**: Works best with PDFs having clear structure
3. **Summarization**: Takes 5-10 seconds with real AI
4. **Mock Mode**: Instant but less specific

## 🔧 What Each Provider Is Best For

| Provider | Speed | Cost | Quality | Limits |
|----------|-------|------|---------|--------|
| **Gemini** | Medium | Free | Excellent | None |
| **Groq** | ⚡ Very Fast | Free | Good | 30 req/min |
| **OpenAI** | Medium | Paid | Excellent | Usage limits |
| **HuggingFace** | Slow | Free | Good | Rate limited |

## 📝 Expected Behavior After Fix

### Before (Generic Responses)
```
Q: "What methodology did they use?"
A: "The paper employs sophisticated methodologies that combine theoretical frameworks with practical implementation."
```

### After (Specific to Your PDF)
```
Q: "What methodology did they use?"
A: "The paper uses a transformer-based architecture with attention mechanisms, trained on the MNIST dataset using cross-entropy loss and Adam optimizer with learning rate 0.001..."
```

## ✨ New Features Added

1. **Better PDF Extraction** - Now extracts 50 pages max (was 10)
2. **Full Content Analysis** - Uses actual PDF text for Q&A (not abstract)
3. **Provider Fallback Chain** - Tries 4 different AI providers automatically
4. **Smart Mock Analysis** - Detects research type and generates contextual responses
5. **Detailed Logging** - See exactly which AI provider was used
6. **OpenAI Support** - Added to the fallback chain

## 🎯 Next Steps

1. ✅ Copy `.env.example` to `.env`
2. ✅ Add your API key
3. ✅ Install dependencies: `pip install -r requirements.txt`
4. ✅ Run backend: `python main_enhanced.py`
5. ✅ Test with your PDF!

## 📞 Support

- Check logs for error messages
- Verify API key is correct
- Try different AI provider if one fails
- PDFs will work even without AI (mock mode)

**Happy researching! 🎓**
