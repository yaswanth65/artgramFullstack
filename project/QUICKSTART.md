# 🚀 Quick Start Guide - Docker Deployment

## For Local Testing

### Windows:
```bash
# Double-click test-docker.bat or run:
./test-docker.bat
```

### Mac/Linux:
```bash
# Make executable and run:
chmod +x test-docker.sh
./test-docker.sh
```

### Manual Commands:
```bash
# 1. Build image
docker build -t artgram-app .

# 2. Run container
docker run -p 10000:10000 \
  -e NODE_ENV=production \
  -e MONGO_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e PORT=10000 \
  artgram-app

# 3. Test
open http://localhost:10000
```

## For Render Deployment

### 1. Push to Git:
```bash
git add .
git commit -m "Add Docker deployment configuration"
git push origin main
```

### 2. Create Render Service:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Choose "Docker" environment
5. Set environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_secure_jwt_secret`
6. Click "Create Web Service"

### 3. Wait for deployment (5-10 minutes)

### 4. Access your app at: `https://your-app-name.onrender.com`

## Environment Variables Needed:

| Variable | Example | Required |
|----------|---------|----------|
| NODE_ENV | production | ✅ |
| MONGO_URI | mongodb+srv://... | ✅ |
| JWT_SECRET | your-secret-key | ✅ |
| PORT | 10000 | ⚡ (Auto-set by Render) |
| FRONTEND_URL | https://your-app.onrender.com | ❌ (Optional) |

## Need Help?
- Check `DEPLOYMENT.md` for detailed instructions
- View logs in Render dashboard
- Test locally first with Docker

**Happy deploying! 🎉**
