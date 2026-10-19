@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ======================================================
echo    Building AGMod (Themes & Localization)
echo ======================================================
node build.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.
pause
