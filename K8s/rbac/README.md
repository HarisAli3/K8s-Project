# RBAC Implementation for Student App

This directory contains the Role-Based Access Control (RBAC) configuration for the Kubernetes cluster.

## Overview

The RBAC implementation follows the principle of least privilege, providing each component with only the minimum permissions required to function properly.

## Components

### ServiceAccounts
- **backend-sa**: Service account for the backend application
- **frontend-sa**: Service account for the frontend application  
- **database-sa**: Service account for the database StatefulSet
- **monitoring-sa**: Service account for monitoring and observability tools

### Roles (Namespace-scoped)
- **backend-role**: Allows backend to read configmaps, secrets, pods, services, and deployments
- **frontend-role**: Minimal permissions for frontend (configmaps and services only)
- **database-role**: Permissions for database operations and PVC access
- **monitoring-role**: Permissions for monitoring tools to observe cluster state

### ClusterRoles (Cluster-scoped)
- **system-monitor**: Read-only access to cluster-wide resources for monitoring
- **backup-manager**: Permissions for backup operations across the cluster
- **network-policy-manager**: Permissions to manage network policies

### RoleBindings & ClusterRoleBindings
- Bind ServiceAccounts to their respective Roles and ClusterRoles
- Ensure proper permission inheritance

## Security Features

### Principle of Least Privilege
- Each component has only the minimum required permissions
- Frontend has the most restrictive permissions
- Backend has access to database-related resources
- Database has backup and storage permissions

### Separation of Concerns
- Different ServiceAccounts for different components
- Clear separation between application and monitoring permissions
- Dedicated permissions for backup operations

### Network Security
- Network policy management permissions for security tools
- Monitoring capabilities for network traffic analysis

## Deployment Order

1. Deploy ServiceAccounts first
2. Deploy Roles and ClusterRoles
3. Deploy RoleBindings and ClusterRoleBindings
4. Update deployments to use specific ServiceAccounts

## Verification

After deployment, verify RBAC is working:

```bash
# Check ServiceAccounts
kubectl get serviceaccounts -n production

# Check Roles
kubectl get roles -n production

# Check RoleBindings
kubectl get rolebindings -n production

# Check ClusterRoles
kubectl get clusterroles | grep -E "(system-monitor|backup-manager|network-policy-manager)"

# Check ClusterRoleBindings
kubectl get clusterrolebindings | grep -E "(system-monitor|backup-manager|network-policy-manager)"

# Test permissions (example)
kubectl auth can-i get pods --as=system:serviceaccount:production:backend-sa -n production
kubectl auth can-i get secrets --as=system:serviceaccount:production:frontend-sa -n production
```

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check if ServiceAccount is properly bound to required Role
2. **Missing Permissions**: Verify Role has the required verbs and resources
3. **Cross-namespace Access**: Use ClusterRole and ClusterRoleBinding for cluster-wide permissions

### Debug Commands
```bash
# Check what a ServiceAccount can do
kubectl auth can-i --list --as=system:serviceaccount:production:backend-sa -n production

# Check Role details
kubectl describe role backend-role -n production

# Check RoleBinding details
kubectl describe rolebinding backend-rolebinding -n production
```

## Best Practices

1. **Regular Audits**: Periodically review and audit RBAC permissions
2. **Minimal Permissions**: Only grant necessary permissions
3. **Documentation**: Keep this documentation updated with any changes
4. **Testing**: Test RBAC changes in a non-production environment first
5. **Monitoring**: Monitor for permission-related errors in application logs

