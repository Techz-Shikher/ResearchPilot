# Quick Start Guide - ResearchPilot AI

Get ResearchPilot AI running locally in 5 minutes!

## System Requirements

- **Windows/Mac/Linux**
- **Python 3.8+** 
- **Node.js 16+**
- **Free Google Gemini API key** (optional but recommended)

## 1️⃣ Get API Key (2 minutes)

### Option A: Google Gemini (Recommended - Free!)

1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Click "Create API key"
4. Copy your key (keep it safe!)

No credit card required! Free tier: 60 requests/minute

### Option B: OpenAI (Optional)

1. Go to https://platform.openai.com/api/keys
2. Create new secret key
3. Copy your key

(You'll need to add billing, but free trial includes $5 credits)

### If No API Key

The app has a **fallback summarizer** that works without keys, but responses are less detailed.

---

## 2️⃣ Backend Setup (2 minutes)

### Windows

```bash
# Navigate to backend
cd ResearchPilot\backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies (takes ~3 minutes first time)
pip install -r requirements.txt

# Create .env file
copy .env.example .env
```

### Mac/Linux

```bash
# Navigate to backend
cd ResearchPilot/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

### Configure .env

```bash
# Open .env in your editor
nano .env  # or use any text editor
```

Edit these lines:
```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key_from_step_1
```

Save and exit.

### Start Backend

```bash
python main.py
```

You should see:
```
Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend is ready!**

---

## 3️⃣ Frontend Setup (1 minute)

### In a NEW terminal/command prompt (keep backend running!)

```bash
cd ResearchPilot\frontend
npm install

npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

✅ **Frontend is ready!**

---

## 4️⃣ Open the App

Click the link or go to: **http://localhost:5173/**

🎉 **ResearchPilot AI is running!**

---

## First Test - Try These Steps

### Test 1: Search Papers
1. Click the **Search Papers** tab
2. Type: `"machine learning"`
3. Click **Search**
4. Wait for results (~3 seconds)

### Test 2: View Paper
1. Click any paper card
2. See the abstract and metadata

### Test 3: Summarize
1. Click **Summary** tab
2. Click **Generate AI Summary**
3. Wait for summary (5-10 seconds)

### Test 4: Ask Question
1. Click **Chat with Paper** tab
2. Ask: `"What is the main contribution?"`
3. See AI response with sources

### Test 5: Upload PDF
1. Go back to home
2. Click **Upload PDF**
3. Drag & drop any PDF (or click to browse)
4. Wait for processing
5. Chat with your paper!

---

## ✅ Quick Checklist

- [ ] Backend running at `http://localhost:8000`
- [ ] Frontend running at `http://localhost:5173`
- [ ] Can search papers
- [ ] Can upload PDF
- [ ] Can summarize papers
- [ ] Can chat with papers
- [ ] Can save papers to library

If all ✅, you're good to go!

---

## 🆘 Troubleshooting

### Port 8000 already in use?
```bash
# Kill the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :8000
kill -9 <PID>
```

### FAISS installation too slow?
```bash
# Try this instead
pip install --no-build-isolation faiss-cpu
```

### API key not working?
```bash
# The fallback summarizer will work
# Just won't be as good
```

### Can't connect frontend to backend?
1. Make sure both are running
2. Check `.env` in frontend folder
3. Verify `VITE_API_URL=http://localhost:8000`

### Still have issues?
1. Check README.md for full documentation
2. See "Troubleshooting" section
3. Check that all dependencies installed: `pip list`

---

## 📚 What You Can Do Now

✅ Search 2M+ research papers from arXiv  
✅ Upload and analyze your own PDFs  
✅ Get AI summaries of any paper  
✅ Ask questions and get AI answers  
✅ Save papers to your library  
✅ Find similar papers automatically  
✅ Generate literature reviews  

---

## 🚀 Next Steps

1. **Explore more papers** - Try different search queries
2. **Upload papers** - Use your own research
3. **Save library** - Build your paper collection
4. **Generate review** - Create lit reviews automatically
5. **Deploy** - See DEPLOYMENT.md to put online

---

## 💡 Pro Tips

- **Search tips**: Be specific (e.g., "deep learning medical imaging" not just "AI")
- **PDF quality**: Scanned PDFs work but text PDFs are faster
- **Chat tips**: Ask specific questions about methodology, results, limitations
- **Saving**: Save papers you might reference later
- **Reviews**: Use literature review feature to understand research areas quickly

---

## 🎯 Demo Mode (No Setup)

Want to try first? Use the fallback mode:
1. Don't add API key to .env
2. Run normally
3. Summarization uses free transformer model
4. Slightly lower quality but completely free!

---

**Enjoy using ResearchPilot AI! 🚀**

Questions? Check the full README.md for detailed documentation.
