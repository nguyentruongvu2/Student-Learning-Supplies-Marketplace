# Stop and Clean Docker Containers

Write-Host "🛑 Stopping Docker containers..." -ForegroundColor Yellow

docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Containers stopped successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to stop containers" -ForegroundColor Red
    exit 1
}

$cleanup = Read-Host "`n⚠️  Do you want to remove all data (volumes)? (y/N)"

if ($cleanup -eq "y" -or $cleanup -eq "Y") {
    Write-Host "`n🗑️  Removing volumes..." -ForegroundColor Red
    docker-compose down -v
    Write-Host "✅ All data removed" -ForegroundColor Green
} else {
    Write-Host "✓ Data preserved" -ForegroundColor Green
}

Write-Host "`n📊 Remaining containers:" -ForegroundColor Cyan
docker ps -a | Select-String "nha-cho"

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
