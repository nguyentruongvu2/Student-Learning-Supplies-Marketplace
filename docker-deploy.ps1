# Build and Run Docker Containers

Write-Host "Starting Docker Deployment..." -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "Docker is running" -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host ".env file not found. Copying from .env.docker..." -ForegroundColor Yellow
    Copy-Item ".env.docker" ".env"
    Write-Host "Please edit .env file and add your EMAIL_USER and EMAIL_PASSWORD" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host ".env file found" -ForegroundColor Green

# Stop and remove existing containers
Write-Host "" 
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>&1 | Out-Null

# Build images
Write-Host ""
Write-Host "Building Docker images..." -ForegroundColor Cyan
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully" -ForegroundColor Green

# Start containers
Write-Host ""
Write-Host "Starting containers..." -ForegroundColor Cyan
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start containers!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Container Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "Access your application:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "   MongoDB:   localhost:27017" -ForegroundColor White

Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs:        docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop:             docker-compose down" -ForegroundColor White
Write-Host "   Restart:          docker-compose restart" -ForegroundColor White

Write-Host ""
Write-Host "Waiting for services..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "All services should be running now!" -ForegroundColor Green
Write-Host "Open http://localhost:3000 in your browser" -ForegroundColor Cyan
