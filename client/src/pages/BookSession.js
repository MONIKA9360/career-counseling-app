import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookSession = () => {
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: { start: '', end: '' },
    type: 'career-guidance',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const sessionTypes = [
    { value: 'career-guidance', label: 'Career Guidance' },
    { value: 'academic-planning', label: 'Academic Planning' },
    { value: 'skill-development', label: 'Skill Development' },
    { value: 'interview-prep', label: 'Interview Preparation' }
  ];

  const timeSlots = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' }
  ];

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await axios.get('/api/counselors');
      setCounselors(response.data);
    } catch (error) {
      console.error('Error fetching counselors:', error);
      toast.error('Failed to load counselors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a session');
      navigate('/login');
      return;
    }

    if (!selectedCounselor) {
      toast.error('Please select a counselor');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/appointments', {
        counselorId: selectedCounselor,
        date: formData.date,
        timeSlot: formData.timeSlot,
        type: formData.type,
        notes: formData.notes
      });

      toast.success('Session booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book session');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotChange = (slot) => {
    setFormData({
      ...formData,
      timeSlot: slot
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to book a session
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Book a Counseling Session</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Counselor Selection */}
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
                {counselors.map((counselor) => (
                  <option key={counselor._id} value={counselor._id}>
                    {counselor.name} - {counselor.profile?.specialization || 'General Counseling'}
                  </option>
                ))}
              </select>
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTimeSlotChange(slot)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.timeSlot.start === slot.start
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    {slot.start} - {slot.end}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows="4"
                placeholder="Any specific topics you'd like to discuss or questions you have..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Book Session'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookSession;