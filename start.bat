@echo off
title Budget App Launcher
color 0A
echo ========================================
echo    BUDGET APPLICATION LAUNCHER
echo ========================================
echo.

echo [1/2] Starting Server...
start "Budget Server" cmd /c "cd /d C:\Users\HomePC\Downloads\budget-app\server && echo ?? SERVER STARTING... && npm run dev"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Client...
start "Budget Client" cmd /c "cd /d C:\Users\HomePC\Downloads\budget-app\client && echo ?? CLIENT STARTING... && npm start"

echo.
echo ? Applications are starting!
echo ?? Server: http://localhost:5000
echo ?? Client: http://localhost:3000
echo.
echo Press any key to stop all applications...
pause > nul

echo.
echo ?? Stopping applications...
taskkill /f /im node.exe > nul 2>&1
echo ? Applications stopped.
timeout /t 2 /nobreak > nul
