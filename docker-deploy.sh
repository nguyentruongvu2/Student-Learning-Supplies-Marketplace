#!/bin/bash

# Build and Run Docker Containers (Linux/Mac version)

echo "🐳 Starting Docker Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✓ Docker is running"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.docker..."
    cp .env.docker .env
    echo "📝 Please edit .env file and add your EMAIL_USER and EMAIL_PASSWORD"
    echo "   Then run this script again."
    exit 0
fi

echo "✓ .env file found"

# Stop and remove existing containers
echo ""
echo "🛑 Stopping existing containers..."
docker-compose down

# Build images
echo ""
echo "🔨 Building Docker images..."
docker-compose build --no-cache

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✓ Build completed successfully"

# Start containers
echo ""
echo "🚀 Starting containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start containers!"
    exit 1
fi

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🌐 Access your application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   MongoDB:   localhost:27017"

echo ""
echo "📝 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop:             docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   View containers:  docker-compose ps"

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check health
echo ""
echo "🏥 Checking service health..."

for i in {1..30}; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "✓ Backend is healthy"
        break
    fi
    echo "⏳ Waiting for backend... ($i/30)"
    sleep 2
done

for i in {1..30}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✓ Frontend is healthy"
        break
    fi
    echo "⏳ Waiting for frontend... ($i/30)"
    sleep 2
done

echo ""
echo "🎉 All services are running!"
echo "   Open http://localhost:3000 in your browser"
