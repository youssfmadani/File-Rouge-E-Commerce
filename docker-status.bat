@echo off
echo =====================================
echo   Docker Build Status Monitor
echo =====================================
echo.

echo Checking Docker processes...
docker ps -a
echo.

echo Checking Docker images...
docker images
echo.

echo Checking Docker networks...
docker network ls
echo.

echo To monitor logs in real-time, use:
echo   docker-compose logs -f
echo   docker-compose logs -f backend
echo   docker-compose logs -f frontend
echo   docker-compose logs -f db
echo.

echo Once all containers are running, access:
echo   Frontend: http://localhost
echo   Backend:  http://localhost:8080
echo   Database: localhost:3306
echo.

pause