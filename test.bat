@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ======================================================
echo       Running AGMod Full Test Suite
echo ======================================================
node test_pipeline.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Pipeline test failed!
    pause
    exit /b %ERRORLEVEL%
)

node test_locales.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Locales integrity test failed!
    pause
    exit /b %ERRORLEVEL%
)

node test_live.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Live integration test failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [ALL TESTS PASSED]
pause
