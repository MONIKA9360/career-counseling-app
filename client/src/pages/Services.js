import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      title: 'Career Assessment',
      description: 'Comprehensive personality and skills assessment to identify your ideal career path.',
      features: ['Personality analysis', 'Skills evaluation', 'Interest mapping', 'Career matching'],
      price: 'Free',
      cta: 'Take Assessment',
      link: '/assessment'
    },
    {
      title: 'One-on-One Counseling',
      description: 'Personal sessions with certified career counselors for detailed guidance.',
      features: ['60-minute sessions', 'Personalized advice', 'Career planning', 'Goal setting'],
      price: '$50/session',
      cta: 'Book Session',
      link: '/book-session'
    },
    {
      title: 'Resume Review',
      description: 'Professional review and optimization of your resume for better job prospects.',
      features: ['Content review', 'Format optimization', 'ATS compatibility', 'Industry insights'],
      price: '$25',
      cta: 'Coming Soon',
      link: '#'
    },
    {
      title: 'Interview Preparation',
      description: 'Mock interviews and coaching to help you ace your job interviews.',
      features: ['Mock interviews', 'Feedback sessions', 'Industry-specific prep', 'Confidence building'],
      price: '$40/session',
      cta: 'Coming Soon',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive career guidance services designed to help you discover, plan, and achieve your career goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-3xl font-bold text-primary-600 mb-4">{service.price}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={service.link}
                className={`w-full btn-primary text-center block ${
                  service.cta === 'Coming Soon' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {service.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need Custom Guidance?</h2>
          <p className="text-xl mb-6">
            Contact us for personalized career counseling packages tailored to your specific needs.
          </p>
          <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;