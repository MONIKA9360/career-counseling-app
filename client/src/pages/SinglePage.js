import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  UserCircleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const SinglePage = () => {
  const { user, login, register, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Assessment state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // Booking state
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [bookingForm, setBookingForm] = useState({
    date: '',
    timeSlot: { start: '', end: '' },
    type: 'career-guidance',
    notes: ''
  });

  // Blog state
  const [blogPosts, setBlogPosts] = useState([]);

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

  const questions = [
    {
      id: 1,
      question: "What type of work environment do you prefer?",
      options: [
        { text: "Collaborative team environment", value: 4, category: "business" },
        { text: "Independent work with minimal supervision", value: 3, category: "technology" },
        { text: "Creative and flexible workspace", value: 4, category: "creative" },
        { text: "Structured and organized environment", value: 3, category: "healthcare" }
      ]
    },
    {
      id: 2,
      question: "Which activities do you find most engaging?",
      options: [
        { text: "Solving complex problems and puzzles", value: 4, category: "technology" },
        { text: "Helping and supporting others", value: 4, category: "healthcare" },
        { text: "Creating and designing new things", value: 4, category: "creative" },
        { text: "Leading projects and managing teams", value: 4, category: "business" }
      ]
    },
    {
      id: 3,
      question: "What motivates you most in your work?",
      options: [
        { text: "Making a positive impact on people's lives", value: 4, category: "healthcare" },
        { text: "Building innovative solutions", value: 4, category: "technology" },
        { text: "Expressing creativity and artistic vision", value: 4, category: "creative" },
        { text: "Achieving business goals and growth", value: 4, category: "business" }
      ]
    }
  ];

  const careerRecommendations = {
    technology: ["Software Developer", "Data Scientist", "Cybersecurity Analyst", "AI/ML Engineer"],
    healthcare: ["Clinical Psychologist", "Nurse Practitioner", "Physical Therapist", "Healthcare Administrator"],
    creative: ["UX/UI Designer", "Graphic Designer", "Content Creator", "Marketing Specialist"],
    business: ["Business Analyst", "Project Manager", "Management Consultant", "Sales Manager"]
  };

  const timeSlots = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' }
  ];

  const sessionTypes = [
    { value: 'career-guidance', label: 'Career Guidance' },
    { value: 'academic-planning', label: 'Academic Planning' },
    { value: 'skill-development', label: 'Skill Development' },
    { value: 'interview-prep', label: 'Interview Preparation' }
  ];

  useEffect(() => {
    fetchCounselors();
    fetchBlogPosts();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await axios.get('/counselors');
      setCounselors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching counselors:', error);
      setCounselors([]); // Ensure it's always an array
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get('/blog');
      setBlogPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]); // Ensure it's always an array
    }
  };

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

  const handleAnswer = (option) => {
    const newAnswers = {
      ...answers,
      [currentQuestion]: option
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    const categoryScores = {
      technology: 0,
      healthcare: 0,
      creative: 0,
      business: 0
    };

    Object.values(finalAnswers).forEach(answer => {
      categoryScores[answer.category] += answer.value;
    });

    const topCategory = Object.keys(categoryScores).reduce((a, b) => 
      categoryScores[a] > categoryScores[b] ? a : b
    );

    const resultData = {
      topCategory,
      scores: categoryScores,
      recommendations: careerRecommendations[topCategory],
      totalQuestions: questions.length
    };

    setResults(resultData);
    setShowResults(true);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a session');
      setShowAuthModal(true);
      return;
    }

    try {
      await axios.post('/appointments', {
        counselorId: selectedCounselor,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        type: bookingForm.type,
        notes: bookingForm.notes
      });

      toast.success('Session booked successfully!');
      setBookingForm({
        date: '',
        timeSlot: { start: '', end: '' },
        type: 'career-guidance',
        notes: ''
      });
      setSelectedCounselor('');
    } catch (error) {
      toast.error('Failed to book session');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('/contact', contactForm);
      toast.success('Message sent successfully!');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Assessment', id: 'assessment' },
    { name: 'Book Session', id: 'booking' },
    { name: 'Blog', id: 'blog' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  CareerGuide
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-primary-600 bg-primary-50 shadow-soft'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
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
                  <div className="flex items-center space-x-2 text-gray-700">
                    <UserCircleIcon className="h-6 w-6" />
                    <span>{user.name}</span>
                  </div>
                  <button onClick={logout} className="btn-secondary">
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
                    className="text-gray-700 hover:text-primary-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="btn-primary"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary-600"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
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
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium w-full text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t pt-4">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-gray-700">Welcome, {user.name}</div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium w-full text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('register');
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium w-full text-left"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Home Section */}
      <section id="home" className="relative bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-800 text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary-500/20 text-primary-200 text-sm font-medium rounded-full border border-primary-400/30 backdrop-blur-sm">
                🎯 Professional Career Guidance
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-secondary-200 leading-relaxed">
              Transform your future with personalized career guidance, comprehensive assessments, and expert counseling designed for ambitious professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={() => scrollToSection('assessment')}
                className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-large hover:shadow-xl"
              >
                <span className="flex items-center">
                  Start Assessment
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button
                onClick={() => scrollToSection('booking')}
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-secondary-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Book Consultation
              </button>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-300 mb-2">10K+</div>
                <div className="text-secondary-300 text-sm uppercase tracking-wide">Students Guided</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-300 mb-2">95%</div>
                <div className="text-secondary-300 text-sm uppercase tracking-wide">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-300 mb-2">50+</div>
                <div className="text-secondary-300 text-sm uppercase tracking-wide">Expert Counselors</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-400/20 rounded-full blur-xl animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-400/20 rounded-full blur-xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-secondary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                Why Choose CareerGuide
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
              Empowering Your
              <span className="block text-primary-600">Professional Journey</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-4xl mx-auto leading-relaxed">
              We're dedicated to transforming careers through data-driven insights, expert guidance, and personalized strategies that unlock your true potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Smart Assessment</h3>
              <p className="text-secondary-600 leading-relaxed">
                AI-powered personality and skills assessment that provides deep insights into your ideal career trajectory and growth opportunities.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 text-white rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Expert Mentorship</h3>
              <p className="text-secondary-600 leading-relaxed">
                Connect with industry-leading career counselors who provide personalized guidance, strategic planning, and ongoing support.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                <ChartBarIcon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Progress Analytics</h3>
              <p className="text-secondary-600 leading-relaxed">
                Advanced tracking and analytics to monitor your career development with detailed insights and milestone achievements.
              </p>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-20 text-center">
            <p className="text-secondary-500 text-sm uppercase tracking-wide font-semibold mb-8">Trusted by leading institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="px-6 py-3 bg-secondary-100 rounded-lg text-secondary-600 font-semibold">Harvard University</div>
              <div className="px-6 py-3 bg-secondary-100 rounded-lg text-secondary-600 font-semibold">MIT</div>
              <div className="px-6 py-3 bg-secondary-100 rounded-lg text-secondary-600 font-semibold">Stanford</div>
              <div className="px-6 py-3 bg-secondary-100 rounded-lg text-secondary-600 font-semibold">IIT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive career guidance services designed to help you discover, plan, and achieve your career goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Career Assessment</h3>
              <p className="text-gray-600 mb-4">Comprehensive personality and skills assessment to identify your ideal career path.</p>
              <div className="text-3xl font-bold text-primary-600 mb-4">Free</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Personality analysis
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Skills evaluation
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Career matching
                </li>
              </ul>
              <button
                onClick={() => scrollToSection('assessment')}
                className="w-full btn-primary"
              >
                Take Assessment
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">One-on-One Counseling</h3>
              <p className="text-gray-600 mb-4">Personal sessions with certified career counselors for detailed guidance.</p>
              <div className="text-3xl font-bold text-primary-600 mb-4">$50/session</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  60-minute sessions
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Personalized advice
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Career planning
                </li>
              </ul>
              <button
                onClick={() => scrollToSection('booking')}
                className="w-full btn-primary"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Section */}
      <section id="assessment" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Career Assessment</h2>
            <p className="text-xl text-gray-600">
              Discover your ideal career path through our comprehensive assessment
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {!showResults ? (
              <div>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Career Assessment</h3>
                    <span className="text-sm text-gray-500">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-6">
                    {questions[currentQuestion].question}
                  </h4>
                  
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="w-full text-left p-4 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Your Career Assessment Results
                  </h3>
                  <p className="text-lg text-gray-600">
                    Based on your responses, here are your personalized career recommendations
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">
                      Your Top Career Category: {results.topCategory.charAt(0).toUpperCase() + results.topCategory.slice(1)}
                    </h4>
                    
                    <div className="space-y-3">
                      {Object.entries(results.scores).map(([category, score]) => (
                        <div key={category} className="flex items-center">
                          <span className="w-20 text-sm font-medium text-gray-700 capitalize">
                            {category}:
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-3 ml-3">
                            <div
                              className="bg-primary-600 h-3 rounded-full"
                              style={{ width: `${(score / (questions.length * 4)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm text-gray-600">{score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">
                      Recommended Careers
                    </h4>
                    <ul className="space-y-2">
                      {results.recommendations.map((career, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                          {career}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 text-center space-x-4">
                  <button
                    onClick={resetAssessment}
                    className="btn-secondary"
                  >
                    Retake Assessment
                  </button>
                  <button
                    onClick={() => scrollToSection('booking')}
                    className="btn-primary"
                  >
                    Book Counseling Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Book a Counseling Session</h2>
            <p className="text-xl text-gray-600">
              Schedule a one-on-one session with our expert career counselors
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Counselor
                </label>
                <select
                  value={selectedCounselor}
                  onChange={(e) => setSelectedCounselor(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Choose a counselor...</option>
                  {Array.isArray(counselors) && counselors.map((counselor) => (
                    <option key={counselor.id} value={counselor.id}>
                      {counselor.name} - {counselor.profile?.specialization || 'General Counseling'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type
                </label>
                <select
                  value={bookingForm.type}
                  onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value })}
                  className="input-field"
                  required
                >
                  {sessionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, timeSlot: slot })}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        bookingForm.timeSlot.start === slot.start
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      {slot.start} - {slot.end}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Any specific topics you'd like to discuss..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn-primary px-8"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Career Resources & Blog</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover valuable insights, tips, and guidance to help you navigate your career journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(blogPosts) && blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.category}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our services? We're here to help you on your career journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="input-field"
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
                    className="input-field"
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
                    className="input-field"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">support@careerguide.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-600 rounded-lg p-8 text-white">
                <h4 className="text-xl font-bold mb-4">Office Hours</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h3 className="text-2xl font-bold mb-4">CareerGuide</h3>
              <p className="text-gray-400 mb-4">
                Empowering students to discover their perfect career path through expert guidance and comprehensive assessments.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('assessment')} className="hover:text-white">Career Assessment</button></li>
                <li><button onClick={() => scrollToSection('booking')} className="hover:text-white">Counseling Sessions</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white">Career Services</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-white">Resources</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white">Contact</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-white">Blog</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button type="button" className="hover:text-white text-left">Help Center</button></li>
                <li><button type="button" className="hover:text-white text-left">Privacy Policy</button></li>
                <li><button type="button" className="hover:text-white text-left">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareerGuide. All rights reserved.</p>
            <p className="mt-2 text-sm">Developed by <span className="text-primary-400 font-semibold">MONIKA M</span></p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    I am a
                  </label>
                  <select
                    value={authForm.role}
                    onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
                    className="input-field"
                  >
                    <option value="student">Student</option>
                    <option value="counselor">Career Counselor</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-primary-600 hover:text-primary-700"
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