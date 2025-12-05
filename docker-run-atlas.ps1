#!/usr/bin/env pwsh
# Script khoi dong Docker voi MongoDB Atlas

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  KHOI DONG DOCKER VOI MONGODB ATLAS" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Kiem tra Docker
Write-Host "[1/5] Kiem tra Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
    Write-Host "      OK Docker da san sang" -ForegroundColor Green
} catch {
    Write-Host "      LOI: Docker chua duoc cai dat!" -ForegroundColor Red
    exit 1
}

# Kiem tra .env
Write-Host ""
Write-Host "[2/5] Kiem tra cau hinh .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "      LOI: Chua co file .env!" -ForegroundColor Red
    Write-Host "      Vui long tao file .env voi MONGODB_URI" -ForegroundColor Yellow
    exit 1
}

# Kiem tra MONGODB_URI
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch 'MONGODB_URI=mongodb\+srv://') {
    Write-Host "      CANH BAO: MONGODB_URI chua duoc cau hinh!" -ForegroundColor Yellow
    Write-Host "      Vui long cap nhat MONGODB_URI trong .env" -ForegroundColor Yellow
}
Write-Host "      OK File .env da ton tai" -ForegroundColor Green

# Dung containers cu
Write-Host ""
Write-Host "[3/5] Dung containers cu..." -ForegroundColor Yellow
docker-compose -f docker-compose.atlas.yml down 2>$null
# Dung ca MongoDB local neu dang chay
docker-compose down 2>$null
Write-Host "      OK Da dung containers cu" -ForegroundColor Green

# Build images
Write-Host ""
Write-Host "[4/5] Build Docker images..." -ForegroundColor Yellow
Write-Host "      Dang build (co the mat vai phut)..." -ForegroundColor Cyan
docker-compose -f docker-compose.atlas.yml build --no-cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "      LOI: Build that bai!" -ForegroundColor Red
    exit 1
}
Write-Host "      OK Build thanh cong!" -ForegroundColor Green

# Khoi dong services
Write-Host ""
Write-Host "[5/5] Khoi dong Docker services voi MongoDB Atlas..." -ForegroundColor Yellow
docker-compose -f docker-compose.atlas.yml up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "      LOI: Khoi dong that bai!" -ForegroundColor Red
    exit 1
}

Write-Host "      Doi services khoi dong..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Kiem tra
Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  KIEM TRA TRANG THAI" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$containers = @("nha-cho-backend", "nha-cho-frontend")
foreach ($container in $containers) {
    $status = docker ps --filter "name=$container" --format "{{.Status}}"
    if ($status -match "Up") {
        Write-Host "  OK $container dang chay" -ForegroundColor Green
    } else {
        Write-Host "  LOI $container khong chay!" -ForegroundColor Red
    }
}

# Test ket noi MongoDB Atlas
Write-Host ""
Write-Host "Kiem tra ket noi MongoDB Atlas..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker exec nha-cho-backend node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('OK Ket noi MongoDB Atlas thanh cong!'); process.exit(0); }).catch((e) => { console.error('LOI:', e.message); process.exit(1); });" 2>$null

# Ket qua
Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  HOAN TAT!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Truy cap ung dung:" -ForegroundColor Cyan
Write-Host "  - Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "  - MongoDB:   Atlas Cloud (tu .env)" -ForegroundColor White
Write-Host ""
Write-Host "Lenh huu ich:" -ForegroundColor Cyan
Write-Host "  - Xem logs:       docker-compose -f docker-compose.atlas.yml logs -f" -ForegroundColor White
Write-Host "  - Dung:           docker-compose -f docker-compose.atlas.yml stop" -ForegroundColor White
Write-Host "  - Khoi dong lai:  docker-compose -f docker-compose.atlas.yml restart" -ForegroundColor White
Write-Host ""
Write-Host "CHU Y: Du lieu luu tren MongoDB Atlas cloud" -ForegroundColor Yellow
Write-Host ""
