# Environment Configuration Guide

This guide explains how to configure environment variables for different deployment scenarios.

## Overview

The application now uses environment variables for all configuration, making it easy to deploy to different environments:
- Local Development
- Docker Compose
- Kubernetes
- Production

## File Structure

```
├── .env.example                 # Root environment for Docker Compose
├── frontend/
│   ├── .env.example            # Frontend environment variables
│   └── src/services/api.js     # Updated to use env vars
├── backend/
│   ├── .env.example            # Backend environment variables
│   ├── database/connection.js  # Updated to use env vars
│   └── server.js               # Updated CORS configuration
├── docker-compose.yml          # Updated to use env files
└── K8s/
    └── config-map.yaml         # Kubernetes configuration
```

## Quick Start

### 1. Local Development

```bash
# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Update values in .env files as needed
```

### 2. Docker Compose

```bash
# Copy and configure environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Start services
docker-compose up -d
```

### 3. Kubernetes

```bash
# Apply configurations
kubectl apply -f K8s/namespace.yaml
kubectl apply -f K8s/config-map.yaml
kubectl apply -f K8s/database-deployment.yaml
kubectl apply -f K8s/backend-deployment.yaml
kubectl apply -f K8s/frontend-deployment.yaml
```

## Environment Variables

### Frontend (.env)

| Variable | Description | Default | Examples |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` | `http://backend:5000/api` (Docker)<br>`http://backend-service:5000/api` (K8s) |
| `REACT_APP_NODE_ENV` | Environment | `development` | `production`, `staging` |
| `REACT_APP_BUILD_ENV` | Build environment | `docker` | `kubernetes`, `production` |

### Backend (.env)

| Variable | Description | Default | Examples |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | `3000`, `8080` |
| `NODE_ENV` | Environment | `development` | `production`, `staging` |
| `DB_HOST` | Database host | `localhost` | `database` (Docker)<br>`database-service` (K8s) |
| `DB_PORT` | Database port | `5432` | `5432` |
| `DB_NAME` | Database name | `student_management` | `student_management` |
| `DB_USER` | Database user | `postgres` | `postgres` |
| `DB_PASSWORD` | Database password | `password` | `your_password` |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:3000` | `http://frontend:80,http://localhost:3000` |

### Root (.env) - Docker Compose

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host for Docker | `localhost` |
| `DB_PORT` | Database port for Docker | `5432` |
| `DB_NAME` | Database name | `student_management` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `PORT` | Backend port | `5000` |
| `FRONTEND_PORT` | Frontend port | `3000` |

## Configuration Examples

### Local Development
```bash
# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BUILD_ENV=local

# backend/.env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=password
CORS_ORIGIN=http://localhost:3000
```

### Docker Compose
```bash
# frontend/.env
REACT_APP_API_URL=http://backend:5000/api
REACT_APP_BUILD_ENV=docker

# backend/.env
PORT=5000
NODE_ENV=development
DB_HOST=database
DB_PORT=5432
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=password
CORS_ORIGIN=http://frontend:80,http://localhost:3000
```

### Kubernetes
```bash
# frontend/.env
REACT_APP_API_URL=http://backend-service:5000/api
REACT_APP_BUILD_ENV=kubernetes

# backend/.env
PORT=5000
NODE_ENV=production
DB_HOST=database-service
DB_PORT=5432
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=password
CORS_ORIGIN=http://frontend-service:80
```

## Dynamic Configuration

The application automatically detects the environment and configures itself:

1. **Frontend API Service**: Automatically selects the correct backend URL based on environment
2. **Backend Database**: Connects to the appropriate database host based on environment
3. **CORS**: Dynamically allows origins based on environment configuration

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords in production
- Consider using Kubernetes secrets for sensitive data
- Regularly rotate database credentials

## Troubleshooting

### Common Issues

1. **Frontend can't connect to backend**
   - Check `REACT_APP_API_URL` in frontend `.env`
   - Verify backend service is running
   - Check CORS configuration

2. **Backend can't connect to database**
   - Check database connection variables
   - Verify database service is running
   - Check network connectivity

3. **CORS errors**
   - Verify `CORS_ORIGIN` includes your frontend URL
   - Check browser console for specific error messages

### Debug Commands

```bash
# Check environment variables
docker-compose exec frontend env | grep REACT_APP
docker-compose exec backend env | grep DB_

# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check Kubernetes config
kubectl get configmap -n sms-namespace
kubectl describe configmap app-config -n sms-namespace
```

## Migration Guide

If you're updating from the old configuration:

1. Copy the new `.env.example` files
2. Update your existing `.env` files with new variables
3. Restart your services
4. Test the application functionality

The application will automatically use the new environment-based configuration.
