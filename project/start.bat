@echo off
setlocal ENABLEDELAYEDEXPANSION

set SCRIPT_DIR=%~dp0

echo Starting LIMS System...

echo Starting Backend Server...
start "LIMS Backend" cmd /c "cd /d %SCRIPT_DIR%backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "LIMS Frontend" cmd /c "cd /d %SCRIPT_DIR% && npm run dev"

echo.
echo LIMS System is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000

echo Press Ctrl+C to stop this window (servers will continue in their own windows)

endlocal 