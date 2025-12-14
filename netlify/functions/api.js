const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

// Import routes
const authRoutes = require('../../server/routes/auth');
const userRoutes = require('../../server/routes/users');
const assessmentRoutes = require('../../server/routes/assessments');
const appointmentRoutes = require('../../server/routes/appointments');
const counselorRoutes = require('../../server/routes/counselors');
const blogRoutes = require('../../server/routes/blog');
const contactRoutes = require('../../server/routes/contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'CareerGuide API is running on Netlify Functions!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports.handler = serverless(app);