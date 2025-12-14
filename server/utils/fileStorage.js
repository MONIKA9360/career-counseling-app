const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Generic file operations
const readData = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

const writeData = (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// User operations
const getUsers = () => readData('users.json');
const saveUsers = (users) => writeData('users.json', users);

const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

const createUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

const updateUser = (id, updateData) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveUsers(users);
    return users[userIndex];
  }
  return null;
};

// Assessment operations
const getAssessments = () => readData('assessments.json');
const saveAssessments = (assessments) => writeData('assessments.json', assessments);

// Appointment operations
const getAppointments = () => readData('appointments.json');
const saveAppointments = (appointments) => writeData('appointments.json', appointments);

const createAppointment = (appointmentData) => {
  const appointments = getAppointments();
  const newAppointment = {
    id: Date.now().toString(),
    ...appointmentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  appointments.push(newAppointment);
  saveAppointments(appointments);
  return newAppointment;
};

// Blog operations
const getBlogPosts = () => readData('blog.json');
const saveBlogPosts = (posts) => writeData('blog.json', posts);

module.exports = {
  // Generic
  readData,
  writeData,
  
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