const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendContactNotification, sendContactConfirmation } = require('../utils/emailService');

const router = express.Router();

// Submit contact form
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;
    
    // Log the submission
    console.log('Contact form submission:', { name, email, message });
    
    try {
      // Send notification email to admin
      await sendContactNotification({ name, email, message });
      console.log('Admin notification email sent successfully');
      
      // Send confirmation email to user
      await sendContactConfirmation({ name, email, message });
      console.log('User confirmation email sent successfully');
      
      res.json({ 
        message: 'Thank you for your message! We have sent you a confirmation email and will get back to you soon.',
        success: true 
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Still return success to user, but log the email error
      res.json({ 
        message: 'Thank you for your message. We will get back to you soon!',
        success: true,
        emailStatus: 'Email notification may be delayed'
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;