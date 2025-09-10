# Artgram Fullstack Application - Docker Deployment Guide

This guide will help you deploy your React + Node.js fullstack application using a single Docker container.

## 🏗️ Architecture

- **Frontend**: React with Vite, built as static files
- **Backend**: Node.js/Express serving API routes and static files
- **Database**: MongoDB (external)
- **Port**: 10000 (Render's preferred port)

## 📋 Prerequisites

- Docker installed on your machine
- MongoDB database (local or cloud like MongoDB Atlas)
- Git repository access

## 🐳 Local Testing with Docker

### 1. Build the Docker Image

```bash
# Navigate to your project directory
cd /path/to/your/project

# Build the Docker image
docker build -t artgram-app .
```

### 2. Create Local Environment File

Create a `.env.local` file in your project root:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:10000
```

### 3. Run the Container Locally

```bash
# Run the container
docker run -p 10000:10000 --env-file .env.local artgram-app

# Or run with individual environment variables
docker run -p 10000:10000 \
  -e NODE_ENV=production \
  -e MONGO_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e PORT=10000 \
  artgram-app
```

### 4. Test the Application

- Open your browser and go to `http://localhost:10000`
- Test API endpoints: `http://localhost:10000/api/health`
- Verify that both frontend and backend are working

## 🚀 Deploy to Render

### Step 1: Prepare Your Repository

1. **Commit all changes to Git:**
   ```bash
   git add .
   git commit -m "Add Docker configuration for production deployment"
   git push origin main
   ```

2. **Ensure your repository is pushed to GitHub/GitLab/Bitbucket**

### Step 2: Create Render Web Service

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your repository:**
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Choose your repository
   - Select the branch (usually `main`)

### Step 3: Configure the Web Service

Fill in the following settings:

**Basic Information:**
- **Name**: `artgram-app` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (uses project root)

**Build & Deploy Settings:**
- **Environment**: `Docker`
- **Build Command**: Leave empty (Docker will handle this)
- **Start Command**: Leave empty (uses Dockerfile CMD)

**Instance Type:**
- Choose based on your needs (Free tier available)

### Step 4: Set Environment Variables

In the "Environment" section, add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `JWT_SECRET` | `your-secure-secret` | Generate a secure random string |
| `PORT` | `10000` | Render will set this automatically, but good to specify |
| `FRONTEND_URL` | `https://your-app-name.onrender.com` | Optional, will be your Render URL |

**🔒 Security Note**: Never commit real environment variables to Git. Use Render's environment variable settings.

### Step 5: Deploy

1. **Click "Create Web Service"**
2. **Wait for the build and deployment** (usually 5-10 minutes)
3. **Monitor the logs** in the Render dashboard

### Step 6: Configure Domain (Optional)

1. **Custom Domain**: Add your own domain in the "Settings" tab
2. **HTTPS**: Render automatically provides SSL certificates

## 🔧 Troubleshooting

### Common Build Issues

**Issue: Frontend build fails**
```
Solution: Check if all dependencies are listed in package.json
```

**Issue: Backend TypeScript compilation fails**
```
Solution: Ensure server/tsconfig.json is properly configured
```

**Issue: Environment variables not working**
```
Solution: Double-check variable names in Render dashboard
```

### Common Runtime Issues

**Issue: 404 errors for routes**
```
Solution: Ensure React Router routes are handled by the catch-all route
```

**Issue: API calls failing**
```
Solution: Check CORS settings and environment variables
```

**Issue: Database connection fails**
```
Solution: Verify MONGO_URI and MongoDB Atlas network access
```

### Debugging Commands

```bash
# Check container logs locally
docker logs container_id

# Execute commands inside running container
docker exec -it container_id /bin/sh

# Check if app is responding
curl http://localhost:10000/api/health
```

## 📊 Monitoring

### Health Checks

The application includes:
- **Health endpoint**: `/api/health`
- **Docker health check**: Built into the container
- **Render monitoring**: Available in dashboard

### Logs

- **Render logs**: Available in the web service dashboard
- **Application logs**: Morgan middleware logs all requests

## 🔄 Updates and Deployments

### Automatic Deployments

Render automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

### Manual Deployments

In the Render dashboard:
1. Go to your web service
2. Click "Manual Deploy" → "Deploy latest commit"

## 📋 Checklist for Production

- [ ] Environment variables set correctly
- [ ] MongoDB accessible from Render
- [ ] JWT secret is secure and unique
- [ ] CORS settings configured for production domain
- [ ] Static files being served correctly
- [ ] API routes working
- [ ] React Router working for SPA routing
- [ ] HTTPS enabled (automatic with Render)

## 🆘 Need Help?

1. **Check Render logs** for specific error messages
2. **Test locally first** using Docker
3. **Verify environment variables** are set correctly
4. **Check database connectivity** from your local environment

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Happy Deploying! 🚀**
