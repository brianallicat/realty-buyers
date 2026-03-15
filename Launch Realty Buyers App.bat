@echo off
title Realty Buyers ? Maricopa County
color 1F
echo.
echo  ================================================
echo   REALTY BUYERS ? MARICOPA COUNTY
echo   Created by Global Resources Management Group, LLC
echo  ================================================
echo.
echo  Starting app...
cd /d "C:\Users\brianallicat\realty-buyers-search"
start "" "http://localhost:3001"
timeout /t 2 /nobreak >nul
start cmd /k "npm run dev"
timeout /t 4 /nobreak >nul
start "" "http://localhost:3001"
echo.
echo  App is running at http://localhost:3001
echo  Close this window to keep app running in background.
