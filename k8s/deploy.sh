#!/bin/bash

# Deployment script for Redeemer Recovery Kubernetes cluster
set -e

echo "=== Redeemer Recovery Kubernetes Deployment ==="
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed"
    echo "Install with: brew install kubectl"
    exit 1
fi

# Check if minikube is installed
if ! command -v minikube &> /dev/null; then
    echo "Error: minikube is not installed"
    echo "Install with: brew install minikube"
    exit 1
fi

# Check if Minikube is running
echo "Checking Minikube status..."
if ! minikube status &> /dev/null; then
    echo "Minikube is not running. Starting Minikube..."
    minikube start --driver=docker
    echo "Waiting for Minikube to be ready..."
    sleep 10
else
    echo "Minikube is already running"
fi

# Set context to minikube
echo "Setting kubectl context to minikube..."
kubectl config use-context minikube

# Check cluster connectivity
echo "Checking cluster connectivity..."
if ! kubectl cluster-info &> /dev/null; then
    echo "Error: Cannot connect to Kubernetes cluster"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check Minikube status: minikube status"
    echo "2. Try starting Minikube: minikube start"
    echo "3. Check kubectl config: kubectl config current-context"
    exit 1
fi

echo "Connected to Minikube cluster successfully"
kubectl cluster-info
echo ""

# Enable ingress addon for Minikube
echo "Enabling Minikube ingress addon..."
minikube addons enable ingress

# Check if namespace exists
if kubectl get namespace redeemer-recovery &> /dev/null; then
    echo "Namespace 'redeemer-recovery' already exists"
else
    echo "Creating namespace..."
    kubectl apply -f namespace.yaml
fi

echo ""
echo "Applying configurations..."
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

echo ""
echo "Deploying PostgreSQL..."
kubectl apply -f postgres-pvc.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
echo "Waiting for PostgreSQL to be ready..."

kubectl wait --for=condition=available --timeout=120s deployment/postgres -n redeemer-recovery

echo ""
echo "Deploying Redeemer Recovery application..."
kubectl apply -f app-deployment.yaml
kubectl apply -f app-service.yaml
kubectl apply -f ingress.yaml
echo "Waiting for Redeemer Recovery application to be ready..."

kubectl wait --for=condition=available --timeout=120s deployment/redeemer-recovery-app -n redeemer-recovery
echo ""
echo "Deployment completed successfully!"
echo ""
echo "You can access the Redeemer Recovery application at:"
echo "http://redeemer-recovery.local/"
echo ""