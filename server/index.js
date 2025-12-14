const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize data storage
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize data files
const initDataFiles = () => {
  const files = ['users.json', 'assessments.json', 'appointments.json', 'blog.json'];
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  });
};

initDataFiles();
console.log('File-based storage initialized successfully');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/counselors', require('./routes/counselors'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'CareerGuide API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});