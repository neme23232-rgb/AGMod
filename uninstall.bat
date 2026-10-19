@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ======================================================
echo    Uninstalling AGMod and Restoring Original
echo ======================================================
node uninstall.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Restore failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.
pause
