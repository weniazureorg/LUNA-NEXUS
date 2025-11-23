@echo off
echo ========================================
echo   Stopping Luna-Dolph-AI Servers
echo ========================================
echo.

echo Stopping Python backend...
powershell -Command "Stop-Process -Name python -Force -ErrorAction SilentlyContinue"

echo Stopping Node.js/Vite processes...
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue"

echo Stopping Electron app...
powershell -Command "Stop-Process -Name 'Luna-Dolph-AI' -Force -ErrorAction SilentlyContinue"

echo.
echo All Luna-Dolph-AI servers stopped!
echo.
pause
