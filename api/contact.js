const nodemailer = require('nodemailer');

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
    const { name, email, message, subject } = req.body;
    
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
    console.log('Contact form submission:', { name, email, message, subject });
    
    // Check if email credentials are available
    const emailUser = process.env.EMAIL_USER || 'monika936000@gmail.com';
    const emailPass = process.env.EMAIL_PASS || 'ijla tufw ouvr';
    
    if (emailPass && emailPass !== 'your_app_password') {
      try {
        // Create transporter
        const transporter = nodemailer.createTransporter({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: emailUser,
            pass: emailPass
          }
        });

        // Send notification email to admin
        await transporter.sendMail({
          from: emailUser,
          to: emailUser,
          subject: `New Contact Form Submission - ${subject || 'Career Counseling'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Contact Details:</h3>
                
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af;">
                  <strong>📧 Reply to:</strong> ${email}
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #6b7280; font-size: 14px; text-align: center;">
                This email was sent from the Career Counseling App contact form.<br>
                Submitted on: ${new Date().toLocaleString()}
              </p>
            </div>
          `
        });

        // Send confirmation email to user
        await transporter.sendMail({
          from: emailUser,
          to: email,
          subject: `Thank you for contacting CareerGuide - We'll be in touch soon!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">Thank You, ${name}!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your message</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  Thank you for reaching out to CareerGuide! We have successfully received your message and our team will review it shortly.
                </p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #374151; margin-top: 0;">Your Message Summary:</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
                  <p><strong>Message:</strong></p>
                  <div style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
                  <ul style="color: #374151; line-height: 1.6;">
                    <li>Our team will review your message within 24 hours</li>
                    <li>We'll respond to your inquiry at ${email}</li>
                    <li>For urgent matters, you can also reach us through our website</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #6b7280; margin-bottom: 15px;">Follow us for career tips and updates:</p>
                  <div style="display: inline-block;">
                    <a href="https://career-counseling-app.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
                  </div>
                </div>
              </div>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  This is an automated confirmation email from CareerGuide.<br>
                  Please do not reply to this email. For support, use our contact form.
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                  Sent on: ${new Date().toLocaleString()}
                </p>
              </div>
            </div>
          `
        });

        console.log('Emails sent successfully');
        
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
    } else {
      // No email credentials, just return success
      res.json({ 
        message: 'Thank you for your message! We will get back to you soon.',
        success: true,
        debug: 'API is working - email functionality will be enabled once environment variables are set in Vercel'
      });
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};