#!/usr/bin/env pwsh
# Script dong goi Docker hoan chinh - Simple version

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  DONG GOI DOCKER HOAN CHINH" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Kiem tra Docker
Write-Host "[1/6] Kiem tra Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
    Write-Host "      OK Docker da san sang" -ForegroundColor Green
} catch {
    Write-Host "      LOI: Docker chua duoc cai dat!" -ForegroundColor Red
    exit 1
}

# Backup du lieu
Write-Host ""
Write-Host "[2/6] Backup du lieu tu MongoDB local..." -ForegroundColor Yellow
try {
    $mongoCheck = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "      MongoDB local dang chay, bat dau backup..." -ForegroundColor Cyan
        & "$PSScriptRoot\backup-local-data.ps1"
    } else {
        Write-Host "      MongoDB local khong chay, bo qua backup" -ForegroundColor Yellow
    }
} catch {
    Write-Host "      Khong tim thay mongosh, bo qua backup" -ForegroundColor Yellow
}

# Kiem tra .env
Write-Host ""
Write-Host "[3/6] Kiem tra file .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "      Tao file .env moi..." -ForegroundColor Cyan
    @"
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=http://localhost:3000
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "      OK Da tao .env" -ForegroundColor Green
    Write-Host "      CHU Y: Cap nhat EMAIL_USER va EMAIL_PASSWORD!" -ForegroundColor Yellow
} else {
    Write-Host "      OK File .env da ton tai" -ForegroundColor Green
}

# Dung containers cu
Write-Host ""
Write-Host "[4/6] Dung containers cu..." -ForegroundColor Yellow
docker-compose down 2>$null
Write-Host "      OK Da dung containers cu" -ForegroundColor Green

# Build images
Write-Host ""
Write-Host "[5/6] Build Docker images..." -ForegroundColor Yellow
Write-Host "      Dang build (co the mat vai phut)..." -ForegroundColor Cyan
docker-compose build --no-cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "      LOI: Build that bai!" -ForegroundColor Red
    exit 1
}
Write-Host "      OK Build thanh cong!" -ForegroundColor Green

# Khoi dong services
Write-Host ""
Write-Host "[6/6] Khoi dong Docker services..." -ForegroundColor Yellow
docker-compose up -d
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

$containers = @("nha-cho-mongodb", "nha-cho-backend", "nha-cho-frontend")
foreach ($container in $containers) {
    $status = docker ps --filter "name=$container" --format "{{.Status}}"
    if ($status -match "Up") {
        Write-Host "  OK $container dang chay" -ForegroundColor Green
    } else {
        Write-Host "  LOI $container khong chay!" -ForegroundColor Red
    }
}

# Ket qua
Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  HOAN TAT!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Truy cap ung dung:" -ForegroundColor Cyan
Write-Host "  - Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "  - MongoDB:   mongodb://localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "Tai khoan mac dinh:" -ForegroundColor Cyan
Write-Host "  - Admin:    admin@example.com / admin123456" -ForegroundColor White
Write-Host "  - Student:  student1@example.com / student123456" -ForegroundColor White
Write-Host ""
Write-Host "Lenh huu ich:" -ForegroundColor Cyan
Write-Host "  - Xem logs:       docker-compose logs -f" -ForegroundColor White
Write-Host "  - Dung:           docker-compose stop" -ForegroundColor White
Write-Host "  - Khoi dong lai:  docker-compose restart" -ForegroundColor White
Write-Host ""
