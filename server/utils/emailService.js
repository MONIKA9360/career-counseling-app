const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send contact form notification to admin
const sendContactNotification = async (contactData) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to admin email
    subject: `New Contact Form Submission - Career Counseling App`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Details:</h3>
          
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
            ${contactData.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;">
            <strong>📧 Reply to:</strong> ${contactData.email}
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          This email was sent from the Career Counseling App contact form.<br>
          Submitted on: ${new Date().toLocaleString()}
        </p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// Send confirmation email to user
const sendContactConfirmation = async (contactData) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: contactData.email,
    subject: `Thank you for contacting us - Career Counseling App`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Thank You, ${contactData.name}!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your message</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for reaching out to us through our Career Counseling App. We have successfully received your message and our team will review it shortly.
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Your Message Summary:</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
              ${contactData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
            <ul style="color: #374151; line-height: 1.6;">
              <li>Our team will review your message within 24 hours</li>
              <li>We'll respond to your inquiry at ${contactData.email}</li>
              <li>For urgent matters, you can also reach us through our website</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; margin-bottom: 15px;">Follow us for career tips and updates:</p>
            <div style="display: inline-block;">
              <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
              <span style="color: #d1d5db;">|</span>
              <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              <span style="color: #d1d5db;">|</span>
              <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Twitter</a>
            </div>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            This is an automated confirmation email from Career Counseling App.<br>
            Please do not reply to this email. For support, use our contact form.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
            Sent on: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendContactNotification,
  sendContactConfirmation
};