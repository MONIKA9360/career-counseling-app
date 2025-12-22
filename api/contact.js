const { body, validationResult } = require('express-validator');
const { sendContactNotification, sendContactConfirmation } = require('../server/utils/emailService');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Manual validation since we can't use middleware in Vercel functions
    const { name, email, message } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ errors: [{ msg: 'Name is required' }] });
    }
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ errors: [{ msg: 'Valid email is required' }] });
    }
    
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ errors: [{ msg: 'Message must be at least 10 characters' }] });
    }
    
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
};