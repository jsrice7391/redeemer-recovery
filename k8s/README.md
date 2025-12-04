# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the Redeemer Recovery application to a Kubernetes cluster.

## Prerequisites

- A running Kubernetes cluster (local or cloud)
- `kubectl` configured to access your cluster
- Docker for building images
- (Optional) NGINX Ingress Controller installed
- (Optional) cert-manager for TLS certificates

## Architecture

The application consists of three main components:

1. **PostgreSQL Database** - Persistent data storage
2. **Express Server** - Backend API (TypeScript)
3. **React Client** - Frontend UI (TypeScript/Vite)

## Quick Start

### 1. Build Docker Images

Build and tag the images for your container registry:

```bash
# Build server image
cd server
docker build -t your-registry/redeemer-server:latest .
docker push your-registry/redeemer-server:latest

# Build client image
cd ../client
docker build -t your-registry/redeemer-client:latest .
docker push your-registry/redeemer-client:latest
```

**Note:** Replace `your-registry` with your actual container registry (e.g., `docker.io/username`, `gcr.io/project-id`, etc.)

### 2. Update Image References

Update the image references in the deployment files:
- `k8s/server-deployment.yaml` - Line 27 and 32
- `k8s/client-deployment.yaml` - Line 18

Replace `your-registry` with your actual registry path.

### 3. Update Configuration

Edit `k8s/secret.yaml` to change default database credentials:

```yaml
stringData:
  POSTGRES_USER: your-user
  POSTGRES_PASSWORD: your-secure-password
  POSTGRES_DB: redeemer_recovery
  DATABASE_URL: postgresql://your-user:your-secure-password@postgres-service:5432/redeemer_recovery
```

Edit `k8s/ingress.yaml` to set your domain:

```yaml
rules:
- host: your-domain.com
```

### 4. Deploy to Kubernetes

Apply all manifests in order:

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets and config
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml

# Deploy PostgreSQL
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n redeemer-recovery --timeout=120s

# Deploy server
kubectl apply -f k8s/server-deployment.yaml
kubectl apply -f k8s/server-service.yaml

# Deploy client
kubectl apply -f k8s/client-deployment.yaml
kubectl apply -f k8s/client-service.yaml

# Deploy ingress (optional)
kubectl apply -f k8s/ingress.yaml
```

Or apply all at once:

```bash
kubectl apply -f k8s/
```

## Verification

Check that all pods are running:

```bash
kubectl get pods -n redeemer-recovery
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
postgres-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
server-xxxxxxxxxx-xxxxx     1/1     Running   0          1m
server-xxxxxxxxxx-xxxxx     1/1     Running   0          1m
client-xxxxxxxxxx-xxxxx     1/1     Running   0          1m
client-xxxxxxxxxx-xxxxx     1/1     Running   0          1m
```

Check services:

```bash
kubectl get services -n redeemer-recovery
```

Check ingress:

```bash
kubectl get ingress -n redeemer-recovery
```

## Accessing the Application

### With Ingress

If you configured ingress with a domain, access via:
- Frontend: `https://your-domain.com`
- API: `https://your-domain.com/api`

### With Port Forwarding (for testing)

Forward the client service:

```bash
kubectl port-forward -n redeemer-recovery service/client-service 8080:80
```

Access at: http://localhost:8080

Forward the server service:

```bash
kubectl port-forward -n redeemer-recovery service/server-service 3001:3001
```

Access API at: http://localhost:3001/api

## Scaling

Scale the server:

```bash
kubectl scale deployment server -n redeemer-recovery --replicas=3
```

Scale the client:

```bash
kubectl scale deployment client -n redeemer-recovery --replicas=3
```

## Monitoring

View logs:

```bash
# Server logs
kubectl logs -f deployment/server -n redeemer-recovery

# Client logs
kubectl logs -f deployment/client -n redeemer-recovery

# PostgreSQL logs
kubectl logs -f deployment/postgres -n redeemer-recovery
```

## Database Management

### Access PostgreSQL

```bash
kubectl exec -it deployment/postgres -n redeemer-recovery -- psql -U postgres -d redeemer_recovery
```

### Backup Database

```bash
kubectl exec -it deployment/postgres -n redeemer-recovery -- pg_dump -U postgres redeemer_recovery > backup.sql
```

### Restore Database

```bash
cat backup.sql | kubectl exec -i deployment/postgres -n redeemer-recovery -- psql -U postgres redeemer_recovery
```

## Troubleshooting

### Pods not starting

Check pod status and events:

```bash
kubectl describe pod <pod-name> -n redeemer-recovery
kubectl logs <pod-name> -n redeemer-recovery
```

### Database connection issues

Verify database is ready:

```bash
kubectl exec -it deployment/postgres -n redeemer-recovery -- pg_isready
```

Check database credentials in secret:

```bash
kubectl get secret redeemer-secrets -n redeemer-recovery -o yaml
```

### Migration issues

Run migrations manually:

```bash
kubectl exec -it deployment/server -n redeemer-recovery -- npx prisma migrate deploy
```

## Cleanup

Remove all resources:

```bash
kubectl delete namespace redeemer-recovery
```

Or remove individually:

```bash
kubectl delete -f k8s/
```

## Production Considerations

1. **Secrets Management**: Use a secrets manager (e.g., Sealed Secrets, Vault) instead of plain YAML files
2. **Storage Class**: Update `storageClassName` in `postgres-pvc.yaml` to match your cluster
3. **Resource Limits**: Adjust CPU/memory limits based on your workload
4. **High Availability**: Consider StatefulSet for PostgreSQL with replication
5. **Backups**: Implement automated database backups
6. **Monitoring**: Add Prometheus/Grafana for monitoring
7. **SSL/TLS**: Configure cert-manager for automatic SSL certificates
8. **Environment Variables**: Use different configs for dev/staging/prod
9. **Image Tags**: Use specific version tags instead of `latest`
10. **Health Checks**: Verify liveness/readiness probes are appropriate for your application
