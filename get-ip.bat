@echo off
echo ==========================================
echo   Get Your LAN IP Address
echo ==========================================
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo Your IP: !IP!
    echo.
    echo Update these files:
    echo   Backend\.env: FRONTEND_URL=http://!IP!:3000
    echo   Frontent\.env.local: REACT_APP_API_URL=http://!IP!:5000
)

echo.
pause
