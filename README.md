# 🎯 CareerPath Pro - Professional Career Counseling Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An advanced, full-stack career counseling platform designed to help college students discover their ideal career paths through AI-powered assessments, expert counselor sessions, and comprehensive career guidance resources. Built with modern technologies and perfect for final year projects, portfolios, and real-world deployment.

## 🌟 Live Demo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## ✨ Key Features

### 🎓 For Students
- **Interactive Career Assessment** - Discover your ideal career path through comprehensive personality and skills evaluation
- **Smart Recommendations** - Get personalized career suggestions based on your assessment results
- **Session Booking** - Schedule one-on-one counseling sessions with expert career counselors
- **Progress Tracking** - Monitor your career development journey with detailed analytics
- **Resource Library** - Access curated career guidance materials and blog posts

### 👨‍🏫 For Counselors
- **Appointment Management** - Manage student sessions and availability
- **Student Progress** - Track student development and assessment results
- **Session Notes** - Maintain detailed records of counseling sessions

### 🔧 For Administrators
- **User Management** - Manage students, counselors, and system users
- **Analytics Dashboard** - View platform usage and success metrics
- **Content Management** - Manage blog posts and resources

## 🛠️ Tech Stack

### Frontend
- **React.js 18.2.0** - Modern UI library with hooks
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **React Router 6.8.1** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Storage
- **File-based JSON storage** - No database setup required
- **Persistent data** - Data survives server restarts
- **Easy deployment** - No external database dependencies

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MONIKA9360/career-counseling-app.git
   cd career-counseling-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
careerpath-pro/
├── 📁 client/                    # React frontend application
│   ├── 📁 public/               # Static files
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable React components
│   │   ├── 📁 contexts/         # React context providers
│   │   ├── 📁 pages/           # Page components (Single-page layout)
│   │   └── 📄 App.js           # Main App component
│   ├── 📄 package.json
│   └── 📄 tailwind.config.js
├── 📁 server/                   # Node.js backend application
│   ├── 📁 data/                # JSON data storage
│   ├── 📁 middleware/          # Express middleware
│   ├── 📁 routes/              # API route handlers
│   ├── 📁 utils/               # Utility functions
│   ├── 📄 index.js             # Server entry point
│   └── 📄 package.json
├── 📁 netlify/                  # Netlify Functions for serverless deployment
│   └── 📁 functions/           # Serverless API functions
├── 📄 README.md
├── 📄 DEPLOYMENT.md            # Deployment guide
├── 📄 FEATURES.md              # Detailed features list
└── 📄 package.json             # Root package.json
```

## 🎯 Core Functionality

### User Authentication
- Secure registration and login
- JWT-based authentication
- Role-based access control (Student/Counselor/Admin)
- Password encryption with bcrypt

### Career Assessment System
- Interactive personality quiz
- Skills and interests evaluation
- Intelligent career matching algorithm
- Personalized recommendations
- Progress tracking and history

### Appointment Booking
- Browse available counselors
- Real-time availability checking
- Multiple session types
- Email confirmations
- Session management

### Dashboard Analytics
- User activity tracking
- Assessment completion rates
- Booking statistics
- Progress visualization

## 🎨 UI/UX Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern Interface** - Clean, professional design with Tailwind CSS
- **Intuitive Navigation** - Easy-to-use interface for all user types
- **Accessibility** - WCAG compliant design
- **Fast Loading** - Optimized performance and loading times

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Secure API endpoints
- Role-based access control

## 📊 Sample Data

The application comes with pre-loaded sample data:

### Sample Counselors
- **Dr. Sarah Johnson** - Technology Careers Specialist
- **Dr. Michael Chen** - Business & Management Expert
- **Dr. Emily Davis** - Healthcare & Psychology Counselor

### Sample Blog Posts
- Career guidance articles
- Industry insights
- Interview preparation tips

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Starts both frontend and backend
```

### Production Deployment

#### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy build folder
```

#### Backend (Railway/Render/Heroku)
```bash
cd server
npm start
# Set environment variables in hosting platform
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📈 Perfect For

- **Final Year Projects** - Comprehensive full-stack application
- **Portfolio Showcase** - Demonstrates modern web development skills
- **Learning Purpose** - Great for understanding React + Node.js architecture
- **Startup MVP** - Ready-to-deploy career counseling platform
- **Hackathons** - Feature-rich application for competitions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Express.js for the robust backend framework
- All open-source contributors

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact me directly.

---

⭐ **Star this repository if you found it helpful!** ⭐