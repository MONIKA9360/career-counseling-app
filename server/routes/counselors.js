const express = require('express');
const { getUsers } = require('../utils/netlifyStorage');

const router = express.Router();

// Get all counselors
router.get('/', async (req, res) => {
  try {
    const users = getUsers();
    const counselors = users
      .filter(user => user.role === 'counselor' && user.isActive)
      .map(({ password, ...counselor }) => counselor); // Remove password field
    
    res.json(counselors);
  } catch (error) {
    console.error('Get counselors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;