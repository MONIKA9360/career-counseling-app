import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  UserCircleIcon,
  XMarkIcon,
  Bars3Icon,
  SparklesIcon,
  RocketLaunchIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const SinglePage = () => {
  const { user, login, register, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Auth form state
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    if (authMode === 'register') {
      if (authForm.password !== authForm.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      const result = await register({
        name: authForm.name,
        email: authForm.email,
        password: authForm.password,
        role: authForm.role
      });
      if (result.success) {
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
      }
    } else {
      const result = await login(authForm.email, authForm.password);
      if (result.success) {
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
      }
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting form:', contactForm);
      
      // Show loading state
      const loadingToast = toast.loading('Sending your message... 🚀');
      
      const response = await axios.post('/api/contact', contactForm, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      console.log('Response:', response.data);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Message sent successfully! 🎉', {
          duration: 5000,
          icon: '🎉',
        });
      } else {
        toast.success('Message sent successfully! 🎉', {
          duration: 5000,
          icon: '🎉',
        });
      }
      
      // Clear form
      setContactForm({ name: '', email: '', subject: '', message: '' });
      
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Dismiss any loading toast
      toast.dismiss();
      
      let errorMessage = 'Failed to send message. Please try again. 😔';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection and try again. ⏰';
      } else if (error.response) {
        errorMessage = error.response.data?.message || 'Server error. Please try again later. 🔧';
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection. 📡';
      }
      
      toast.error(errorMessage, {
        duration: 5000,
        icon: '❌',
      });
    }
  };

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Modern Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50">
                    <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    CareerGuide
                  </h1>
                  <p className="text-xs text-white/60 font-medium">AI-Powered Career Platform</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                    activeSection === item.id
                      ? 'text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 shadow-lg shadow-purple-500/25 border border-purple-400/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {activeSection === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur-xl"></div>
                  )}
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl border border-emerald-400/30 backdrop-blur-xl">
                    <div className="relative">
                      <UserCircleIcon className="h-8 w-8 text-emerald-400" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-semibold text-white">{user.name}</span>
                  </div>
                  <button 
                    onClick={logout} 
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="px-6 py-3 text-white/80 hover:text-white font-semibold transition-all duration-300 hover:bg-white/10 rounded-2xl"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-purple-500/50 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <RocketLaunchIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
              >
                {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-2xl border-t border-white/20">
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Ultra-Modern Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-400/30 backdrop-blur-xl mb-8">
              <StarIcon className="w-5 h-5 text-yellow-400 mr-2 animate-spin" />
              <span className="text-cyan-300 font-semibold text-sm">🚀 AI-Powered Career Discovery Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Discover Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Dream Career
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Transform your future with AI-powered career guidance, personalized assessments, and expert mentorship designed for the next generation of professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={() => scrollToSection('services')}
                className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-purple-500/50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  🚀 Start Your Journey
                  <SparklesIcon className="ml-3 w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              
              <button
                onClick={() => scrollToSection('contact')}
                className="group px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 font-bold text-lg rounded-2xl transition-all duration-500 transform hover:scale-110 hover:border-cyan-400/50"
              >
                <span className="flex items-center">
                  💬 Get Expert Advice
                  <ChartBarIcon className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </button>
            </div>
            
            {/* Modern Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: '50K+', label: 'Students Guided', icon: '👥' },
                { number: '98%', label: 'Success Rate', icon: '🎯' },
                { number: '100+', label: 'Expert Mentors', icon: '🌟' }
              ].map((stat, index) => (
                <div key={index} className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-500 transform hover:scale-105">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">{stat.number}</div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400/50 to-purple-500/50 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/50 to-pink-500/50 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Ultra-Modern About Section */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full border border-emerald-400/30 backdrop-blur-xl mb-8">
              <span className="text-emerald-300 font-semibold">✨ Why Choose CareerGuide</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Empowering Your
              </span>
              <br />
              <span className="text-white">Professional Journey</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              We're revolutionizing career development through cutting-edge AI, expert guidance, and personalized strategies that unlock your true potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: AcademicCapIcon,
                title: 'AI-Powered Assessment',
                description: 'Advanced machine learning algorithms analyze your personality, skills, and interests to provide precise career recommendations.',
                gradient: 'from-cyan-500 to-blue-500',
                bgGradient: 'from-cyan-500/20 to-blue-500/20'
              },
              {
                icon: UserGroupIcon,
                title: 'Expert Mentorship',
                description: 'Connect with industry-leading professionals who provide personalized guidance and strategic career planning.',
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-500/20 to-pink-500/20'
              },
              {
                icon: ChartBarIcon,
                title: 'Progress Analytics',
                description: 'Real-time tracking and detailed analytics to monitor your career development with actionable insights.',
                gradient: 'from-emerald-500 to-cyan-500',
                bgGradient: 'from-emerald-500/20 to-cyan-500/20'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
                <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern Services Section */}
      <section id="services" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-400/30 backdrop-blur-xl mb-8">
              <span className="text-yellow-300 font-semibold">🔥 Premium Services</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="text-white">Career Journey</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Free Assessment Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-cyan-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative p-10 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 hover:border-emerald-400/50 transition-all duration-500 transform hover:-translate-y-6 hover:scale-105">
                <div className="absolute top-6 right-6">
                  <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold rounded-full animate-bounce shadow-lg">
                    🎯 MOST POPULAR
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    <AcademicCapIcon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                    AI Career Assessment
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    Revolutionary AI-powered analysis of your personality, skills, and interests to discover your perfect career match.
                  </p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">FREE</span>
                    <span className="ml-4 text-white/60 line-through text-2xl">₹2,999</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: '🧠', text: 'Advanced AI personality analysis' },
                    { icon: '⚡', text: 'Real-time skills evaluation' },
                    { icon: '🎯', text: 'Precision career matching' },
                    { icon: '📊', text: 'Detailed insights report' },
                    { icon: '🚀', text: 'Personalized growth roadmap' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center text-white/90">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mr-4 border border-emerald-400/30">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/50"
                >
                  <span className="relative z-10 flex items-center justify-center text-lg">
                    🚀 Start Free Assessment
                    <SparklesIcon className="ml-3 w-6 h-6 group-hover/btn:rotate-180 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>
            </div>

            {/* Premium Counseling Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative p-10 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 hover:border-purple-400/50 transition-all duration-500 transform hover:-translate-y-6 hover:scale-105">
                <div className="absolute top-6 right-6">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full animate-bounce shadow-lg">
                    👑 PREMIUM
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    <UserGroupIcon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                    Expert Mentorship
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    One-on-one sessions with industry titans for personalized guidance and strategic career acceleration.
                  </p>
                  <div className="flex items-baseline mb-2">
                    <span className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">₹4,999</span>
                    <span className="ml-3 text-2xl text-white/80">/session</span>
                  </div>
                  <p className="text-white/60 text-sm">90-minute premium consultation</p>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: '⏰', text: '90-minute deep-dive sessions' },
                    { icon: '🎯', text: 'Personalized success strategy' },
                    { icon: '📈', text: 'Industry insider insights' },
                    { icon: '🤝', text: 'Elite networking access' },
                    { icon: '📋', text: 'Custom action blueprint' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center text-white/90">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mr-4 border border-purple-400/30">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
                >
                  <span className="relative z-10 flex items-center justify-center text-lg">
                    👑 Book Premium Session
                    <RocketLaunchIcon className="ml-3 w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Modern Contact Section */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/30 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-400/30 backdrop-blur-xl mb-8">
              <span className="text-indigo-300 font-semibold">💬 Let's Connect</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Start Your
              </span>
              <br />
              <span className="text-white">Success Story</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Ready to transform your career? Let's create your personalized roadmap to success together.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative p-10 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 hover:border-indigo-400/50 transition-all duration-500 transform hover:-translate-y-4">
                <div className="mb-8">
                  <h3 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Send us a message
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                </div>
                
                <form onSubmit={handleContactSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group/input">
                      <label className="block text-sm font-bold text-white/90 mb-3 group-focus-within/input:text-indigo-300 transition-colors duration-300">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-500 text-white placeholder-white/50 hover:border-indigo-400/50 transform focus:scale-105"
                          placeholder="Enter your full name"
                          required
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                      </div>
                    </div>
                    
                    <div className="group/input">
                      <label className="block text-sm font-bold text-white/90 mb-3 group-focus-within/input:text-indigo-300 transition-colors duration-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-500 text-white placeholder-white/50 hover:border-indigo-400/50 transform focus:scale-105"
                          placeholder="your.email@example.com"
                          required
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group/input">
                    <label className="block text-sm font-bold text-white/90 mb-3 group-focus-within/input:text-indigo-300 transition-colors duration-300">
                      Subject
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-500 text-white placeholder-white/50 hover:border-indigo-400/50 transform focus:scale-105"
                        placeholder="What can we help you with?"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                  </div>
                  
                  <div className="group/input">
                    <label className="block text-sm font-bold text-white/90 mb-3 group-focus-within/input:text-indigo-300 transition-colors duration-300">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        rows="6"
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-500 text-white placeholder-white/50 hover:border-indigo-400/50 transform focus:scale-105 resize-none"
                        placeholder="Tell us about your career goals and how we can help you achieve them..."
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-purple-500/50"
                  >
                    <span className="relative z-10 flex items-center justify-center text-lg">
                      🚀 Send Message
                      <SparklesIcon className="ml-3 w-6 h-6 group-hover/btn:rotate-180 group-hover/btn:scale-125 transition-all duration-500" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Modern Footer */}
      <footer className="relative py-20 bg-gradient-to-t from-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CareerGuide
                </h3>
                <p className="text-white/60 text-sm">AI-Powered Career Platform</p>
              </div>
            </div>
            <p className="text-white/80 mb-6 text-lg">
              Empowering the next generation of professionals through AI-driven career guidance
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 backdrop-blur-xl">
              <span className="text-purple-300 font-semibold text-sm">💜 Developed by MONIKA M</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Ultra-Modern Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 transform animate-bounce">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {authMode === 'login' ? 'Welcome Back' : 'Join CareerGuide'}
                </h3>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-bold text-white/90 mb-2">Name</label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white placeholder-white/50"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-2">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white placeholder-white/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-2">Password</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white placeholder-white/50"
                    required
                  />
                </div>
                
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-bold text-white/90 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={authForm.confirmPassword}
                      onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white placeholder-white/50"
                      required
                    />
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  {authMode === 'login' ? '🚀 Sign In' : '✨ Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors duration-300"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Join now"
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePage;