#!/usr/bin/env pwsh
# Script backup dữ liệu từ MongoDB local sang thư mục mongo-backup
# Dùng để chuẩn bị data trước khi đóng gói Docker

Write-Host "📦 Bắt đầu backup dữ liệu từ MongoDB local..." -ForegroundColor Cyan

$BACKUP_DIR = "$PSScriptRoot\Backend\mongo-backup"
$DB_NAME = "nha-cho-sinh-vien"
$MONGO_URI = "mongodb://localhost:27017/$DB_NAME"

# Tạo thư mục backup nếu chưa có
if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR -Force | Out-Null
    Write-Host "✓ Tạo thư mục backup: $BACKUP_DIR" -ForegroundColor Green
}

# Danh sách collections cần backup
$collections = @("users", "posts", "comments", "messages", "conversations", "reports", "warnings", "auditlogs")

Write-Host "`n📋 Backup các collections..." -ForegroundColor Yellow

$totalDocs = 0
foreach ($collection in $collections) {
    $outputFile = "$BACKUP_DIR\$collection.json"
    
    Write-Host "  → Backup $collection..." -NoNewline
    
    try {
        # Sử dụng mongoexport để export data
        $result = mongoexport --uri="$MONGO_URI" --collection=$collection --out="$outputFile" --jsonArray 2>&1
        
        if (Test-Path $outputFile) {
            $content = Get-Content $outputFile -Raw
            $docs = ($content | ConvertFrom-Json).Count
            $totalDocs += $docs
            Write-Host " ✓ ($docs documents)" -ForegroundColor Green
        } else {
            Write-Host " ⚠ (0 documents)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host " ✗ Lỗi: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n✅ Backup hoàn tất!" -ForegroundColor Green
Write-Host "📊 Tổng cộng: $totalDocs documents" -ForegroundColor Cyan
Write-Host "📁 Thư mục backup: $BACKUP_DIR" -ForegroundColor Cyan

# Hiển thị danh sách files
Write-Host "`n📦 Các file backup:" -ForegroundColor Yellow
Get-ChildItem $BACKUP_DIR -Filter *.json | ForEach-Object {
    $size = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  • $($_.Name) ($size KB)" -ForegroundColor Gray
}

Write-Host "`n💡 Tiếp theo: Chạy 'docker-compose up --build -d' để khởi động với dữ liệu này" -ForegroundColor Cyan
