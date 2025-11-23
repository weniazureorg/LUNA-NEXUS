@echo off
title Luna AI Launcher
echo ==========================================
echo   Starting Luna AI
echo ==========================================

echo [1/3] Starting Backend...
start "Luna Backend" /min cmd /k "cd backend && .\venv\Scripts\python.exe server.py"

echo [2/3] Starting Frontend...
start "Luna Frontend" /min cmd /k "npm run dev"

echo [3/3] Launching Application...
echo Waiting for services to initialize...
timeout /t 5 /nobreak >nul

set NODE_ENV=development
set ELECTRON_RUN_AS_NODE=
start "" ".\node_modules\electron\dist\electron.exe" .

echo.
echo App launched! You can minimize this window.
echo To stop everything, run STOP-LUNA.bat
timeout /t 5 >nul
exit
