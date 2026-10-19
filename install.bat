@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ======================================================
echo    Installing AGMod into Google Antigravity
echo ======================================================
node install.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.
pause
