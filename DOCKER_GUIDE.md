# Docker Setup Guide for FileRouge Project

This guide will help you containerize and run your FileRouge project using Docker.

## Prerequisites

- Docker Desktop installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Project Structure

```
FileRouge/
├── Backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── (Java Spring Boot application)
├── Frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── (Angular application)
└── docker-compose.yml
```

## Quick Start

### Option 1: Run Everything with Docker Compose (Recommended)

1. **Navigate to the project root directory:**
   ```bash
   cd C:\Users\Youssef\IdeaProjects\FileRouge
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access your applications:**
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost:8080
   - MySQL Database: localhost:3306
   - SonarQube: http://localhost:9000 (admin/admin)

### Option 2: Build Individual Images

#### Build Backend Image
```bash
cd Backend
docker build -t filerouge-backend .
```

#### Build Frontend Image
```bash
cd Frontend
docker build -t filerouge-frontend .
```

#### Run Individual Containers
```bash
# Run MySQL
docker run -d --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=filerouge \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=password \
  -p 3306:3306 \
  mysql:8.0

# Run Backend (wait for MySQL to be ready)
docker run -d --name filerouge-backend \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/filerouge?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC \
  -e SPRING_DATASOURCE_USERNAME=user \
  -e SPRING_DATASOURCE_PASSWORD=password \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  --link mysql-db \
  -p 8080:8080 \
  filerouge-backend

# Run Frontend
docker run -d --name filerouge-frontend \
  -p 80:80 \
  filerouge-frontend
```

## Docker Commands Reference

### Basic Commands
```bash
# Build and start services
docker-compose up --build

# Start services in detached mode (background)
docker-compose up -d

# Stop all services
docker-compose down

# View running containers
docker-compose ps

# View logs
docker-compose logs
docker-compose logs backend
docker-compose logs frontend
```

### Development Commands
```bash
# Rebuild a specific service
docker-compose build backend
docker-compose build frontend

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend

# Execute commands inside containers
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Cleanup Commands
```bash
# Remove stopped containers and networks
docker-compose down

# Remove everything including volumes (⚠️ This will delete your database data!)
docker-compose down -v

# Remove unused Docker images
docker image prune

# Remove all unused Docker resources
docker system prune -a
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Make sure ports 80, 8080, and 3306 are not being used by other applications
   - You can change ports in docker-compose.yml if needed

2. **Build failures:**
   - Ensure Docker Desktop is running
   - Check if you have enough disk space
   - Try cleaning Docker cache: `docker builder prune`

3. **Database connection issues:**
   - Wait for MySQL container to be fully started (check with `docker-compose logs db`)
   - Verify database credentials in docker-compose.yml

4. **Frontend build issues:**
   - Ensure package.json is correct
   - Try deleting node_modules and rebuilding

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Production Considerations

For production deployment, consider:

1. **Environment Variables:** Use `.env` files for sensitive data
2. **Volumes:** Mount persistent volumes for database data
3. **Nginx Configuration:** Customize nginx.conf for frontend if needed
4. **Health Checks:** Implement proper health checks for all services
5. **Security:** Use secrets management for passwords and keys

## File Explanations

- **Backend/Dockerfile:** Multi-stage build for Java Spring Boot application
- **Frontend/Dockerfile:** Multi-stage build for Angular application with nginx
- **docker-compose.yml:** Orchestrates all services with proper networking
- **.dockerignore:** Excludes unnecessary files from Docker build context
- **SONARQUBE_SETUP.md:** Complete guide for SonarQube code quality analysis
- **sonar-analysis.bat/.sh:** Scripts for running SonarQube analysis