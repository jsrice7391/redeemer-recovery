#!/bin/bash

# Cleanup script for Redeemer Recovery Kubernetes deployment
set -e

echo "=== Redeemer Recovery Kubernetes Cleanup ==="
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed"
    exit 1
fi

# Confirm deletion
read -p "This will delete all resources in the 'redeemer-recovery' namespace. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled"
    exit 0
fi

echo ""
echo "Deleting all resources..."

# Delete in reverse order
kubectl delete -f ingress.yaml --ignore-not-found=true
kubectl delete -f client-service.yaml --ignore-not-found=true
kubectl delete -f client-deployment.yaml --ignore-not-found=true
kubectl delete -f server-service.yaml --ignore-not-found=true
kubectl delete -f server-deployment.yaml --ignore-not-found=true
kubectl delete -f postgres-service.yaml --ignore-not-found=true
kubectl delete -f postgres-deployment.yaml --ignore-not-found=true
kubectl delete -f postgres-pvc.yaml --ignore-not-found=true
kubectl delete -f configmap.yaml --ignore-not-found=true
kubectl delete -f secret.yaml --ignore-not-found=true

echo ""
read -p "Delete namespace 'redeemer-recovery'? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    kubectl delete -f namespace.yaml --ignore-not-found=true
    echo "Namespace deleted"
fi

echo ""
echo "=== Cleanup Complete ==="
