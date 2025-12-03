# View Docker Logs

param(
    [string]$Service = "all"
)

Write-Host "📋 Viewing logs for: $Service" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to exit`n" -ForegroundColor Yellow

if ($Service -eq "all") {
    docker-compose logs -f
} else {
    docker-compose logs -f $Service
}
