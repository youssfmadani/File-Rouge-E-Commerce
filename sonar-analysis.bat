@echo off
echo =====================================
echo   FileRouge SonarQube Analysis Script
echo =====================================
echo.

echo Checking if SonarQube is running...
docker ps | findstr filerouge-sonarqube
if %errorlevel% neq 0 (
    echo WARNING: SonarQube container is not running!
    echo Please start SonarQube first: docker-compose up sonarqube
    echo.
    set /p continue="Continue anyway? (y/N): "
    if /i not "%continue%"=="y" (
        echo Exiting...
        pause
        exit /b 1
    )
)

echo.
echo Choose analysis option:
echo 1. Analyze Backend only (Spring Boot)
echo 2. Analyze Frontend only (Angular)
echo 3. Analyze Both (Backend + Frontend)
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Analyzing Backend...
    cd Backend
    echo Running tests and generating coverage...
    mvn clean test jacoco:report
    echo Running SonarQube analysis...
    mvn sonar:sonar
    cd ..
) else if "%choice%"=="2" (
    echo.
    echo Analyzing Frontend...
    cd Frontend
    echo Installing dependencies...
    npm install
    echo Running tests and generating coverage...
    npm run test -- --code-coverage --watch=false --browsers=ChromeHeadless
    echo Running SonarQube analysis...
    npx sonar-scanner
    cd ..
) else if "%choice%"=="3" (
    echo.
    echo Analyzing Backend...
    cd Backend
    echo Running tests and generating coverage...
    mvn clean test jacoco:report
    echo Running SonarQube analysis...
    mvn sonar:sonar
    cd ..
    
    echo.
    echo Analyzing Frontend...
    cd Frontend
    echo Installing dependencies...
    npm install
    echo Running tests and generating coverage...
    npm run test -- --code-coverage --watch=false --browsers=ChromeHeadless
    echo Running SonarQube analysis...
    npx sonar-scanner
    cd ..
) else (
    echo Invalid choice!
    pause
    exit /b 1
)

echo.
echo =====================================
echo Analysis completed!
echo Open SonarQube dashboard at: http://localhost:9000
echo Default credentials: admin/admin
echo =====================================
pause