# Script lấy IP LAN
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Get Your LAN IP Address" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -like "192.168.*"}).IPAddress

if ($IP) {
    Write-Host "Your IP: $IP" -ForegroundColor Green
    Write-Host ""
    Write-Host "Update these files:" -ForegroundColor Yellow
    Write-Host "  Backend\.env: FRONTEND_URL=http://${IP}:3000" -ForegroundColor White
    Write-Host "  Frontent\.env.local: REACT_APP_API_URL=http://${IP}:5000" -ForegroundColor White
    Write-Host ""
    
    # Tạo file .env.local tự động
    $frontendEnvPath = Join-Path $PSScriptRoot "Frontent\.env.local"
    "REACT_APP_API_URL=http://${IP}:5000" | Out-File -FilePath $frontendEnvPath -Encoding UTF8
    Write-Host "Created: Frontent\.env.local" -ForegroundColor Green
    
    # Suggest backend .env update
    Write-Host ""
    Write-Host "Please manually update Backend\.env with:" -ForegroundColor Yellow
    Write-Host "FRONTEND_URL=http://${IP}:3000" -ForegroundColor White
} else {
    Write-Host "Could not find LAN IP address" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
