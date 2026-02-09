# 🚀 Why You're Still Getting Generic Responses - TROUBLESHOOTING GUIDE

## The Problem 🔴

You're uploading PDFs and asking questions, but getting generic responses like:

> "The paper presents well-researched findings supported by rigorous methodology and experimental validation..."

**This means: AI providers are NOT being called.**

## The Root Causes

There are 3 main reasons this happens:

### 1. **API Keys Not Configured** (99% of cases)
   - No `.env` file created
   - `.env` file exists but is empty
   - API keys still have placeholder values like `your_gemini_api_key_here`

### 2. **Required Packages Not Installed**
   - Missing `google-generativeai`, `groq`, `openai` packages
   - Not running `pip install -r requirements.txt`

### 3. **Backend Not Restarted**
   - Changed `.env` but didn't restart backend
   - Old backend process still running with empty keys

## How to Fix It (3 Steps)

### Step 1: Run the Diagnostic Tool 🔍

```bash
cd ResearchPilot/backend
python diagnose.py
```

This will show you:
- ✅ Which API keys are configured
- ❌ Which are missing
- 📦 Which packages are installed
- ⚠️ Exactly what needs to be fixed

**Example Output If Missing API:**
```
❌ No PROVIDERS ARE CONFIGURED!
   
RECOMMENDED SETUP (2 minutes):
1. Go to https://ai.google.dev/
2. Click 'Get API Key'
3. Copy the key
4. Paste into .env next to GEMINI_API_KEY=
5. Save and restart backend
```

### Step 2: Set Up ONE API Provider

**OPTION A: Google Gemini (RECOMMENDED - FREE & UNLIMITED)**

1. Go to https://ai.google.dev/
2. Click blue "Get API Key" button
3. Create new project
4. Copy the generated key
5. Edit `ResearchPilot/backend/.env`
6. Find this line:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
7. Replace with your key:
   ```
   GEMINI_API_KEY=AIzatj6kl2hJ9k_U2vEfGhIjK1lMnOpQrStUvWxYz
   ```
8. Save the file

**OPTION B: Groq (FREE tier, ultra-fast)**

1. Go to https://console.groq.com/
2. Sign up or login
3. Go to API Keys
4. Create new key
5. Edit `.env` and set:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
6. Save

**OPTION C: OpenAI (Most reliable, requires payment)**

1. Go to https://platform.openai.com/api-keys
2. Sign up or login
3. Add payment method
4. Create API key
5. Edit `.env`:
   ```
   OPENAI_API_KEY=sk-your_key_here
   ```
6. Save

### Step 3: Restart Backend

```bash
# If running, stop it (Ctrl+C)

# Install fresh dependencies
pip install -r requirements.txt

# Start backend with diagnostics
python run.py

# OR manually:
python main_enhanced.py
```

Watch the logs for these SUCCESS messages:

```
✅ **GEMINI SUCCESS** (1,234 chars)
✅ **GROQ SUCCESS** (567 chars)
✅ **OPENAI SUCCESS** (890 chars)
```

## Verify It's Working

### 1. Check Backend Health
```bash
curl http://localhost:8000/api/health
```

Should show: `"ai_enabled": true`

### 2. Upload PDF & Ask Question
1. Go to http://localhost:5174
2. Upload a PDF file
3. Ask a question
4. **LOOK FOR SPECIFIC ANSWER** (not generic template)

### 3. Check Backend Logs
You should see:
```
🔵 Attempting Gemini API...
✅ **GEMINI SUCCESS** (1234 chars)
```

NOT:
```
⚠️ No Gemini API key configured
🚨 ALL AI PROVIDERS FAILED
```

## Common Issues & Fixes

### Issue: Still getting generic response after setup

**Check 1: Did you restart the backend?**
```bash
# Kill old process
# Then restart with: python main_enhanced.py
```

**Check 2: Is your API key actually filled in?**
```bash
# Open .env and verify:
cat .env | grep GEMINI_API_KEY
# Should show your actual key, not "your_gemini_api_key_here"
```

**Check 3: Do you have the packages installed?**
```bash
python diagnose.py
# Run this to check
```

### Issue: Got error "No API providers configured"

**This means:** Your `.env` file has NO valid API keys

**Fix:** Follow "Set Up ONE API Provider" above

### Issue: "Invalid API key" error

**This means:** Your API key is wrong or expired

**Fix:**
1. Get a new API key from the provider's website
2. Delete the old one from the key manager
3. Paste new key into `.env`
4. Restart backend

### Issue: Backend starts but requests timeout

**This means:** API is slow or unreachable

**Possible fixes:**
- Check internet connection
- Try a different AI provider
- Check if provider's service is down
- Try Groq (it's faster)

## What Each Provider Does If All Fail

If ALL 4 providers fail or aren't configured:

| Feature | Status |
|---------|--------|
| PDF Upload | ✅ Works (uses pdfplumber) |
| PDF Analysis | ⚠️ Generic responses |
| Chat | ⚠️ Context-aware but not specific |
| Search | ✅ Works (uses arXiv) |

The system will still WORK but give less specific responses.

## Testing Endpoints Directly

### Test Summarization
```bash
curl -X POST http://localhost:8000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "test_001",
    "title": "Sample Paper",
    "text": "This paper proposes a novel deep learning architecture for image classification using transformers. We achieve 95% accuracy on ImageNet."
  }'
```

If using real AI, you'll see specific analysis of transformers and ImageNet.
If not, you'll get generic response about "advanced methodologies".

### Test Q&A
```bash
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "test_001",
    "question": "What architecture did they use?",
    "text": "This paper proposes a novel deep learning architecture for image classification using transformers..."
  }'
```

## Ultimate Diagnostics

If nothing works, run this sequence:

```bash
# 1. Check configuration
python diagnose.py

# 2. Test with direct API call
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('GEMINI_API_KEY:', '✅ SET' if os.getenv('GEMINI_API_KEY') else '❌ NOT SET')
print('GROQ_API_KEY:', '✅ SET' if os.getenv('GROQ_API_KEY') else '❌ NOT SET')
"

# 3. Test Gemini directly
python -c "
import os
from dotenv import load_dotenv
load_dotenv()

try:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content('Hello!')
    print('✅ Gemini API works:', response.text[:100])
except Exception as e:
    print('❌ Gemini error:', e)
"

# 4. Check logs from backend
tail -f backend.log
```

## Getting Help

If you're still having issues:

1. **Check logs** - Run backend and look for error messages
2. **Run diagnose.py** - This will tell you exactly what's wrong
3. **Verify API key** - Make sure it's copied correctly (no spaces)
4. **Try different provider** - If one isn't working, try another
5. **Check internet** - Make sure you have internet connection
6. **Update packages** - Run `pip install -r requirements.txt --upgrade`

## Quick Reference

### Start Everything Properly

```bash
# 1. Setup
cp .env.example .env
# Edit .env and add API key

# 2. Install
pip install -r requirements.txt

# 3. Start backend
cd ResearchPilot/backend
python main_enhanced.py

# 4. In another terminal, start frontend
cd ResearchPilot/frontend
npm install
npm run dev

# 5. Open browser
# http://localhost:5174
```

### Files You Need to Check

- ✏️ `.env` - Your API keys go here
- 📦 `requirements.txt` - List of packages
- 🐍 `main_enhanced.py` - The backend server
- 🔍 `diagnose.py` - Check your setup
- 🚀 `run.py` - Start server with diagnostics

---

**Remember:** The system is designed to work even without AI providers (mock mode), but **real AI requires at least ONE configured API key**. 

**The issue is almost always:** No API key is set in `.env` 🔑

**The solution is always:** Get an API key and paste it into `.env` 📝
