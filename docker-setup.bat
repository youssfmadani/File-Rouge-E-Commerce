@echo off
echo =====================================
echo   FileRouge Docker Setup Script
echo =====================================
echo.

echo Checking if Docker is running...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running or not installed!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running ✓
echo.

echo Choose an option:
echo 1. Build and run all services (Full setup)
echo 2. Build only (without running)
echo 3. Run existing images
echo 4. Stop all services
echo 5. Clean up (remove containers and images)
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Building and starting all services...
    docker-compose up --build
) else if "%choice%"=="2" (
    echo.
    echo Building all images...
    docker-compose build
    echo Build completed!
    pause
) else if "%choice%"=="3" (
    echo.
    echo Starting existing services...
    docker-compose up
) else if "%choice%"=="4" (
    echo.
    echo Stopping all services...
    docker-compose down
    echo Services stopped!
    pause
) else if "%choice%"=="5" (
    echo.
    echo WARNING: This will remove all containers, networks, and images!
    set /p confirm="Are you sure? (y/N): "
    if /i "%confirm%"=="y" (
        echo Cleaning up...
        docker-compose down -v
        docker image prune -f
        echo Cleanup completed!
    ) else (
        echo Cleanup cancelled.
    )
    pause
) else (
    echo Invalid choice!
    pause
)

echo.
echo Script completed!
pause