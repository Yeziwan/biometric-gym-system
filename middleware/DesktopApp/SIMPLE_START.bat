@echo off
chcp 65001 >nul
title ZKTeco K40 Desktop Application

echo ================================================================
echo    ZKTeco K40 Biometric Gym Management System - Desktop
echo    Staff Version - Member Registration and Verification
echo ================================================================
echo.

echo [1/4] Checking .NET 6.0 environment...
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: .NET 6.0 not found
    echo Please install .NET 6.0 Runtime from:
    echo https://dotnet.microsoft.com/download/dotnet/6.0
    pause
    exit /b 1
) else (
    echo OK: .NET 6.0 environment ready
)

cd /d "%~dp0"

echo.
echo [2/4] Restoring packages...
dotnet restore BiometricGymDesktop.csproj --verbosity quiet
if errorlevel 1 (
    echo ERROR: Package restore failed
    pause
    exit /b 1
) else (
    echo OK: Packages restored
)

echo.
echo [3/4] Building application...
dotnet build BiometricGymDesktop.csproj --configuration Release --verbosity quiet
if errorlevel 1 (
    echo ERROR: Build failed
    echo.
    echo Possible solutions:
    echo 1. Install .NET 6.0 SDK (not just Runtime)
    echo 2. Check project file integrity
    echo 3. Re-download project files
    pause
    exit /b 1
) else (
    echo OK: Build successful
)

echo.
echo [4/4] Starting desktop application...
echo.
echo ================================================================
echo Application is starting...
echo.
echo Features:
echo - Member Registration (Add new members and fingerprints)
echo - Member Verification (Verify by ID or fingerprint)
echo.
echo Note: Make sure backend API is running on port 8000
echo ================================================================
echo.

dotnet run --project BiometricGymDesktop.csproj --configuration Release

if errorlevel 1 (
    echo.
    echo ERROR: Application failed to start
    echo.
    echo Possible causes:
    echo 1. Backend API not running (http://localhost:8000)
    echo 2. Network connection issues
    echo 3. Configuration errors
    pause
    exit /b 1
)

echo.
echo Application closed
pause 