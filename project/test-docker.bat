@echo off
echo 🏗️  Building Artgram Docker Image...
echo ======================================

echo Step 1: Building Docker image...
docker build -t artgram-app .

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker build failed. Please check the logs above.
    pause
    exit /b 1
)

echo ✅ Docker image built successfully!

echo.
echo 🧪 Testing the application...
echo ============================

echo Step 2: Creating test environment file...
(
echo NODE_ENV=production
echo PORT=10000
echo MONGO_URI=mongodb://localhost:27017/artgram-test
echo JWT_SECRET=test-secret-for-local-development-only
echo FRONTEND_URL=http://localhost:10000
) > .env.test

echo Step 3: Starting container...
docker run -d -p 10000:10000 --env-file .env.test --name artgram-test artgram-app

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Container failed to start.
    pause
    exit /b 1
)

echo ✅ Container started successfully!
echo 🌐 Application should be available at: http://localhost:10000
echo 🔍 API health check: http://localhost:10000/api/health
echo.
echo To view logs: docker logs artgram-test
echo To stop: docker stop artgram-test
echo To remove: docker rm artgram-test
echo.
echo 🎉 Local test completed!
echo Now you can deploy to Render using the instructions in DEPLOYMENT.md
pause
