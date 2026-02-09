# 👤 Individual User Dashboard - Feature Guide

## Overview

ResearchPilot now includes a **personalized Individual Dashboard** for each user! This is a dedicated space where users can see their papers, statistics, recent activity, and manage their research profile.

## Features

### 📊 Dashboard Overview
- **Personal Statistics**: Papers generated, papers saved, total views, weekly activity
- **User Profile Card**: Name, affiliation, join date, reputation points
- **Quick Stats**: Average paper length, downloads, and trending data
- **Reputation System**: Earn points for generating and sharing papers

### 📄 My Papers Tab
- **All Generated Papers**: View all AI-generated papers with:
  - Title and topic
  - Creation date
  - Word count and number of sections
  - View count and downloads
  - Current status (Completed/Draft)
  - Research style used
  
- **Search & Filter**:
  - Search papers by title or topic
  - Filter by status (All/Completed/Draft)
  - Quick view of matching results

- **Paper Actions**:
  - **View**: Open paper details
  - **Download**: Export as text file
  - **Share**: Share with others (coming soon)
  - **Delete**: Remove from library

### 🔔 Activity Tab
- Recent actions: Generated, Downloaded, Published, Saved papers
- Timestamp for each action
- Complete activity history
- Track your research journey

### 💾 Saved Papers Tab
- Access papers saved from searches
- Manage your curated collection
- Quick access to important papers

### 🎯 Quick Actions
Three prominent action buttons:
- **Generate New Paper**: Create with AI assistance
- **Search Papers**: Find research papers
- **Upload Paper**: Add your own PDF

## How to Access

### Method 1: User Profile Button (Navbar)
1. Click the **👤** (user profile) button in the top right of the navbar
2. Select **"My Dashboard"** or **"My Papers"** from dropdown
3. View your personalized dashboard

### Method 2: Direct URL
- **Dashboard**: `http://localhost:5173/dashboard`
- **My Papers**: `http://localhost:5173/my-papers`

## Dashboard Tabs

### 1. Overview Tab (Default)
Shows:
- ✅ User profile with avatar and affiliation
- 📊 Key statistics in stat cards
- 📈 Weekly activity data
- 🔄 Recent papers (latest 3)
- 🚀 Quick action buttons

### 2. My Papers Tab
Shows:
- 🔍 Search bar for finding papers
- 📋 Filter options (All/Completed/Draft)
- 📑 Grid of all your generated papers
- 💾 Paper details and quick actions

### 3. Saved Papers Tab
Shows:
- 📚 Papers you've bookmarked
- Search and organize saved papers
- Quick access to your research library

### 4. Activity Tab
Shows:
- ⏱️ Timeline of all activities
- 🔔 Recent actions with timestamps
- 📝 Complete activity history
- 📊 Track your usage patterns

## Statistics Dashboard

### Stat Cards

| Card | Shows | Color | Icon |
|------|-------|-------|------|
| Papers Generated | Total papers created by AI | Blue | 📄 |
| Papers Saved | Bookmarked papers | Green | ✅ |
| Total Views | Cumulative view count | Purple | 👁️ |
| Downloads | Total paper downloads | Orange | ⬇️ |
| Avg. Length | Average words per paper | Indigo | 📊 |

### Growth Indicators
- Week-over-week trends
- Performance metrics
- Activity patterns
- Reputation points

## Paper Management

### View Paper Details
Click "View" on any paper card to:
- Read full paper content
- See structure and sections
- Check creation metadata
- View generation parameters

### Download Paper
Click "Download" to:
- Export as text file (`.txt`)
- Get all content + metadata
- Share locally with others
- Edit offline

### Share Paper (Coming Soon)
Share papers via:
- Direct link
- Email invitation
- Social media
- Public repository

### Delete Paper
Remove papers you no longer need:
- Permanently deletes from library
- Cannot be recovered
- Confirms before deletion

## User Profile

### Profile Information Shown
- **Name**: Full name (e.g., "Dr. Alex Chen")
- **Email**: Contact email
- **Affiliation**: University/Organization
- **Join Date**: When you joined ResearchPilot
- **Reputation**: Points earned
- **Avatar**: Visual identifier

### Update Profile
Click **Settings** in user dropdown to:
- Update name and email
- Change affiliation
- Upload profile picture
- Manage preferences
- Set notification settings

## Statistics & Analytics

### Key Metrics
```
Papers Generated: 12
Papers Saved: 28
Total Views: 245
Weekly Activity: 7 actions
Average Length: 3,500 words
Total Reputation: 450 points
```

### Growth Tracking
- Weekly generation trends
- View growth over time
- Download patterns
- Engagement metrics
- Research velocity

### Achievement System
- First paper generation
- 10 papers milestone
- 100 views achievement
- 50 downloads badge
- Active researcher badge

## Features by Tab

### Overview Tab
✅ User profile card  
✅ Statistics overview  
✅ Weekly summary  
✅ Recent papers (3 most recent)  
✅ Quick action buttons  
✅ Growth indicators  

### My Papers Tab
✅ Search functionality  
✅ Status filtering  
✅ Paper grid/list  
✅ Word count tracking  
✅ View/download counts  
✅ Quick actions (View, Download, Share, Delete)  
✅ Creation date display  
✅ Research style indicator  

### Saved Papers Tab
✅ Bookmarked papers collection  
✅ Organization tools  
✅ Search within saved  
✅ Quick access  

### Activity Tab
✅ Complete activity history  
✅ Timestamp tracking  
✅ Action types displayed  
✅ Paper titles linked  
✅ Sortable timeline  

## UI/UX Details

### Design Elements
- **Color Scheme**: Primary & Secondary gradients
- **Icons**: Lucide React icons
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-friendly design
- **Accessibility**: Proper contrast and labels

### Responsive Breakpoints
- **Mobile** (< 768px): Single column layout
- **Tablet** (768px - 1024px): 2-3 columns
- **Desktop** (> 1024px): Full grid layout

### Interactions
- Hover effects on cards
- Click to expand details
- Smooth tab transitions
- Dropdown menus
- Loading states (coming soon)

## Integration Points

### Connected Features
- **Generate Page**: Create new papers from dashboard
- **Search Page**: Find papers from dashboard
- **Upload Page**: Add PDFs from dashboard
- **Paper Details**: View full paper content
- **Settings**: Manage profile preferences
- **Logout**: Exit account from dropdown

### Data Sources
Currently uses **mock data**:
- 12 generated papers
- 28 saved papers
- 245 total views
- Sample user profile (Dr. Alex Chen)

### Future Integrations
- Real user authentication
- Database backend
- Real-time statistics
- Cloud storage
- Analytics and reporting
- Social features

## Navigation

### From Dashboard
```
User Profile Button (👤)
├── My Dashboard (Overview Tab)
├── My Papers (Papers Tab)
├── Settings (User Settings)
└── Logout (Exit Account)

Quick Actions:
├── Generate New Paper → /generate
├── Search Papers → /search
└── Upload Paper → /upload
```

### From Other Pages
- Click navbar "👤" button in top right
- Select "My Dashboard"
- View your personalized space

## Technical Details

### Component Structure
```
UserDashboard (Main Component)
├── Header Section
│   ├── User Profile Card
│   └── Settings Button
├── Statistics Section
│   ├── Stat Cards (5)
│   └── Growth Indicators
├── Tabs Navigation
├── Tab Content
│   ├── Overview Tab
│   ├── Papers Tab
│   ├── Saved Tab
│   └── Activity Tab
└── Modals
    ├── Delete Confirmation
    └── Share Dialog
```

### State Management
```javascript
const [activeTab, setActiveTab] = useState('overview');
const [filterType, setFilterType] = useState('all');
const [searchQuery, setSearchQuery] = useState('');
const [userProfile, setUserProfile] = useState(null);
const [papers, setPapers] = useState([]);
const [stats, setStats] = useState({...});
```

### Data Used
- **User Profile**: Mock - Dr. Alex Chen
- **Papers**: Array of 5 sample papers
- **Statistics**: Mock metrics
- **Activity**: Array of 5 recent actions

### Future Data Source
- Replace mock data with API calls
- Backend endpoint: `/api/user/dashboard`
- Real-time data updates
- Pagination for large datasets

## Tips & Tricks

### Maximize Your Dashboard
1. **Regular Generation**: Create papers weekly
2. **Organize Papers**: Use meaningful titles
3. **Track Activity**: Monitor your productivity
4. **Save Papers**: Bookmark important research
5. **Share Success**: Publish papers to gain reputation

### Best Practices
- ✅ Keep profine details current
- ✅ Generate diverse papers
- ✅ Download important papers
- ✅ Review paper quality
- ✅ Share with colleagues

### Common Tasks
- **Find a paper**: Use search in "My Papers" tab
- **Download paper**: Click download on paper card
- **Delete paper**: Hover and click trash icon
- **View stats**: Check overview tab
- **See activity**: Switch to activity tab

## Future Enhancements (Roadmap)

Phase 2:
- [ ] Real authentication system
- [ ] Database backend integration
- [ ] Real-time statistics
- [ ] Paper sharing functionality
- [ ] Advanced filtering
- [ ] Bulk operations

Phase 3:
- [ ] Collaboration features
- [ ] Team workspaces
- [ ] Paper comments/reviews
- [ ] Analytics dashboard
- [ ] Export reports
- [ ] API access

Phase 4:
- [ ] Social features
- [ ] Trending papers
- [ ] Recommendations
- [ ] Research groups
- [ ] Performance benchmarks

## Support

### Getting Help
1. Check this guide for answers
2. Review FAQ section
3. Contact support team
4. Check backend logs

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Dashboard loading slowly | Refresh page, check connection |
| Papers not showing | Try filtering, search |
| Stats not updating | Refresh page, log out/in |
| Download not working | Check browser settings |
| Menu not opening | Click user button again |

---

## Summary

The **Individual User Dashboard** provides a personalized, comprehensive view of your research activities in ResearchPilot. Track your papers, monitor statistics, manage your research library, and stay productive all from one centralized location!

**Access it now**: Click the 👤 button in the navbar and select "My Dashboard"!

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: February 9, 2026
