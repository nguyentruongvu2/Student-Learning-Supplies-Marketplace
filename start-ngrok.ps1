#!/usr/bin/env pwsh
# Script tu dong chay Ngrok va cap nhat .env

param(
    [int]$Port = 3000,
    [switch]$Backend
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CHAY NGROK - TRUY CAP TU DIEN THOAI" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Kiem tra ngrok da cai dat
try {
    $ngrokVersion = ngrok version 2>$null
    Write-Host "✓ Ngrok da cai dat: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Ngrok chua duoc cai dat!" -ForegroundColor Red
    Write-Host "`nVui long cai dat ngrok:" -ForegroundColor Yellow
    Write-Host "  1. Truy cap: https://ngrok.com/download" -ForegroundColor White
    Write-Host "  2. Tai va giai nen ngrok.exe" -ForegroundColor White
    Write-Host "  3. Copy vao thu muc: $PSScriptRoot" -ForegroundColor White
    Write-Host "  4. Dang ky tai khoan: https://dashboard.ngrok.com/signup" -ForegroundColor White
    Write-Host "  5. Chay: ngrok config add-authtoken YOUR_TOKEN`n" -ForegroundColor White
    exit 1
}

# Kiem tra Docker dang chay
Write-Host "Kiem tra Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker dang chay" -ForegroundColor Green
    
    # Kiem tra container
    $frontend = docker ps --filter "name=nha-cho-frontend" --format "{{.Names}}"
    $backend = docker ps --filter "name=nha-cho-backend" --format "{{.Names}}"
    
    if ($frontend) {
        Write-Host "  ✓ Frontend container: $frontend" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Frontend container chua chay" -ForegroundColor Yellow
        Write-Host "  → Chay: docker-compose up -d" -ForegroundColor White
    }
    
    if ($backend) {
        Write-Host "  ✓ Backend container: $backend" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Backend container chua chay" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ Docker chua chay, dam bao ung dung dang chay tren port $Port" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  BAT DAU NGROK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($Backend) {
    Write-Host "Chay ngrok cho BACKEND (port 5000)..." -ForegroundColor Yellow
    Write-Host "Nhan Ctrl+C de dung`n" -ForegroundColor Gray
    Start-Sleep -Seconds 1
    ngrok http 5000
} else {
    Write-Host "Chay ngrok cho FRONTEND (port $Port)..." -ForegroundColor Yellow
    Write-Host "`nSau khi ngrok chay:" -ForegroundColor Cyan
    Write-Host "  1. Copy URL (https://xxx.ngrok-free.app)" -ForegroundColor White
    Write-Host "  2. Mo .env va cap nhat:" -ForegroundColor White
    Write-Host "     CLIENT_URL=https://xxx.ngrok-free.app" -ForegroundColor Gray
    Write-Host "  3. Chay: docker-compose restart backend" -ForegroundColor White
    Write-Host "  4. Mo URL tren dien thoai`n" -ForegroundColor White
    Write-Host "Nhan Ctrl+C de dung`n" -ForegroundColor Gray
    Start-Sleep -Seconds 2
    ngrok http $Port
}
