# SonarQube Code Quality Analysis Setup

This document provides instructions for setting up and using SonarQube code quality analysis for the FileRouge project.

## Overview

SonarQube is configured to analyze both the frontend (Angular) and backend (Spring Boot) components of the FileRouge application. It provides insights into:

- Code quality issues
- Security vulnerabilities
- Code coverage
- Technical debt
- Duplicated code
- Code smells

## Architecture

The SonarQube setup includes:
- **SonarQube Server**: Main analysis server (Community Edition)
- **PostgreSQL Database**: SonarQube data storage
- **Frontend Analysis**: Angular/TypeScript code analysis
- **Backend Analysis**: Java/Spring Boot code analysis

## Prerequisites

- Docker and Docker Compose installed
- FileRouge project running in containers
- Node.js (for frontend analysis)
- Maven (for backend analysis)

## Quick Start

### 1. Start SonarQube Services

```bash
# Start only SonarQube and its database
docker-compose up sonarqube sonar-db -d

# Or start all services including SonarQube
docker-compose up -d
```

### 2. Access SonarQube Dashboard

- **URL**: http://localhost:9000
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin`

⚠️ **Important**: Change the default password on first login!

### 3. Run Code Analysis

#### Option 1: Use Analysis Scripts (Recommended)

**Windows:**
```cmd
sonar-analysis.bat
```

**Linux/Mac:**
```bash
chmod +x sonar-analysis.sh
./sonar-analysis.sh
```

#### Option 2: Manual Analysis

**Backend Analysis:**
```bash
cd Backend
mvn clean test jacoco:report
mvn sonar:sonar
```

**Frontend Analysis:**
```bash
cd Frontend
npm install
npm run test:coverage
npm run sonar
```

## Configuration Details

### SonarQube Server Configuration

- **Container Name**: `filerouge-sonarqube`
- **Port**: 9000
- **Database**: PostgreSQL
- **Volumes**: 
  - `sonarqube_data`: Application data
  - `sonarqube_logs`: Server logs
  - `sonarqube_extensions`: Plugins and extensions

### Frontend Configuration (`Frontend/sonar-project.properties`)

```properties
sonar.projectKey=filerouge-frontend
sonar.projectName=FileRouge Frontend
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### Backend Configuration (`Backend/sonar-project.properties`)

```properties
sonar.projectKey=filerouge-backend
sonar.projectName=FileRouge Backend
sonar.sources=src/main/java
sonar.tests=src/test/java
sonar.java.binaries=target/classes
sonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
```

## Docker Compose Services

### SonarQube Service
```yaml
sonarqube:
  image: sonarqube:10.2-community
  container_name: filerouge-sonarqube
  ports:
    - "9000:9000"
  environment:
    SONAR_JDBC_URL: jdbc:postgresql://sonar-db:5432/sonar
    SONAR_JDBC_USERNAME: sonar
    SONAR_JDBC_PASSWORD: sonar
  depends_on:
    - sonar-db
```

### PostgreSQL Database
```yaml
sonar-db:
  image: postgres:13
  container_name: filerouge-sonar-db
  environment:
    POSTGRES_USER: sonar
    POSTGRES_PASSWORD: sonar
    POSTGRES_DB: sonar
```

## Code Coverage

### Frontend (Angular)
- Uses Karma with Istanbul for coverage
- Coverage reports generated in `Frontend/coverage/`
- LCOV format for SonarQube integration

### Backend (Spring Boot)
- Uses JaCoCo Maven plugin
- Coverage reports in `Backend/target/site/jacoco/`
- XML format for SonarQube integration

## Quality Gates

SonarQube includes default quality gates. You can customize them in the SonarQube dashboard:

1. Navigate to **Quality Gates**
2. Create or modify gates
3. Set thresholds for:
   - Coverage percentage
   - Duplicated lines
   - Maintainability rating
   - Reliability rating
   - Security rating

## Troubleshooting

### Common Issues

1. **SonarQube not starting**
   ```bash
   # Check container logs
   docker logs filerouge-sonarqube
   
   # Ensure PostgreSQL is running first
   docker-compose up sonar-db -d
   ```

2. **Analysis fails with connection error**
   - Verify SonarQube is running on port 9000
   - Check network connectivity between containers

3. **Coverage reports not showing**
   - Ensure tests run before analysis
   - Verify coverage file paths in configuration

### Log Locations

- **SonarQube logs**: Volume `sonarqube_logs`
- **Analysis logs**: Console output during analysis
- **Docker logs**: `docker logs filerouge-sonarqube`

## Best Practices

1. **Regular Analysis**: Run analysis after each significant code change
2. **Quality Gates**: Set appropriate thresholds for your project
3. **Security**: Change default passwords and secure access
4. **Monitoring**: Monitor quality metrics over time
5. **Integration**: Consider integrating with CI/CD pipelines

## Advanced Configuration

### Custom Rules
1. Access **Rules** in SonarQube dashboard
2. Create custom rule sets
3. Apply to specific projects

### Webhooks
Configure webhooks for CI/CD integration:
1. Go to **Administration** > **Configuration** > **Webhooks**
2. Add webhook URL for your CI/CD system

### Plugins
Install additional plugins:
1. Access **Administration** > **Marketplace**
2. Install relevant plugins for your stack

## Commands Reference

### Docker Commands
```bash
# Start SonarQube only
docker-compose up sonarqube -d

# Stop SonarQube
docker-compose stop sonarqube

# View logs
docker logs filerouge-sonarqube

# Clean up volumes (⚠️ Data loss!)
docker-compose down -v
```

### Analysis Commands
```bash
# Backend only
cd Backend && mvn clean test jacoco:report sonar:sonar

# Frontend only
cd Frontend && npm run test:coverage && npm run sonar

# Both projects
./sonar-analysis.sh  # or .bat on Windows
```

## Security Considerations

1. **Change Default Credentials**: Immediately after first login
2. **Network Security**: Use HTTPS in production
3. **Access Control**: Configure user permissions appropriately
4. **Database Security**: Secure PostgreSQL instance
5. **Firewall**: Restrict access to port 9000 in production

## Maintenance

### Regular Tasks
- **Database Backup**: Backup PostgreSQL data regularly
- **Log Rotation**: Monitor and rotate log files
- **Updates**: Keep SonarQube updated to latest version
- **Performance**: Monitor resource usage and optimize

### Health Checks
```bash
# Check service status
docker-compose ps

# Verify SonarQube health
curl http://localhost:9000/api/system/health
```

## Support

For issues specific to SonarQube configuration:
1. Check the [official SonarQube documentation](https://docs.sonarqube.org/)
2. Review container logs for error messages
3. Verify network connectivity between services

---

**Last Updated**: January 2025  
**Version**: 1.0.0