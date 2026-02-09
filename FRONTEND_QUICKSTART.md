# 🎯 Quick Start - Frontend

## 1️⃣ Install Dependencies (One-time)
```bash
cd frontend
npm install
```

## 2️⃣ Start Development Server
```bash
npm run dev
```

✅ **Frontend ready at:** `http://localhost:5173`

## 3️⃣ Make Sure Backend is Running
```bash
# Terminal 2 - Backend should be running on port 8000
cd backend
python main_simple.py
```

✅ **Backend ready at:** `http://localhost:8000`

## 4️⃣ Open in Browser
Go to: **http://localhost:5173**

---

## 📌 Pages Available

| Page | URL | Function |
|------|-----|----------|
| 🏠 Dashboard | `/` | Home & feature overview |
| 🔍 Search | `/search` | Search 2M+ arXiv papers |
| 📤 Upload | `/upload` | Upload your PDF |
| 📚 Saved | `/saved` | Your paper library |
| 📄 Literature Review | `/literature-review` | Generate reviews |
| 🔗 Paper Details | `/paper-details` | Full paper analysis |

---

## 🎨 Key Features

✅ **Search Papers** - Query arXiv with AI
✅ **Upload PDFs** - Local file processing
✅ **AI Summaries** - Auto-generated summaries
✅ **Chat Interface** - Ask questions about papers
✅ **Paper Library** - Save and organize
✅ **Recommendations** - Find similar papers
✅ **Literature Reviews** - Generate reports

---

## 🐛 Troubleshooting

### **"Failed to fetch" errors**
→ Make sure backend is running on `http://localhost:8000`

### **Styles not loading**
→ Restart dev server: `npm run dev`

### **Blank page**
→ Check browser console (F12) for errors

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

Output: `dist/` folder ready for Vercel, Netlify, etc.

---

## ✨ Next Steps

1. ✅ Start both backend & frontend
2. ✅ Visit `http://localhost:5173`
3. ✅ Search for papers
4. ✅ Upload PDFs
5. ✅ Generate summaries
6. ✅ Ask questions
7. ✅ Create literature reviews

**Enjoy! 🚀**
