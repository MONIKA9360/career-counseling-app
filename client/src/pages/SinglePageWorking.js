import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon
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
      const response = await axios.post('/api/contact', contactForm);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Message sent successfully! Check your email for confirmation.');
      } else {
        toast.success('Message sent successfully!');
      }
      
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">CareerGuide</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
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
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium w-full text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Home Section */}
      <section id="home" className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Your Perfect Career
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Transform your future with personalized career guidance and expert counseling
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('services')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CareerGuide</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're dedicated to transforming careers through expert guidance and personalized strategies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Assessment</h3>
              <p className="text-gray-600">
                AI-powered assessment that provides deep insights into your ideal career path
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Mentorship</h3>
              <p className="text-gray-600">
                Connect with industry-leading career counselors for personalized guidance
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Progress Analytics</h3>
              <p className="text-gray-600">
                Track your career development with detailed insights and analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive career development services designed for your success
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Career Assessment</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive analysis of your personality, skills, and interests
                </p>
                <div className="text-3xl font-bold text-green-600 mb-2">FREE</div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Personality analysis
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Skills evaluation
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Career matching
                </li>
              </ul>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Free Assessment
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Expert Counseling</h3>
                <p className="text-gray-600 mb-4">
                  One-on-one sessions with industry-leading career counselors
                </p>
                <div className="text-3xl font-bold text-blue-600 mb-2">$75</div>
                <p className="text-gray-500 text-sm">per session</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  60-minute sessions
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Personalized strategy
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Industry insights
                </li>
              </ul>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your career? Get in touch with us today
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-lg shadow-lg p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold">CareerGuide</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering careers through expert guidance and personalized strategies
            </p>
            <p className="text-gray-500 text-sm">
              Developed by MONIKA M
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePage;