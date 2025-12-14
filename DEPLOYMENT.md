# Deployment Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

## Local Development Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd career-counseling-app
   npm run install-deps
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment file
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration:
   # - MongoDB connection string
   # - JWT secret key
   # - Email configuration (optional)
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend API on http://localhost:5000
   - Frontend React app on http://localhost:3000

## Production Deployment

### Backend Deployment (Railway/Render)

1. **Railway Deployment**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Environment Variables**
   Set these in your Railway/Render dashboard:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=your_frontend_url
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Vercel Deployment**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy from client directory
   cd client
   vercel --prod
   ```

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Database Setup

1. **MongoDB Atlas (Recommended)**
   - Create account at mongodb.com/atlas
   - Create new cluster
   - Get connection string
   - Add to environment variables

2. **Local MongoDB**
   ```bash
   # Install MongoDB locally
   # Start MongoDB service
   mongod
   ```

## Environment Variables Reference

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/career_counseling
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

### Frontend (Optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Assessment functionality works
- [ ] Database connections are stable
- [ ] Email notifications work (if configured)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CLIENT_URL is set correctly in backend
   - Check cors configuration in server/index.js

2. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check network access in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify all dependencies are listed in package.json

### Performance Optimization

1. **Frontend**
   - Enable gzip compression
   - Optimize images
   - Implement code splitting
   - Add service worker for caching

2. **Backend**
   - Add database indexing
   - Implement API rate limiting
   - Add response caching
   - Optimize database queries

## Monitoring and Maintenance

1. **Logging**
   - Implement structured logging
   - Set up error tracking (Sentry)
   - Monitor API performance

2. **Backups**
   - Regular database backups
   - Code repository backups
   - Environment configuration backups

3. **Updates**
   - Regular dependency updates
   - Security patches
   - Feature deployments