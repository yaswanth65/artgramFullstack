#!/bin/bash

# Artgram Docker Build and Test Script

echo "🏗️  Building Artgram Docker Image..."
echo "======================================"

# Build the Docker image
echo "Step 1: Building Docker image..."
docker build -t artgram-app .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
else
    echo "❌ Docker build failed. Please check the logs above."
    exit 1
fi

echo ""
echo "🧪 Testing the application..."
echo "============================"

# Create a test environment file
cat > .env.test << EOF
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb://localhost:27017/artgram-test
JWT_SECRET=test-secret-for-local-development-only
FRONTEND_URL=http://localhost:10000
EOF

echo "Step 2: Starting container..."
docker run -d -p 10000:10000 --env-file .env.test --name artgram-test artgram-app

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully!"
    echo "🌐 Application should be available at: http://localhost:10000"
    echo "🔍 API health check: http://localhost:10000/api/health"
    echo ""
    echo "To view logs: docker logs artgram-test"
    echo "To stop: docker stop artgram-test"
    echo "To remove: docker rm artgram-test"
else
    echo "❌ Container failed to start."
    exit 1
fi

echo ""
echo "🎉 Local test completed!"
echo "Now you can deploy to Render using the instructions in DEPLOYMENT.md"
