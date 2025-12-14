const express = require('express');
const router = express.Router();

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Tech Careers in 2024",
    excerpt: "Explore the most in-demand technology careers and what skills you need to succeed.",
    content: "Technology continues to evolve rapidly...",
    author: "Dr. Sarah Johnson",
    publishedAt: "2024-01-15",
    category: "Technology"
  },
  {
    id: 2,
    title: "How to Ace Your First Job Interview",
    excerpt: "Essential tips and strategies for making a great first impression.",
    content: "Job interviews can be nerve-wracking...",
    author: "Michael Chen",
    publishedAt: "2024-01-10",
    category: "Career Tips"
  }
];

// Get all blog posts
router.get('/', (req, res) => {
  res.json(blogPosts);
});

// Get single blog post
router.get('/:id', (req, res) => {
  const post = blogPosts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
});

module.exports = router;