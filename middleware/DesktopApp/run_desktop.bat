@echo off
echo Starting ZKTeco K40 Biometric System - Staff Desktop...
echo.

REM Check if .NET 6.0 is installed
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: .NET 6.0 is not installed or not in PATH
    echo Please install .NET 6.0 Runtime from: https://dotnet.microsoft.com/download/dotnet/6.0
    pause
    exit /b 1
)

REM Navigate to the correct directory
cd /d "%~dp0"

REM Build and run the desktop application
echo Building desktop application...
dotnet build BiometricGymDesktop.csproj

if errorlevel 1 (
    echo ERROR: Failed to build the application
    echo.
    echo Make sure you have:
    echo 1. .NET 6.0 SDK installed
    echo 2. All required dependencies
    echo 3. Proper project configuration
    pause
    exit /b 1
)

echo Starting desktop application...
dotnet run --project BiometricGymDesktop.csproj

if errorlevel 1 (
    echo ERROR: Failed to start the application
    pause
    exit /b 1
)

pause 