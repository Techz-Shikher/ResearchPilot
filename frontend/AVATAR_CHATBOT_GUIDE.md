# 🤖 Avatar Chatbot Feature

An animated, interactive avatar chatbot that appears on your ResearchPilot homepage to guide users and answer common questions.

## Features

### 🎨 Animated Avatar
- **Floating Animation**: Smooth up-and-down bobbing motion
- **Breathing Effect**: Avatar gently expands and contracts
- **Blinking Eyes**: Realistic eye-blinking animation
- **Smiling Mouth**: Dynamic smile animation
- **Glowing Aura**: Pulsing glow effect around the avatar
- **Responsive**: Scales up on hover
- **Notification Badge**: Shows unread message count when closed

### 💬 Chatbot Features
- **Quick Start Messages**: Pre-populated greeting message
- **Smart Responses**: Intelligent keyword-based answer system
- **Quick Reply Buttons**: Fast access to common questions
- **Typing Indicator**: Shows when bot is "thinking"
- **Message Timestamps**: All messages timestamped
- **Auto-scroll**: Chat automatically scrolls to latest messages
- **Keyboard Support**: Press Enter to send messages

### 🎯 Conversation Topics
The chatbot can answer questions about:
- How to search for papers (`search`, `how to find`, `looking for`)
- How to upload PDFs (`upload`, `PDF`, `local file`)
- How to save papers (`save`, `bookmark`, `library`)
- How to get summaries (`summary`, `abstract`, `key points`)
- How to ask questions about papers (`Q&A`, `question`)
- Literature review features (`literature`, `review`, `synthesis`)
- General help and features

### 🚀 Quick Questions
Pre-defined buttons for quick access:
- "How to search?"
- "Upload PDF?"
- "Save papers?"
- "Get help"

---

## Files Created

### Components
- **`src/components/AvatarChatbot.jsx`** - Main chatbot component with all logic

### Styles
- **`src/styles/avatar-animations.css`** - All animation keyframes and effects

### Integration
- **`src/pages/HomePage.jsx`** - Updated with avatar chatbot import
- **`src/App.jsx`** - Updated with animation stylesheet import

---

## How It Works

### Avatar Button (Bottom Right)
```
┌─────────────────┐
│  🔘             │  ← Floating animated avatar
│                 │     • Floats up and down
│                 │     • Glows on hover
│                 │     • Shows unread count
└─────────────────┘
```

### Chat Window
When clicked, opens a chat window with:
1. **Header** - Brand name and status indicator
2. **Message Area** - Scrollable conversation history
3. **Input Field** - Type messages to send
4. **Quick Buttons** - Pre-defined common questions
5. **Send Button** - Submit messages

### Message Flow
```
User Message (Right, Blue)
    ↓
Bot Typing Indicator (Left, with 3 bouncing dots)
    ↓
Bot Response (Left, Gray)
```

---

## Customization

### Change Avatar Appearance

**Edit `src/components/AvatarChatbot.jsx` line ~35:**

```jsx
// Avatar color
className="bg-gradient-to-r from-primary-500 to-secondary-500"

// Avatar size
className="w-16 h-16"  // button size
className="w-12 h-12"  // avatar inner size
```

### Add More Bot Responses

**Edit `src/components/AvatarChatbot.jsx` line ~25:**

```jsx
const botResponses = {
  'search': "Your custom search help text",
  'upload': "Your custom upload help text",
  'save': "Your custom save help text",
  'my-topic': "Answer about your topic",
  default: "Default fallback response",
};
```

### Change Quick Question Buttons

**Edit `src/components/AvatarChatbot.jsx` line ~185:**

```jsx
{['How to search?', 'Upload PDF?', 'Save papers?', 'Get help'].map(...)}
```

Replace with your custom questions:
```jsx
{['My custom Q1?', 'My custom Q2?', 'My custom Q3?'].map(...)}
```

### Adjust Animation Speed

**Edit `src/styles/avatar-animations.css`:**

```css
/* Float speed - change from 3s to your preference */
@keyframes float {
  animation: float 3s ease-in-out infinite;
}

/* Blink speed - change 3s duration */
@keyframes blink {
  animation: blink 3s ease-in-out infinite;
}
```

### Change Colors

**Edit gradient colors in `src/components/AvatarChatbot.jsx`:**

```jsx
// Avatar button gradient
className="bg-gradient-to-r from-primary-500 to-secondary-500"

// Avatar inner gradient
className="bg-gradient-to-br from-white to-blue-100"

// Eye color
className="text-primary-600"

// Header gradient
className="bg-gradient-to-r from-primary-500 to-secondary-500"
```

---

## Animations Included

### Avatar Animations
- `animate-float` - Gentle up-down floating
- `animate-pulse-glow` - Pulsing glow effect
- `animate-blink` - Eye blinking
- `animate-smile` - Mouth movement
- `animate-bounce-gentle` - Soft bouncing
- `animate-breathing` - Chest breathing effect
- `animate-badge-pulse` - Notification badge pulse

### Chat Animations
- `animate-slide-up` - Window entrance from bottom
- `animate-slide-in-left` - Bot message slide in
- `animate-slide-in-right` - User message slide in
- `animate-typing-bounce` - Typing indicator dots
- `animate-tooltip-pop` - Hover tooltip appear

---

## Usage Examples

### Using the Avatar
1. **Open Chat** - Click the avatar button in bottom-right corner
2. **Ask Questions** - Type a question or click a quick button
3. **Get Answers** - Bot responds with relevant information
4. **Close Chat** - Click the X button in the header

### Keyboard Shortcuts
- **Enter** - Send message
- **Shift + Enter** - New line in message
- **Click X** - Close chatbot

---

## Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

---

## Performance Notes

- Animations use CSS (GPU accelerated)
- No heavy JavaScript involved
- Minimal impact on page load
- Responsive on all screen sizes

---

## Future Enhancements

Possible improvements:
- [ ] Real backend API integration for responses
- [ ] AI-powered dynamic answers
- [ ] Chat history persistence
- [ ] Multi-language support
- [ ] Sentiment analysis
- [ ] User satisfaction tracking
- [ ] Integration with analytics

---

## Troubleshooting

### Avatar not animating
- Check if `avatar-animations.css` is imported in `App.jsx`
- Ensure animations CSS file exists in `src/styles/`

### Chat window doesn't appear
- Verify `AvatarChatbot` component is imported in `HomePage.jsx`
- Check browser console for errors
- Clear browser cache

### Animations are slow
- Check if you have heavy CSS elsewhere
- Try disabling browser extensions
- Test in incognito/private mode

### Mobile layout issues
- Avatar uses `fixed` positioning - should work on all screens
- Chat window uses `max-w-[90vw]` for mobile responsiveness
- Test on actual mobile devices for best results

---

## Code Structure

```
AvatarChatbot Component
├── Avatar Button (Right-floating)
│   ├── Inner avatar with eyes/mouth
│   ├── Animations (float, glow, breathing)
│   ├── Notification badge
│   └── Hover tooltip
│
└── Chat Window (when open)
    ├── Header (with brand name)
    ├── Message Area
    │   ├── Bot messages (left)
    │   ├── User messages (right)
    │   └── Typing indicator
    ├── Input Field (with send button)
    └── Quick Reply Buttons
```

---

## API Integration Ready

The chatbot is ready for backend integration:

```javascript
// Currently uses local responses
const getResponse = (userMessage) => {
  // Add your API call here
  // const response = await fetch('/api/chatbot', { ... })
  // return response.data
}
```

To add real backend responses, replace the `getResponse` function with an API call.

---

## License & Attribution

Part of ResearchPilot AI
Built with React, Tailwind CSS, and custom animations

---

**Enjoy your new avatar chatbot!** 🎉

Need help? Check the code comments or ask the avatar itself! 😄
