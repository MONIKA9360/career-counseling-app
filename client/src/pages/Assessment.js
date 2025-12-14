import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    },
    {
      id: 4,
      question: "How do you prefer to communicate?",
      options: [
        { text: "Through presentations and meetings", value: 4, category: "business" },
        { text: "One-on-one conversations", value: 3, category: "healthcare" },
        { text: "Visual and creative mediums", value: 4, category: "creative" },
        { text: "Written documentation and reports", value: 3, category: "technology" }
      ]
    },
    {
      id: 5,
      question: "What type of challenges excite you?",
      options: [
        { text: "Technical and analytical problems", value: 4, category: "technology" },
        { text: "Interpersonal and emotional challenges", value: 4, category: "healthcare" },
        { text: "Artistic and design challenges", value: 4, category: "creative" },
        { text: "Strategic and business challenges", value: 4, category: "business" }
      ]
    }
  ];

  const careerRecommendations = {
    technology: [
      "Software Developer",
      "Data Scientist",
      "Cybersecurity Analyst",
      "AI/ML Engineer",
      "Systems Administrator"
    ],
    healthcare: [
      "Clinical Psychologist",
      "Nurse Practitioner",
      "Physical Therapist",
      "Healthcare Administrator",
      "Medical Social Worker"
    ],
    creative: [
      "UX/UI Designer",
      "Graphic Designer",
      "Content Creator",
      "Marketing Specialist",
      "Art Director"
    ],
    business: [
      "Business Analyst",
      "Project Manager",
      "Management Consultant",
      "Sales Manager",
      "Operations Manager"
    ]
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to take the assessment
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your Career Assessment Results
              </h1>
              <p className="text-lg text-gray-600">
                Based on your responses, here are your personalized career recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Top Career Category: {results.topCategory.charAt(0).toUpperCase() + results.topCategory.slice(1)}
                </h3>
                
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Recommended Careers
                </h3>
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
                onClick={() => navigate('/book-session')}
                className="btn-primary"
              >
                Book Counseling Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Career Assessment</h1>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {questions[currentQuestion].question}
            </h2>
            
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
      </div>
    </div>
  );
};

export default Assessment;