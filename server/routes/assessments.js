const express = require('express');
const { getAssessments, findUserById, updateUser } = require('../utils/vercelStorage');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all assessments
router.get('/', async (req, res) => {
  try {
    // Return mock assessment data since we're not using database
    const mockAssessment = {
      id: '1',
      title: 'Career Interest Assessment',
      description: 'Discover your ideal career path through this comprehensive assessment',
      isActive: true,
      createdBy: { name: 'System' }
    };
    
    res.json([mockAssessment]);
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit assessment results
router.post('/submit', auth, async (req, res) => {
  try {
    const { assessmentId, answers, results } = req.body;
    
    // Get user and update with assessment results
    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const assessmentResult = {
      assessmentId,
      score: results.totalScore || 0,
      recommendations: results.recommendations || [],
      completedAt: new Date().toISOString()
    };

    const updatedAssessmentResults = [...(user.assessmentResults || []), assessmentResult];
    
    updateUser(req.user.userId, {
      assessmentResults: updatedAssessmentResults
    });
    
    res.json({ message: 'Assessment results saved successfully', results });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;