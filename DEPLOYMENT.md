# Deployment Guide - ResearchPilot AI

Deploy ResearchPilot AI to production using Render (backend) and Vercel (frontend).

## Table of Contents

1. [Prepare Code](#prepare-code)
2. [Deploy Backend](#deploy-backend)
3. [Deploy Frontend](#deploy-frontend)
4. [Post-Deployment](#post-deployment)
5. [Cost Estimation](#cost-estimation)

---

## Prepare Code

### 1. Create GitHub Repository

```bash
cd ResearchPilot
git init
git add .
git commit -m "Initial commit: ResearchPilot AI"
git branch -M main

# Add your GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/researchpilot.git
git push -u origin main
```

### 2. Create .gitignore (if not exists)

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.env
.env.local

# Node
node_modules/
dist/
.next

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

### 3. Verify Structure

```
ResearchPilot/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── services/
├── frontend/
│   ├── package.json
│   └── src/
└── README.md
```

---

## Deploy Backend (Render)

### Step 1: Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize & complete signup

### Step 2: Create Web Service

1. Click **Dashboard** (top right)
2. Click **New** → **Web Service**
3. Select your GitHub repository
4. Click **Connect**

### Step 3: Configure Deployment

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `researchpilot-api` |
| **Environment** | `Python 3.11` |
| **Region** | `Ohio` (or closest to you) |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn main:app --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT` |

### Step 4: Add Environment Variables

Click **Environment** section:

```
LLM_PROVIDER=gemini
GEMINI_API_KEY=YOUR_KEY_HERE
OPENAI_API_KEY=YOUR_KEY_HERE (optional)
BACKEND_URL=https://researchpilot-api.onrender.com
FRONTEND_URL=https://researchpilot.vercel.app
```

**Important**: Replace `YOUR_KEY_HERE` with your actual API key

### Step 5: Deploy

1. Click **Create Web Service**
2. Wait for deployment (3-5 minutes)
3. You'll see a live URL: `https://researchpilot-api.onrender.com`

### Test Backend Deployment

```bash
curl https://researchpilot-api.onrender.com/api/health
```

Should return:
```json
{"status": "healthy", ...}
```

✅ **Backend deployed!**

---

## Deploy Frontend (Vercel)

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize & complete signup

### Step 2: Import Project

1. Click **Add New** → **Project**
2. Click **Import Git Repository**
3. Select your ResearchPilot repository
4. Click **Import**

### Step 3: Configure Project

1. Select **Framework Preset**: `Vite`
2. Click **Root Directory** dropdown
3. Choose `frontend`
4. Click **Continue**

### Step 4: Environment Variables

Add under "Environment Variables":

```
VITE_API_URL=https://researchpilot-api.onrender.com
```

### Step 5: Deploy

1. Click **Deploy**
2. Wait for build (2-3 minutes)
3. You'll get a live URL: `https://researchpilot.vercel.app`

### Test Frontend Deployment

1. Open: `https://researchpilot.vercel.app`
2. Try searching for papers
3. Should connect to backend API

✅ **Frontend deployed!**

---

## Post-Deployment

### Update CORS

The backend needs to accept requests from your frontend domain.

Edit `backend/main.py`, find the CORS section:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://researchpilot.vercel.app",  # Add your frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push:
```bash
git add backend/main.py
git commit -m "Update CORS for production"
git push
```

Render will auto-redeploy.

### Update Frontend Environment

If frontend is deployed first, update the environment variable:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to backend URL
5. Redeploy: **Deployments** → **Redeploy**

### Test Full Application

1. Open `https://researchpilot.vercel.app`
2. Search for papers - should work
3. Upload a PDF - should work
4. Generate summary - should work
5. Ask questions - should work

---

## Cost Estimation

### Render (Backend)

| Item | Cost |
|------|------|
| Web Service (free tier) | $0 |
| PostgreSQL (if added) | $15/month minimum |
| **Total (free tier)** | **$0** |

**Free tier limitations:**
- No auto-scaling
- Auto-sleeps after 15 min inactivity
- First request takes ~30 seconds

**Upgrade options:**
- Starter: $7/month (dedicated instance)
- Standard: $12/month (auto-scaling)

### Vercel (Frontend)

| Item | Cost |
|------|------|
| Hobby plan | $0 |
| Pro plan (optional) | $20/month |
| **Total (free tier)** | **$0** |

**Free tier includes:**
- Unlimited deployments
- Custom domains
- Fast global CDN
- Serverless functions

### API Costs

| API | Free Tier | Cost |
|-----|-----------|------|
| Google Gemini | 60 requests/min | Free! |
| arXiv | Unlimited | Free! |
| OpenAI | (need paid account) | ~$0.002/1K tokens |

**Typical monthly costs with free tier:**
- Google Gemini: $0
- arXiv: $0
- Hosting: $0
- **TOTAL: $0** 🎉

### Scale-Up Costs (If Popular)

If you get 1000 users:
- Backend: $10-20/month
- Frontend: $0-20/month
- APIs: $50-200/month (depending on usage)
- **Total: ~$100-200/month**

---

## Monitoring & Maintenance

### Monitor Backend

1. Go to Render dashboard
2. Select your service
3. Check **Logs** for errors
4. Check **Metrics** for performance

### Monitor Frontend

1. Go to Vercel dashboard
2. Select your project
3. Check **Deployment** status
4. Check **Analytics** for traffic

### Update Dependencies

Monthly, update packages:

**Backend:**
```bash
cd backend
pip list --outdated
pip install -U -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm update
npm audit fix
```

### Redeploy After Updates

```bash
git add .
git commit -m "Update dependencies"
git push origin main
```

Both services auto-redeploy from GitHub.

---

## Troubleshooting Deployment

### Backend won't start

Check logs in Render dashboard:
1. Go to Service
2. Click **Logs**
3. Look for error messages
4. Common issue: Missing environment variables

### Frontend won't build

Check build logs in Vercel:
1. Go to Project
2. Click **Deployments**
3. Click on failed deployment
4. Check **Build Logs** tab

### API 502 errors

Usually means backend crashed:
1. Check Render logs
2. Check if vector store files exist
3. Check API key is correct
4. Restart service: Go to Render → Settings → Restart

### CORS errors

Check:
1. Frontend URL is in CORS list
2. Backend environment variables correct
3. API URLs point to right domains

### Slow first request

Normal for free tier (cold start).
Upgrade to Starter plan for always-on instance.

---

## Disaster Recovery

### Backup Data

Your data is stored in:
- GitHub (code backup)
- Render (uploaded PDFs, embeddings)
- Vercel (frontend code)

To backup locally:
```bash
# Backup vector store
cp -r backend/embeddings ~/researchpilot-backup/

# Backup saved papers
cp backend/db/saved_papers.json ~/researchpilot-backup/
```

### Restore Service

If something breaks:

1. **Restore code from GitHub**
   ```bash
   git clone your-repo-url
   git checkout main
   ```

2. **Redeploy backend**
   - Go to Render
   - Manual Deploy option

3. **Redeploy frontend**
   - Go to Vercel
   - Redeploy Deployment

---

## Going Further

### Custom Domain

#### Render (Backend)
1. Go to Service settings
2. Add **Custom Domain**
3. Point DNS records (instructions provided)

#### Vercel (Frontend)
1. Go to Project settings
2. Add **Domain**
3. Follow DNS setup instructions

### Analytics

#### Vercel
- Built-in analytics
- Shows page views, traffic patterns

#### Render
- Basic metrics
- CPU, memory, request count

### Auto-Scaling

#### Upgrade Render plan
- Starter: 1 instance
- Standard: Auto-scale 1-5 instances

---

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Can search papers on live site
- [ ] Can upload PDFs on live site
- [ ] Can generate summaries
- [ ] Can chat with papers
- [ ] No errors in logs

---

## Need Help?

1. Check README.md for detailed docs
2. Review Render docs: https://render.com/docs
3. Review Vercel docs: https://vercel.com/docs
4. Check GitHub issues on your repo

---

**Your ResearchPilot AI is now live! 🚀**

Share the URL with colleagues and get feedback!
