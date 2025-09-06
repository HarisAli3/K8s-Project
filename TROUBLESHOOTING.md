# Troubleshooting Frontend-Backend Connection in Kubernetes

## Issue Description
The frontend is unable to fetch students data from the backend in Kubernetes, showing "Failed to fetch students. Please try again."

## Root Causes & Solutions

### 1. API URL Configuration Issue
**Problem**: Frontend is trying to connect to `http://backend-service:5000/api` which won't work from the browser.

**Solution**: Frontend should use relative URLs through the ingress:
- ✅ Correct: `/api` (relative to current origin)
- ❌ Wrong: `http://backend-service:5000/api`

**Fixed in**: `frontend/src/services/api.js`

### 2. CORS Configuration
**Problem**: Backend might be blocking requests due to CORS policy.

**Solution**: Added CORS environment variable to backend deployment:
```yaml
- name: CORS_ORIGIN
  value: "*"
```

**Fixed in**: `K8s/backend/backend-deployment.yaml`

### 3. Ingress Configuration
**Problem**: Ingress might not be properly routing API requests.

**Solution**: Added CORS and timeout annotations to ingress:
```yaml
nginx.ingress.kubernetes.io/enable-cors: "true"
nginx.ingress.kubernetes.io/cors-allow-origin: "*"
```

**Fixed in**: `K8s/ingress.yaml`

### 4. Frontend Build Configuration
**Problem**: Frontend was using development mode instead of production build.

**Solution**: Updated Dockerfile to use proper production build with nginx.

**Fixed in**: `frontend/Dockerfile`

## Debugging Steps

### Step 1: Check Pod Status
```bash
kubectl get pods -n production
kubectl describe pod <frontend-pod-name> -n production
kubectl describe pod <backend-pod-name> -n production
```

### Step 2: Check Service Status
```bash
kubectl get svc -n production
kubectl describe svc frontend-service -n production
kubectl describe svc backend-service -n production
```

### Step 3: Check Ingress Status
```bash
kubectl get ingress -n production
kubectl describe ingress myapp-ingress -n production
```

### Step 4: Test Backend Health
```bash
# Port forward to backend service
kubectl port-forward svc/backend-service 5000:5000 -n production

# Test health endpoints
curl http://localhost:5000/health
curl http://localhost:5000/ready
curl http://localhost:5000/live
```

### Step 5: Check Frontend Logs
```bash
kubectl logs <frontend-pod-name> -n production
```

### Step 6: Check Backend Logs
```bash
kubectl logs <backend-pod-name> -n production
```

## Using the Debug Button

The frontend now includes a debug button in the header that:
1. Shows current API configuration
2. Tests the `/api/health` endpoint
3. Provides detailed error information

## Common Issues & Fixes

### Issue: "Connection refused" or "Network Error"
- Check if backend pods are running
- Verify service selectors match pod labels
- Check if backend is listening on correct port

### Issue: "CORS error"
- Verify CORS_ORIGIN environment variable is set
- Check ingress CORS annotations
- Ensure frontend and backend are in same namespace

### Issue: "404 Not Found"
- Verify ingress path configuration
- Check if backend routes are properly configured
- Ensure backend is using `/api` prefix

### Issue: "Timeout"
- Check ingress timeout annotations
- Verify backend response times
- Check network policies

## Testing the Fix

1. **Rebuild and redeploy frontend**:
   ```bash
   docker build -t frontend ./frontend
   kubectl rollout restart deployment/frontend-deployment -n production
   ```

2. **Restart backend deployment**:
   ```bash
   kubectl rollout restart deployment/backend-deployment -n production
   ```

3. **Check ingress controller**:
   ```bash
   kubectl get pods -n ingress-nginx
   ```

4. **Test the connection**:
   - Open frontend in browser
   - Click the "Debug" button
   - Check console for detailed information

## Environment Variables

### Frontend
- `REACT_APP_ENV`: Set to "production" in Kubernetes

### Backend
- `NODE_ENV`: Set to "production" in Kubernetes
- `CORS_ORIGIN`: Set to "*" to allow all origins
- `DB_HOST`: Set to "database-service"

## Network Flow

```
Browser → Ingress → Frontend Service → Frontend Pod
Browser → Ingress → Backend Service → Backend Pod
```

The ingress routes:
- `/` → frontend-service:80
- `/api/*` → backend-service:5000

## Additional Debugging

If issues persist, check:
1. **Network Policies**: Ensure no policies are blocking traffic
2. **Security Contexts**: Verify pods can communicate
3. **Resource Limits**: Check if pods have sufficient resources
4. **DNS Resolution**: Verify service names resolve correctly within cluster
