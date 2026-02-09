# 🚀 Frontend Setup & Running Guide

## ✅ Prerequisites
- Node.js 16+ and npm installed
- Backend running on `http://localhost:8000`
- Visual Studio Code (optional but recommended)

## 📦 Installation Steps

### 1. Navigate to Frontend Directory
```bash
cd "F:\hackathon project AI\ResearchPilot\frontend"
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- React 18
- Vite 5 (build tool)
- Tailwind CSS 3
- Axios
- React Router DOM
- Lucide Icons

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## 🌐 Frontend Pages & Features

### 1. **Dashboard** (Home Page)
- **Route:** `/`
- Hero section with project info
- Quick access to all features
- Feature cards with descriptions
- Stats and how-it-works section

### 2. **Search Papers**
- **Route:** `/search`
- Search bar for querying papers
- Results displayed as cards
- Each card shows:
  - Paper title
  - Authors
  - Published date
  - Abstract preview
  - Categories/tags
  - Buttons: View | Summarize | Save

### 3. **Upload PDF**
- **Route:** `/upload`
- Drag-drop file upload area
- Click to browse option
- File validation (PDF only)
- Auto-redirect to paper details after upload

### 4. **Paper Details**
- **Route:** `/paper-details`
- Full paper information
- Tabs:
  - **Details**: Abstract and metadata
  - **Summary**: AI-generated summary with sections:
    - Summary
    - Key Contributions
    - Methodology
    - Limitations
    - Future Scope
  - **Chat**: Q&A interface with paper context
  - **Similar Papers**: Recommendations based on embeddings

### 5. **Saved Papers**
- **Route:** `/saved`
- Library of saved papers
- Card layout with all saved papers
- Click to view details

### 6. **Literature Review**
- **Route:** `/literature-review`
- Input research topic
- Generate comprehensive review
- Download as text file
- Includes:
  - Introduction
  - Key Papers
  - Research Gaps
  - Future Directions
  - Conclusion

## 🎨 UI Components

### Components Created:
- **Navbar.jsx** - Navigation with tabs and health indicator
- **PaperCard.jsx** - Reusable paper display card
- **ChatBox.jsx** - Chat interface for Q&A
- **Loading.jsx** - Spinners and loading states

### Features:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode ready
- ✅ Smooth animations
- ✅ Toast notifications
- ✅ Loading spinners
- ✅ Form validation
- ✅ Error handling

## 🔌 API Integration

### Axios Client Setup
File: `src/api/client.js`

All API endpoints connected:
```javascript
- GET /api/health           // Health check
- POST /api/search          // Search papers
- POST /api/upload          // Upload PDF
- POST /api/summarize       // Generate summary
- POST /api/ask             // Q&A
- POST /api/save            // Save paper
- GET /api/saved            // Get saved papers
- GET /api/recommend        // Get recommendations
- POST /api/literature-review // Generate review
```

## 🌍 Environment Variables

File: `.env`
```
VITE_API_URL=http://localhost:8000
VITE_ENV=development
```

For production, update to your deployed backend URL.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js           # API client with all endpoints
│   ├── context/
│   │   └── ToastContext.jsx    # Toast notification context
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── PaperCard.jsx       # Paper card component
│   │   ├── ChatBox.jsx         # Chat interface
│   │   └── Loading.jsx         # Loading states & spinners
│   ├── pages/
│   │   ├── Dashboard.jsx       # Home page
│   │   ├── SearchPapers.jsx    # Search papers page
│   │   ├── UploadPDF.jsx       # Upload page
│   │   ├── SavedPapers.jsx     # Saved papers page
│   │   ├── LiteratureReview.jsx # Literature review page
│   │   └── PaperDetails.jsx    # Paper details page
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── App.jsx                 # Main app component with routing
│   └── main.jsx                # React entry point
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── .env                        # Environment variables
```

## 🎯 Usage Guide

### Searching for Papers
1. Go to **Search Papers** tab
2. Enter a research topic (e.g., "AI in cybersecurity")
3. Click **Search**
4. Results appear as cards
5. Click **View** to see full details
6. Click **Summarize** to get AI summary
7. Click **Save** to add to library

### Uploading PDFs
1. Go to **Upload PDF** tab
2. Drag and drop a PDF or click to browse
3. Click **Upload PDF**
4. Wait for processing
5. Auto-redirects to Paper Details
6. Click tabs to view summary, chat, etc.

### Asking Questions
1. Open any paper (search or saved)
2. Go to **Chat** tab
3. Type your question
4. Press Enter or click Send
5. AI responds with relevant passages
6. Confidence score and sources shown

### Generating Literature Review
1. Go to **Literature Review** tab
2. Enter research topic
3. Click **Generate Review**
4. Review the generated content
5. Click **Download** to save as .txt file

## 🐛 Troubleshooting

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check `.env` file has correct API URL
- Open browser console (F12) to see errors
- Check Network tab to see API calls

### CORS Errors
- Backend should have CORS enabled
- Ensure backend is running before starting frontend
- Clear browser cache

### Styling Issues
- Ensure Tailwind is properly installed
- Check `tailwind.config.js` is in root
- Restart dev server if styles don't load

## 🚀 Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

Output files in `dist/` folder ready for deployment.

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Connect GitHub repository**
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import project

2. **Configure Environment**
   - Set `VITE_API_URL` to your production backend URL
   - Example: `https://your-backend.herokuapp.com`

3. **Deploy**
   - Vercel auto-deploys on push

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop `dist/` folder
   - Or connect GitHub for auto-deploy

### Deploy to GitHub Pages

```bash
# Update vite.config.js with:
# base: '/repository-name/'

npm run build
# Deploy dist/ folder to gh-pages branch
```

## ✨ Features Checklist

- ✅ Modern SaaS dashboard UI
- ✅ Responsive design
- ✅ Component-based architecture
- ✅ Full API integration
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Chat interface
- ✅ File upload
- ✅ Search functionality
- ✅ Paper details view
- ✅ Literature review generation
- ✅ Tailwind CSS styling
- ✅ Production-ready code
- ✅ Mobile optimized

## 📚 Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| Tailwind CSS 3 | Styling |
| Axios | HTTP client |
| React Router v6 | Navigation |
| Lucide Icons | Icons |
| Zustand | State management ready |

## 🤝 Support

If you encounter issues:
1. Check error messages in browser console (F12)
2. Verify backend is running
3. Check `.env` file configuration
4. Review API response in Network tab

## 🎉 You're Ready!

Your React frontend is now ready to connect with the ResearchPilot AI backend. Start the dev server and enjoy building! 🚀
