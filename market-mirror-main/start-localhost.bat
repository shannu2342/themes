@echo off
REM Localhost Development Startup Script for Windows

echo Starting Localhost Development Environment...

REM Check if backend localhost env exists
if not exist "backend\.env.localhost" (
    echo backend\.env.localhost file not found.
    echo Please create backend\.env.localhost with your local configuration.
    pause
    exit /b 1
)

echo Starting Backend Server on port 3001...
start "Backend Server" cmd /k "cd /d backend && npm run dev"

echo Starting Frontend on port 8080...
start "Frontend Server" cmd /k "cd /d frontend && npm run dev"

echo Both servers started.
echo Frontend: http://localhost:8080
echo Backend: http://localhost:3001
echo.
echo Press any key to stop both servers...
pause > nul

REM Stop all node processes
taskkill /F /IM node.exe > nul 2>&1
echo All servers stopped
pause
