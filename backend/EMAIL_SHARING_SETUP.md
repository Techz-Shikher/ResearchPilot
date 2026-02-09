# Email Sharing - Backend Setup Guide

## Overview
This guide shows how to implement email sharing for research papers in your FastAPI backend using Mailgun or SendGrid.

---

## 🔧 **Option 1: Using Mailgun (Recommended)**

### **1. Install Dependencies**
```bash
pip install mailgun-python python-dotenv
```

### **2. Environment Variables**
Add to `.env`:
```env
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_FROM_EMAIL=noreply@researchpilot.com
SENDER_EMAIL=your-email@researchpilot.com
SENDER_NAME=ResearchPilot Team
```

### **3. Backend Code (main_enhanced.py)**

```python
from mailgun_python import mailgun
from pydantic import BaseModel, EmailStr
from typing import Optional

# Initialize Mailgun
class SharePaperRequest(BaseModel):
    to: EmailStr
    paper: str
    topic: str
    message: Optional[str] = ""
    sender: str
    senderEmail: EmailStr
    paperLink: str

@app.post("/api/share-paper-email")
async def share_paper_email(request: SharePaperRequest):
    """
    Share a paper via email
    """
    try:
        mg = mailgun.Mailgun(
            os.getenv('MAILGUN_DOMAIN'),
            apikey=os.getenv('MAILGUN_API_KEY')
        )
        
        # Create email content
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #6366f1;">📚 Research Paper Shared with You</h2>
                    
                    <p>Hi there,</p>
                    
                    <p><strong>{request.sender}</strong> shared a research paper with you on <strong>ResearchPilot</strong>:</p>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #6366f1; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0;">{request.paper}</h3>
                        <p style="margin: 5px 0; color: #666;">
                            <strong>Topic:</strong> {request.topic}
                        </p>
                        {f'<p style="margin: 5px 0; color: #666;"><strong>Message:</strong> {request.message}</p>' if request.message else ''}
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <a href="https://researchpilot.com{request.paperLink}" 
                           style="background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); 
                                   color: white; 
                                   padding: 12px 24px; 
                                   text-decoration: none; 
                                   border-radius: 8px; 
                                   display: inline-block; 
                                   font-weight: bold;">
                            View Paper
                        </a>
                    </div>
                    
                    <p>Best regards,<br/>
                    <strong>ResearchPilot Team</strong></p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">
                        This email was sent because {request.sender} ({request.senderEmail}) 
                        shared this paper with you via ResearchPilot.
                    </p>
                </div>
            </body>
        </html>
        """
        
        # Send email
        result = mg.send_message(
            to_addr=request.to,
            from_addr=f"{os.getenv('SENDER_NAME')} <{os.getenv('MAILGUN_FROM_EMAIL')}>",
            subject=f"📚 {request.sender} shared: {request.paper}",
            html=html_body
        )
        
        # Log sharing action
        # db.add_share_log(request.to, request.paperLink, request.sender)
        
        return {
            "success": True,
            "message": f"Paper shared successfully with {request.to}",
            "messageId": result.get('http_response_body', {}).get('id')
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
```

---

## 🔧 **Option 2: Using SendGrid**

### **1. Install Dependencies**
```bash
pip install sendgrid python-dotenv
```

### **2. Environment Variables**
Add to `.env`:
```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@researchpilot.com
SENDGRID_FROM_NAME=ResearchPilot
```

### **3. Backend Code**

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

class SharePaperRequest(BaseModel):
    to: EmailStr
    paper: str
    topic: str
    message: Optional[str] = ""
    sender: str
    senderEmail: EmailStr
    paperLink: str

@app.post("/api/share-paper-email")
async def share_paper_email(request: SharePaperRequest):
    """
    Share a paper via email using SendGrid
    """
    try:
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>📚 Research Paper Shared</h2>
                <p>{request.sender} shared: <strong>{request.paper}</strong></p>
                <p>Topic: {request.topic}</p>
                {f'<p>Message: {request.message}</p>' if request.message else ''}
                <a href="https://researchpilot.com{request.paperLink}">View Paper</a>
            </body>
        </html>
        """
        
        message = Mail(
            from_email=Email(
                os.getenv('SENDGRID_FROM_EMAIL'),
                os.getenv('SENDGRID_FROM_NAME')
            ),
            to_emails=To(request.to),
            subject=f"📚 {request.sender} shared: {request.paper}",
            html_content=Content("text/html", html_content)
        )
        
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        
        return {
            "success": True,
            "message": f"Paper shared successfully with {request.to}",
            "statusCode": response.status_code
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
```

---

## 🔧 **Option 3: Using Gmail/SMTP**

### **1. Install Dependencies**
```bash
pip install python-dotenv
```

### **2. Environment Variables**
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=your-email@gmail.com
SENDER_NAME=ResearchPilot
```

**Note:** For Gmail, create an [App Password](https://support.google.com/accounts/answer/185833)

### **3. Backend Code**

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@app.post("/api/share-paper-email")
async def share_paper_email(request: SharePaperRequest):
    """
    Share a paper via email using SMTP
    """
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"📚 {request.sender} shared: {request.paper}"
        message["From"] = f"{os.getenv('SENDER_NAME')} <{os.getenv('SENDER_EMAIL')}>"
        message["To"] = request.to
        
        # HTML content
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>📚 Research Paper Shared with You</h2>
                <p>Hi,</p>
                <p><strong>{request.sender}</strong> shared a paper:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h3>{request.paper}</h3>
                    <p><strong>Topic:</strong> {request.topic}</p>
                    {f'<p><strong>Message:</strong> {request.message}</p>' if request.message else ''}
                </div>
                <a href="https://researchpilot.com{request.paperLink}" 
                   style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none;">
                    View Paper
                </a>
            </body>
        </html>
        """
        
        part = MIMEText(html, "html")
        message.attach(part)
        
        # Send via SMTP
        with smtplib.SMTP(os.getenv('SMTP_SERVER'), int(os.getenv('SMTP_PORT'))) as server:
            server.starttls()
            server.login(os.getenv('SMTP_USERNAME'), os.getenv('SMTP_PASSWORD'))
            server.sendmail(
                os.getenv('SENDER_EMAIL'),
                request.to,
                message.as_string()
            )
        
        return {
            "success": True,
            "message": f"Paper shared successfully with {request.to}"
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
```

---

## 🚀 **Frontend Integration**

Update your frontend to call the backend endpoint:

```javascript
// frontend/src/api/client.js
export const shareViaEmail = async (data) => {
  const response = await apiClient.post('/api/share-paper-email', data);
  return response.data;
};
```

Update the UserDashboard handleEmailShare function:

```javascript
const handleEmailShare = async (e) => {
  e.preventDefault();
  
  if (!recipientEmail || !recipientEmail.includes('@')) {
    showToast('Please enter a valid email address', 'error');
    return;
  }

  setIsSending(true);
  try {
    const emailPayload = {
      to: recipientEmail,
      paper: selectedPaper.title,
      topic: selectedPaper.topic,
      message: shareMessage,
      sender: userProfile?.name || 'ResearchPilot User',
      senderEmail: userProfile?.email || 'noreply@researchpilot.com',
      paperLink: `/paper/${selectedPaper.id}`,
    };

    // Call backend endpoint
    await shareViaEmail(emailPayload);
    
    showToast(`Paper shared with ${recipientEmail}!`, 'success');
    setShowEmailModal(false);
    setRecipientEmail('');
    setShareMessage('');
  } catch (error) {
    showToast('Failed to share paper. Please try again.', 'error');
  } finally {
    setIsSending(false);
  }
};
```

---

## 📊 **Database Schema (Optional)**

To track email shares:

```sql
CREATE TABLE paper_shares (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paper_id VARCHAR(255),
  shared_by VARCHAR(255),
  shared_with_email VARCHAR(255),
  shared_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  click_count INT DEFAULT 0,
  message TEXT,
  status VARCHAR(50) DEFAULT 'sent'
);
```

---

## 🧪 **Testing Email Sending**

```bash
# Test with curl
curl -X POST http://localhost:5000/api/share-paper-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "paper": "Test Paper",
    "topic": "AI Research",
    "message": "Check this out!",
    "sender": "John Doe",
    "senderEmail": "john@example.com",
    "paperLink": "/paper/123"
  }'
```

---

## 🔒 **Security Best Practices**

1. **Validate emails**: Use `EmailStr` from Pydantic
2. **Rate limiting**: Limit shares per user per hour
3. **Spam prevention**: Add honeypot field
4. **Verify sender**: Check user authentication
5. **Log shares**: Track all sharing for analytics
6. **Error handling**: Don't expose sensitive info

---

## 📈 **Recommended Setup**

**For Production:**
1. Use **Mailgun** or **SendGrid** (scalable, reliable)
2. Add rate limiting to prevent abuse
3. Track shares in database
4. Monitor email delivery
5. Add unsubscribe link

**For Development:**
1. Use SMTP (Gmail) for testing
2. Use Mailgun free tier (1000 emails/month)
3. Set up proper logging

---

## 🎯 **Next Steps**

1. Choose email provider (Mailgun recommended)
2. Set up credentials in `.env`
3. Add endpoint to `main_enhanced.py`
4. Test with curl
5. Update frontend to call endpoint
6. Monitor email delivery

Frontend functionality is **already implemented** ✅ and works with or without backend!
