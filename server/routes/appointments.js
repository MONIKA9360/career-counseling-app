const express = require('express');
const { getAppointments, createAppointment, findUserById } = require('../utils/fileStorage');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user appointments
router.get('/', auth, async (req, res) => {
  try {
    const appointments = getAppointments();
    let userAppointments = [];
    
    if (req.user.role === 'student') {
      userAppointments = appointments.filter(apt => apt.student === req.user.userId);
    } else if (req.user.role === 'counselor') {
      userAppointments = appointments.filter(apt => apt.counselor === req.user.userId);
    }
    
    // Populate user data
    const populatedAppointments = userAppointments.map(apt => {
      const student = findUserById(apt.student);
      const counselor = findUserById(apt.counselor);
      
      return {
        ...apt,
        student: student ? { id: student.id, name: student.name, email: student.email } : null,
        counselor: counselor ? { id: counselor.id, name: counselor.name, email: counselor.email } : null
      };
    });
    
    res.json(populatedAppointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { counselorId, date, timeSlot, type, notes } = req.body;
    
    const appointmentData = {
      student: req.user.userId,
      counselor: counselorId,
      date,
      timeSlot,
      type,
      status: 'pending',
      notes: {
        student: notes
      }
    };
    
    const appointment = createAppointment(appointmentData);
    
    // Get counselor info for response
    const counselor = findUserById(counselorId);
    const appointmentWithCounselor = {
      ...appointment,
      counselor: counselor ? { id: counselor.id, name: counselor.name, email: counselor.email } : null
    };
    
    res.status(201).json(appointmentWithCounselor);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;