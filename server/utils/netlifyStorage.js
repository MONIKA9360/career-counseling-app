// Netlify Functions have limited file system access
// We'll use environment variables and in-memory storage for demo purposes
// In production, you'd want to use a database like MongoDB Atlas or Supabase

let users = [
  {
    "id": "counselor1",
    "name": "Dr. Sarah Johnson",
    "email": "sarah.johnson@careerguide.com",
    "password": "$2a$10$example.hash.for.password123",
    "role": "counselor",
    "profile": {
      "specialization": "Technology Careers",
      "experience": "10+ years",
      "bio": "Specialized in guiding students towards successful technology careers"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "counselor2",
    "name": "Dr. Michael Chen",
    "email": "michael.chen@careerguide.com",
    "password": "$2a$10$example.hash.for.password123",
    "role": "counselor",
    "profile": {
      "specialization": "Business & Management",
      "experience": "8+ years",
      "bio": "Expert in business strategy and management career paths"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "counselor3",
    "name": "Dr. Emily Davis",
    "email": "emily.davis@careerguide.com",
    "password": "$2a$10$example.hash.for.password123",
    "role": "counselor",
    "profile": {
      "specialization": "Healthcare & Psychology",
      "experience": "12+ years",
      "bio": "Helping students find their path in healthcare and psychology fields"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
];

let appointments = [];
let assessments = [];
let blogPosts = [
  {
    "id": 1,
    "title": "Top 10 Tech Careers in 2024",
    "excerpt": "Explore the most in-demand technology careers and what skills you need to succeed.",
    "content": "Technology continues to evolve rapidly, creating new opportunities for career growth...",
    "author": "Dr. Sarah Johnson",
    "publishedAt": "2024-01-15",
    "category": "Technology"
  },
  {
    "id": 2,
    "title": "How to Ace Your First Job Interview",
    "excerpt": "Essential tips and strategies for making a great first impression.",
    "content": "Job interviews can be nerve-wracking, but with proper preparation...",
    "author": "Dr. Michael Chen",
    "publishedAt": "2024-01-10",
    "category": "Career Tips"
  },
  {
    "id": 3,
    "title": "Healthcare Career Opportunities",
    "excerpt": "Discover the diverse career paths available in the healthcare industry.",
    "content": "The healthcare industry offers numerous rewarding career opportunities...",
    "author": "Dr. Emily Davis",
    "publishedAt": "2024-01-05",
    "category": "Healthcare"
  }
];

// User operations
const getUsers = () => users;
const saveUsers = (newUsers) => { users = newUsers; };

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  return users.find(user => user.id === id);
};

const createUser = (userData) => {
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};

const updateUser = (id, updateData) => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return users[userIndex];
  }
  return null;
};

// Assessment operations
const getAssessments = () => assessments;
const saveAssessments = (newAssessments) => { assessments = newAssessments; };

// Appointment operations
const getAppointments = () => appointments;
const saveAppointments = (newAppointments) => { appointments = newAppointments; };

const createAppointment = (appointmentData) => {
  const newAppointment = {
    id: Date.now().toString(),
    ...appointmentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  appointments.push(newAppointment);
  return newAppointment;
};

// Blog operations
const getBlogPosts = () => blogPosts;
const saveBlogPosts = (newPosts) => { blogPosts = newPosts; };

module.exports = {
  // Users
  getUsers,
  saveUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  
  // Assessments
  getAssessments,
  saveAssessments,
  
  // Appointments
  getAppointments,
  saveAppointments,
  createAppointment,
  
  // Blog
  getBlogPosts,
  saveBlogPosts
};