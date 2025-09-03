# Backend Health Check System

## Overview
The backend now includes enhanced health checks that verify both HTTP endpoint availability and database connectivity. This ensures that the backend only reports as healthy when it can successfully connect to the database.

## Health Check Endpoints

### 1. `/health`
- **Purpose**: Main health check endpoint for Kubernetes probes
- **Response**: 
  - `200 OK`: Server is running and database is connected
  - `503 Service Unavailable`: Server is running but database is not accessible

### 2. `/api/health`
- **Purpose**: API-specific health check endpoint
- **Response**: Same as `/health` endpoint

## Health Check Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Server is running and database is connected",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "connected",
  "poolStatus": {
    "totalCount": 5,
    "idleCount": 3,
    "waitingCount": 0
  }
}
```

### Failure Response (503)
```json
{
  "success": false,
  "message": "Server is running but database is not accessible",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "disconnected",
  "error": "connection refused",
  "errorCode": "ECONNREFUSED",
  "isConnectionError": true
}
```

## Kubernetes Configuration

### Startup Probe
- **Path**: `/health`
- **Initial Delay**: 5 seconds
- **Period**: 10 seconds
- **Timeout**: 5 seconds
- **Failure Threshold**: 30 (5 minutes total)

### Readiness Probe
- **Path**: `/health`
- **Initial Delay**: 10 seconds
- **Period**: 15 seconds
- **Timeout**: 5 seconds
- **Failure Threshold**: 3
- **Success Threshold**: 1

### Liveness Probe
- **Path**: `/health`
- **Initial Delay**: 20 seconds
- **Period**: 20 seconds
- **Timeout**: 3 seconds

## Docker Health Check
The Dockerfile includes a health check that runs `node healthcheck.js` every 30 seconds. This script:
1. Tests the HTTP health endpoint
2. Tests database connectivity
3. Exits with code 0 if both checks pass, 1 if either fails

## Database Connection Testing
The health check performs a simple `SELECT 1` query to verify:
- Database server is reachable
- Authentication is successful
- Connection pool is working
- Basic query execution is functional

## Error Handling
The system distinguishes between:
- **Connection Errors**: Network issues, database down, authentication failures
- **Query Errors**: Database schema issues, permission problems

## Benefits
1. **Kubernetes Integration**: Backend pods won't receive traffic until database is accessible
2. **Load Balancer Health**: Health checks will fail if database is down
3. **Monitoring**: Clear visibility into database connectivity status
4. **Resilience**: Better handling of database connection issues
5. **Debugging**: Detailed error information for troubleshooting

## Environment Variables
The health check system respects these database environment variables:
- `DB_HOST`: Database hostname
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_CONNECTION_TIMEOUT`: Connection timeout in milliseconds
- `DB_MAX_CONNECTIONS`: Maximum pool connections
- `DB_IDLE_TIMEOUT`: Idle connection timeout
