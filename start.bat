@echo off
title SolarSciencePortal - Solar EPC Project & Staff Tracking
color 0E
echo ===================================================================
echo             ☀️ SOLAR SCIENCE PORTAL - EPC MANAGEMENT SYSTEM
echo             Admin Dispatch + Field Staff App + Customer Live Tracker
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/2] Verifying dependencies...
if not exist "node_modules\@next\swc-win32-x64-msvc" (
    echo [Dependencies] Setting up platform binaries...
    call npm install
)

echo.
echo [2/2] Starting SolarSciencePortal Server on port 3000...
echo ===================================================================
echo Access Links:
echo - Admin Control Hub:  http://localhost:3000/admin
echo - Field Staff App:    http://localhost:3000/employee
echo - Customer Tracker:   http://localhost:3000/track
echo - Historical Audit:   http://localhost:3000/admin/history
echo ===================================================================
echo.

timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
call npm run dev
pause
