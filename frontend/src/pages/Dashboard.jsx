import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Search, Upload, BookOpen, Sparkles, Globe, ArrowRight, Star, TrendingUp, Brain } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: 'Search Papers',
      description: 'Search millions of research papers from arXiv',
      action: 'Search',
      path: '/search',
      gradient: 'from-blue-500 to-cyan-500',
      icon_gradient: 'from-blue-600 to-blue-400',
      delay: '0s',
    },
    {
      icon: Upload,
      title: 'Upload PDF',
      description: 'Upload your own PDF papers for analysis',
      action: 'Upload',
      path: '/upload',
      gradient: 'from-purple-500 to-pink-500',
      icon_gradient: 'from-purple-600 to-purple-400',
      delay: '0.1s',
    },
    {
      icon: BookOpen,
      title: 'Saved Papers',
      description: 'Access your saved paper library',
      action: 'View',
      path: '/saved',
      gradient: 'from-green-500 to-emerald-500',
      icon_gradient: 'from-green-600 to-green-400',
      delay: '0.2s',
    },
    {
      icon: Sparkles,
      title: 'Literature Review',
      description: 'Generate comprehensive literature reviews',
      action: 'Create',
      path: '/literature-review',
      gradient: 'from-orange-500 to-red-500',
      icon_gradient: 'from-orange-600 to-orange-400',
      delay: '0.3s',
    },
    {
      icon: Brain,
      title: 'Generate Paper',
      description: 'Create research papers with AI assistance',
      action: 'Generate',
      path: '/generate',
      gradient: 'from-teal-500 to-cyan-500',
      icon_gradient: 'from-teal-600 to-teal-400',
      delay: '0.4s',
    },
    {
      icon: Globe,
      title: 'Publish Paper',
      description: 'Share your research with the world',
      action: 'Publish',
      path: '/publish',
      gradient: 'from-indigo-500 to-purple-500',
      icon_gradient: 'from-indigo-600 to-indigo-400',
      delay: '0.5s',
    },
  ];

  return (
    <div className="space-y-20">
      {/* Animated Hero Section */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-500"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 p-16 sm:p-20 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-block">
              <div className="bg-white/20 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Zap size={16} className="animate-bounce" /> AI-Powered Research Intelligence
                </span>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-6xl sm:text-7xl font-black leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                  ResearchPilot
                </span>
                <div className="text-4xl sm:text-5xl text-blue-100 font-bold mt-2">
                  AI Research Hub
                </div>
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                Discover, analyze, and synthesize research papers with advanced AI-powered tools. Transform how you explore scientific knowledge.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate('/search')}
                className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                Start Exploring <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/publish')}
                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Publish Paper <Globe size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Powerful Features
          </h2>
          <p className="text-gray-600 text-lg">Everything you need for advanced research</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, idx) => (
            <div
              key={feature.path}
              className="group cursor-pointer"
              style={{animationDelay: feature.delay}}
              onClick={() => navigate(feature.path)}
            >
              {/* Card with Gradient Border Effect */}
              <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 hover:border-primary-300 transition-all duration-300 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 backdrop-blur-xl">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                {/* Icon */}
                <div className={`bg-gradient-to-br ${feature.icon_gradient} p-4 rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon size={28} className="text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 group/btn">
                      {feature.action}
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-200 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section - Animated */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: TrendingUp, label: 'Papers Available', value: '2M+', color: 'from-blue-500 to-cyan-500' },
          { icon: Sparkles, label: 'AI Features', value: 'Advanced', color: 'from-purple-500 to-pink-500' },
          { icon: Star, label: 'Speed', value: 'Instant', color: 'from-orange-500 to-red-500' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl p-8 text-white transform hover:scale-105 transition-all duration-300 group cursor-pointer"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}`}></div>
            
            {/* Animated Blur Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-300"></div>

            {/* Content */}
            <div className="relative z-10 space-y-4">
              <stat.icon size={32} className="group-hover:scale-110 transition-transform duration-300" />
              <div>
                <div className="text-4xl font-black mb-2">{stat.value}</div>
                <div className="text-white/80 font-semibold">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works - Animated Steps */}
      <div>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Simple Workflow
          </h2>
          <p className="text-gray-600 text-lg">Follow these steps to get the most out of ResearchPilot</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { num: '1', title: 'Search', desc: 'Find papers from millions of sources', icon: Search, color: 'from-blue-500 to-cyan-500' },
            { num: '2', title: 'Upload', desc: 'Add your own PDF documents', icon: Upload, color: 'from-purple-500 to-pink-500' },
            { num: '3', title: 'Analyze', desc: 'Get AI-powered summaries & insights', icon: Sparkles, color: 'from-orange-500 to-red-500' },
            { num: '4', title: 'Publish', desc: 'Share and synthesize findings', icon: Globe, color: 'from-green-500 to-emerald-500' },
          ].map((step, idx) => (
            <div key={step.num} className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                {/* Step Number Circle */}
                <div className={`bg-gradient-to-br ${step.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  {step.num}
                </div>

                {/* Content */}
                <div className="text-center space-y-3 relative z-10">
                  <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>

                {/* Decorative Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                {/* Arrow Connector */}
                {idx < 3 && (
                  <div className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2">
                    <ArrowRight size={32} className="text-primary-300 group-hover:text-primary-400 transition-colors" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 p-16 text-white text-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h3 className="text-4xl font-black">Ready to Transform Your Research?</h3>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of researchers using ResearchPilot AI to discover insights faster.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2 shadow-2xl hover:scale-105 transform"
          >
            Get Started Now <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
