import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About CareerGuide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're dedicated to helping college students discover their perfect career path through expert guidance, comprehensive assessments, and personalized counseling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At CareerGuide, we believe every student deserves access to quality career counseling and guidance. Our platform combines cutting-edge assessment tools with expert human insight to provide personalized career recommendations.
            </p>
            <p className="text-gray-600">
              We're committed to bridging the gap between academic learning and professional success, helping students make informed decisions about their future careers.
            </p>
          </div>
          <div className="bg-primary-100 rounded-lg p-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading platform that empowers students worldwide to discover and pursue fulfilling careers.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600">
              Our assessments are based on proven psychological frameworks and industry research.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Counselors</h3>
            <p className="text-gray-600">
              Work with certified career counselors who have years of experience in various industries.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Approach</h3>
            <p className="text-gray-600">
              Every recommendation is tailored to your unique skills, interests, and career goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;