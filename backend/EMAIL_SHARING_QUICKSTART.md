# Email Sharing - Quick Setup Guide

## ✅ Status: IMPLEMENTED

Your ResearchPilot application now has **full email sharing functionality** with:
- ✅ Frontend: Email share modal with custom messages  
- ✅ Backend: SMTP email endpoint ready to use
- ✅ Dependencies: All installed (`email-validator`, core `pydantic.EmailStr`)

---

## 🚀 **Quick Start (5 minutes)**

### **Step 1: Get Gmail App Password**

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already done)
4. Go back to **Security** → scroll down to **App passwords**
5. Select **Mail** and **Windows Computer**
6. Copy the **16-character password**

### **Step 2: Create `.env` File**

In `ResearchPilot/backend/` create a file named `.env`:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-gmail@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SENDER_EMAIL=your-gmail@gmail.com
SENDER_NAME=ResearchPilot

# AI Providers (add your existing keys)
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
# ... other existing config ...
```

### **Step 3: Restart Backend**

```bash
# In backend directory
python run.py
# or
python main_enhanced.py
```

You should see in logs:
```
📧 Email Sharing: ✅ ENABLED
```

### **Step 4: Test Email Sharing**

1. Open ResearchPilot frontend (localhost:5173)
2. Go to **Dashboard**
3. Click **Share** on any paper
4. Enter recipient email
5. Click **Send**
6. Check email inbox! 📨

---

## 📧 **How Email Sharing Works**

### **Frontend Flow**
```
User clicks Share
    ↓
Email Modal opens
    ↓
User enters recipient email + optional message
    ↓
Click "Send"
    ↓
Sends POST request to /api/share-paper-email
    ↓
Toast notification (success/error)
```

### **Backend Flow**
```
POST /api/share-paper-email
    ↓
Validate email address (Pydantic EmailStr)
    ↓
Create HTML email with paper info
    ↓
Connect to SMTP server (Gmail)
    ↓
Send email
    ↓
Return success/error response
```

### **Email Template**
Recipients receive a beautiful HTML email with:
- 📚 Paper title and topic
- 💬 Custom message from sender
- 🔗 Direct link to view paper
- 🎨 Professional gradient design
- ✉️ Sender information

---

## 🔑 **Email Providers Comparison**

| Provider | Setup Time | Free Tier | Reliability | Scalability |
|----------|-----------|-----------|-------------|------------|
| **Gmail** | 3 min | Yes (15 emails/day) | ⭐⭐⭐ Good | Medium |
| **Mailgun** | 5 min | Yes (1,000/month) | ⭐⭐⭐⭐⭐ | High |
| **SendGrid** | 10 min | Yes (100/day) | ⭐⭐⭐⭐⭐ | High |

**Current:** Gmail via SMTP (recommended for testing)

---

## 🧪 **Testing Email Sharing**

### **Using curl:**
```bash
curl -X POST http://localhost:8000/api/share-paper-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "paper": "Machine Learning in Healthcare",
    "topic": "AI Research",
    "message": "Check this amazing paper!",
    "sender": "Dr. Alex Chen",
    "senderEmail": "alex.chen@mit.edu",
    "paperLink": "/paper/123"
  }'
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Paper shared successfully with recipient@example.com",
  "status": "sent"
}
```

---

## 🛠️ **Troubleshooting**

### **"SMTP Authentication failed"**
- ✗ Check Gmail credentials are correct
- ✗ Verify 2-factor authentication is enabled
- ✗ Generate new App Password (old ones expire)

### **"Email not received"**
- ✗ Check spam folder
- ✗ Verify recipient email is correct (Pydantic validates)
- ✗ Check Gmail security settings allow "Less secure apps" (if not using App Password)
- ⚠️ Gmail rate limits: 15 emails/day per account

### **"Connection timeout"**
- ✗ Check internet connection
- ✗ Verify SMTP_PORT is 587 (not 465)
- ✗ Firewall might be blocking SMTP port

### **"Module not found: email_validator"**
```bash
pip install email-validator
# Already done! But reinstall if needed
```

---

## 📊 **API Reference**

### **Endpoint:** `POST /api/share-paper-email`

**Request Body:**
```typescript
{
  to: string;              // Recipient email (required)
  paper: string;          // Paper title (required)
  topic: string;          // Paper topic (required)
  message?: string;       // Custom message (optional)
  sender: string;         // Sender name (required)
  senderEmail: string;    // Sender email (required)
  paperLink: string;      // Link to paper (required)
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  status: "sent" | "error";
}
```

**Status Codes:**
- `200`: Email sent successfully ✅
- `400`: Invalid email format ❌
- `401`: SMTP authentication failed ❌
- `500`: Server error ❌

---

## 🔒 **Security Best Practices**

✅ **Implemented:**
- Email validation using Pydantic's `EmailStr`
- Error messages don't expose sensitive info
- SMTP password stored in `.env` (not in code)
- CORS checking on API endpoints

📋 **Recommended for Production:**
- Add rate limiting (prevent spam)
- Add authentication check (only logged-in users can share)
- Log all share events to database
- Add unsubscribe link in emails
- Implement email verification

---

## 📈 **Next Steps**

### **Optional Enhancements:**
1. **Track shares** - Log who shared with whom
2. **Click tracking** - Know if recipient opened email
3. **Share statistics** - Show trending papers
4. **Multiple recipients** - Share with multiple emails at once
5. **Social sharing** - Add Twitter, LinkedIn sharing
6. **Scheduled sharing** - Send later feature

### **Scale to Production:**
1. Switch to Mailgun or SendGrid (more reliable)
2. Add rate limiting
3. Add user authentication
4. Implement share logging
5. Monitor email delivery rates

---

## 📚 **Code Changes Summary**

### **Backend (`main_enhanced.py`):**
- ✅ Added `SharePaperRequest` Pydantic model
- ✅ Added `POST /api/share-paper-email` endpoint
- ✅ Beautiful HTML email template
- ✅ Error handling with proper HTTP status codes
- ✅ Logging of share events

### **Frontend (`UserDashboard.jsx`):**
- ✅ Email share modal component
- ✅ Recipient email input with validation
- ✅ Custom message textarea
- ✅ Loading state during send
- ✅ Success/error toast notifications
- ✅ Backend API integration

### **Files Modified:**
- `ResearchPilot/backend/main_enhanced.py` - Added email endpoint
- `ResearchPilot/frontend/src/pages/UserDashboard.jsx` - Added modal & API call
- `ResearchPilot/backend/requirements.txt` - Added email-validator
- `ResearchPilot/backend/.env.example` - Added email config template

---

## 🎉 **You're All Set!**

Email sharing is now **fully functional and ready to use**! 

1. Add credentials to `.env` (Gmail or your provider)
2. Restart backend
3. Test from frontend
4. Watch emails get sent! 📨

For production deployment, follow the "Scale to Production" section above.

Questions? Check the logs for detailed error messages! 🚀
