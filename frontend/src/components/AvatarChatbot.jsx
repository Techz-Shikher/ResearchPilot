import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function AvatarChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm your ResearchPilot Assistant. I can help you navigate and use this platform. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Pre-defined responses for common questions
  const botResponses = {
    'search': "You can search for papers on arXiv using the Search Papers tab. Just enter keywords and I'll find relevant research for you!",
    'upload': "Click on the Upload PDF tab to upload your own papers. You can then analyze them with AI-powered summaries and Q&A!",
    'save': "Once you find a paper, click the Save button to add it to your library. You can access all saved papers in the Saved Papers tab.",
    'summary': "I can generate AI-powered summaries of papers to help you understand the key points quickly. Just select a paper and click Summarize!",
    'question': "You can ask questions about papers and get AI-generated answers. Select a paper and use the Q&A feature!",
    'literature': "The Literature Review feature helps you generate comprehensive reviews of multiple papers on a topic. Perfect for research!",
    'features': "ResearchPilot has these main features: Paper Search, PDF Upload, Saved Papers, Literature Reviews, Summaries, and Q&A. What interests you?",
    'help': "I'm here to help! You can ask me about searching papers, uploading PDFs, saving papers, or any other features. What would you like to know?",
    default: "That's a great question! You can use ResearchPilot to search for papers, upload PDFs, create summaries, ask questions, and generate literature reviews. Want to know more about any specific feature?",
  };

  const getResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking and response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Avatar Button - Floating */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-40 group animate-float"
        title="Chat with Assistant"
      >
        {/* Animated avatar */}
        <div className="relative w-12 h-12 animate-pulse-glow">
          {/* Background glow animation */}
          <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>

          {/* Avatar circle with breathing effect */}
          <div className="relative w-12 h-12 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-breathing">
            {/* Left eye with blink */}
            <div className="absolute top-3 left-2 w-1.5 h-2 bg-primary-600 rounded-full animate-blink"></div>

            {/* Right eye with blink */}
            <div className="absolute top-3 right-2 w-1.5 h-2 bg-primary-600 rounded-full animate-blink" style={{ animationDelay: '0.1s' }}></div>

            {/* Mouth - animated smile */}
            <svg
              className="absolute top-6 w-3 h-2 animate-smile"
              viewBox="0 0 20 10"
            >
              <path
                d="M 3 5 Q 10 8 17 5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-primary-600"
              />
            </svg>
          </div>

          {/* Notification dot when new messages */}
          {!isOpen && messages.length > 1 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-badge-pulse">
              !
            </div>
          )}
        </div>

        {/* Hover label with animation */}
        <div className="absolute right-20 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-tooltip-pop">
          Chat with us 💬
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90vw] bg-white rounded-lg shadow-2xl flex flex-col z-50 max-h-[70vh] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center animate-bounce-gentle">
                <MessageCircle className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold">ResearchPilot Assistant</h3>
                <p className="text-xs opacity-90">🟢 Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors duration-200 transform hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary-500 text-white rounded-br-none animate-slide-in-right'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none animate-slide-in-left'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-typing-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-typing-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-white p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={handleSendMessage}
              className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg p-2 transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick replies suggestion */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-t text-xs text-gray-600 space-y-2">
            <p className="font-semibold text-gray-700">💡 Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {['How to search?', 'Upload PDF?', 'Save papers?', 'Get help'].map(
                (q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                    }}
                    className="bg-white border border-gray-300 rounded px-2 py-1 hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 text-gray-700 hover:text-primary-600 hover:shadow-md transform hover:scale-105 active:scale-95"
                  >
                    {q}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
