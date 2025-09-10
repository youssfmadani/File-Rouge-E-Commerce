#!/bin/bash

echo "====================================="
echo "  FileRouge SonarQube Analysis Script"
echo "====================================="
echo

echo "Checking if SonarQube is running..."
if ! docker ps | grep -q filerouge-sonarqube; then
    echo "WARNING: SonarQube container is not running!"
    echo "Please start SonarQube first: docker-compose up sonarqube"
    echo
    read -p "Continue anyway? (y/N): " continue
    if [[ ! "$continue" =~ ^[Yy]$ ]]; then
        echo "Exiting..."
        exit 1
    fi
fi

echo
echo "Choose analysis option:"
echo "1. Analyze Backend only (Spring Boot)"
echo "2. Analyze Frontend only (Angular)"
echo "3. Analyze Both (Backend + Frontend)"
echo

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo
        echo "Analyzing Backend..."
        cd Backend
        echo "Running tests and generating coverage..."
        ./mvnw clean test jacoco:report
        echo "Running SonarQube analysis..."
        ./mvnw sonar:sonar
        cd ..
        ;;
    2)
        echo
        echo "Analyzing Frontend..."
        cd Frontend
        echo "Installing dependencies..."
        npm install
        echo "Running tests and generating coverage..."
        npm run test -- --code-coverage --watch=false --browsers=ChromeHeadless
        echo "Running SonarQube analysis..."
        npx sonar-scanner
        cd ..
        ;;
    3)
        echo
        echo "Analyzing Backend..."
        cd Backend
        echo "Running tests and generating coverage..."
        ./mvnw clean test jacoco:report
        echo "Running SonarQube analysis..."
        ./mvnw sonar:sonar
        cd ..
        
        echo
        echo "Analyzing Frontend..."
        cd Frontend
        echo "Installing dependencies..."
        npm install
        echo "Running tests and generating coverage..."
        npm run test -- --code-coverage --watch=false --browsers=ChromeHeadless
        echo "Running SonarQube analysis..."
        npx sonar-scanner
        cd ..
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

echo
echo "====================================="
echo "Analysis completed!"
echo "Open SonarQube dashboard at: http://localhost:9000"
echo "Default credentials: admin/admin"
echo "====================================="