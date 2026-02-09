import React, { useState } from 'react';
import { Search, Upload, BookOpen, FileText, LogOut, Globe, Sparkles, Brain, User, Settings, LayoutDashboard, Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: BookOpen, label: 'Saved', path: '/saved' },
    { icon: FileText, label: 'Literature Review', path: '/literature-review' },
    { icon: Brain, label: 'Generate', path: '/generate' },
    { icon: Globe, label: 'Publish', path: '/publish' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 group-hover:from-primary-700 group-hover:to-secondary-700 transition-all duration-300">
                ResearchPilot
              </div>
            </div>
          </div>

          {/* Navigation Items - Center */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-semibold group text-sm ${
                  isActive(item.path)
                    ? 'text-primary-700'
                    : 'text-gray-600 hover:text-primary-700'
                }`}
              >
                {/* Background effect on active */}
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg -z-10"></div>
                )}

                {/* Icon */}
                <item.icon size={18} className={`transition-all duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                
                {/* Label */}
                <span>{item.label}</span>

                {/* Active Indicator */}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Right Section - Status & User Menu */}
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 hover:border-green-300/70 transition-all">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-700 tracking-wide">CONNECTED</span>
            </div>

            {/* Notifications Badge */}
            <button className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white hover:shadow-xl transition-all transform hover:scale-105 group"
              >
                <span className="text-base font-bold">👤</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Enhanced Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50 animate-in fade-in origin-top-right">
                  {/* Header with Gradient */}
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-5 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl border-2 border-white/30">
                        👤
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base">Dr. Alex Chen</p>
                        <p className="text-xs opacity-90">alex.chen@research.edu</p>
                      </div>
                    </div>
                    <div className="text-xs opacity-80 mt-2">
                      <span className="inline-block">🎓 MIT Computer Science</span>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="font-bold text-sm text-primary-600">12</div>
                      <div className="text-xs text-gray-600">Papers</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-green-600">450</div>
                      <div className="text-xs text-gray-600">Reputation</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-purple-600">28</div>
                      <div className="text-xs text-gray-600">Saved</div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-3 space-y-2">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 rounded-xl transition-all transform hover:translate-x-1 group"
                    >
                      <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                        <LayoutDashboard size={18} className="text-primary-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-sm">My Dashboard</p>
                        <p className="text-xs text-gray-500">View your profile</p>
                      </div>
                      <ChevronDown size={16} className="text-gray-400 -rotate-90" />
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/my-papers');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all transform hover:translate-x-1 group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <FileText size={18} className="text-blue-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-sm">My Papers</p>
                        <p className="text-xs text-gray-500">Manage your work</p>
                      </div>
                      <ChevronDown size={16} className="text-gray-400 -rotate-90" />
                    </button>
                    
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all transform hover:translate-x-1 group"
                    >
                      <div className="p-2 bg-gray-200 rounded-lg group-hover:bg-gray-300 transition-colors">
                        <Settings size={18} className="text-gray-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-sm">Settings</p>
                        <p className="text-xs text-gray-500">Preferences</p>
                      </div>
                      <ChevronDown size={16} className="text-gray-400 -rotate-90" />
                    </button>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>
                  
                  {/* Logout */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Add logout logic here
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all font-semibold text-sm m-2 rounded-xl"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
