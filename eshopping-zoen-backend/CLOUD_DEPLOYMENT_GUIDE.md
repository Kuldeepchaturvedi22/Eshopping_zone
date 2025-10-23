# 🚀 Cloud Deployment Guide - E-Shopping Zone

## 📋 Prerequisites

### Required Tools
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Install Docker
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

### AWS Account Setup
1. Create AWS account
2. Create IAM user with programmatic access
3. Attach policies: `AmazonEKSClusterPolicy`, `AmazonEKSWorkerNodePolicy`, `AmazonEKS_CNI_Policy`, `AmazonEC2ContainerRegistryFullAccess`

## 🏗️ Deployment Options

### Option 1: AWS EKS (Recommended for Production)

#### Step 1: Infrastructure Setup
```bash
# Clone repository
git clone <your-repo>
cd E-Shopping_zone-master

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-west-2), Output format (json)

# Deploy infrastructure with Terraform
cd terraform
terraform init
terraform plan
terraform apply -var="db_password=YourSecurePassword123!"
```

#### Step 2: Build and Push Docker Images
```bash
# Create ECR repositories
aws ecr create-repository --repository-name e-shopping-zone/user-service
aws ecr create-repository --repository-name e-shopping-zone/product-service
aws ecr create-repository --repository-name e-shopping-zone/api-gateway
aws ecr create-repository --repository-name e-shopping-zone/eureka-server

# Get ECR login token
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

# Build and push images
cd UserService
mvn clean package -DskipTests
docker build -t <account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone/user-service:latest .
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone/user-service:latest

# Repeat for other services...
```

#### Step 3: Deploy to Kubernetes
```bash
# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name e-shopping-zone

# Update image URLs in k8s manifests
sed -i 's|your-registry|<account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone|g' k8s/*.yaml

# Deploy applications
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/eureka-server.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/hpa.yaml

# Check deployment status
kubectl get pods -n e-shopping-zone
kubectl get services -n e-shopping-zone
```

### Option 2: Google Cloud Platform (GKE)

#### Step 1: Setup GCP
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Create GKE cluster
gcloud container clusters create e-shopping-zone \
    --zone=us-central1-a \
    --num-nodes=3 \
    --enable-autoscaling \
    --min-nodes=2 \
    --max-nodes=10

# Get credentials
gcloud container clusters get-credentials e-shopping-zone --zone=us-central1-a
```

#### Step 2: Deploy to GKE
```bash
# Build and push to Google Container Registry
gcloud auth configure-docker

# Tag and push images
docker tag user-service:latest gcr.io/your-project-id/user-service:latest
docker push gcr.io/your-project-id/user-service:latest

# Update k8s manifests for GCR
sed -i 's|your-registry|gcr.io/your-project-id|g' k8s/*.yaml

# Deploy
kubectl apply -f k8s/
```

### Option 3: Azure Kubernetes Service (AKS)

#### Step 1: Setup Azure
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login and create resource group
az login
az group create --name e-shopping-zone-rg --location eastus

# Create AKS cluster
az aks create \
    --resource-group e-shopping-zone-rg \
    --name e-shopping-zone \
    --node-count 3 \
    --enable-addons monitoring \
    --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group e-shopping-zone-rg --name e-shopping-zone
```

## 🔧 Configuration Management

### Environment Variables Setup
```bash
# Create secrets in Kubernetes
kubectl create secret generic mysql-secret \
  --from-literal=password='YourSecurePassword123!' \
  -n e-shopping-zone

kubectl create secret generic app-secrets \
  --from-literal=jwt-secret='your-jwt-secret-here' \
  --from-literal=razorpay-key='your-razorpay-key' \
  --from-literal=razorpay-secret='your-razorpay-secret' \
  -n e-shopping-zone
```

### Database Migration
```bash
# Connect to MySQL pod
kubectl exec -it mysql-<pod-id> -n e-shopping-zone -- mysql -u root -p

# Create databases
CREATE DATABASE userservice;
CREATE DATABASE productservice;
CREATE DATABASE cartservice;
CREATE DATABASE orderservice;
CREATE DATABASE paymentservice;
```

## 📊 Monitoring Setup

### Prometheus & Grafana
```bash
# Install Prometheus using Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
# Username: admin, Password: prom-operator
```

### Application Monitoring
```bash
# Check application health
kubectl get pods -n e-shopping-zone
kubectl logs -f deployment/user-service -n e-shopping-zone

# Check metrics
kubectl port-forward svc/user-service 8001:8001 -n e-shopping-zone
curl http://localhost:8001/actuator/health
curl http://localhost:8001/actuator/prometheus
```

## 🔒 Security Best Practices

### 1. Network Security
- Use private subnets for databases
- Implement security groups/network policies
- Enable VPC flow logs

### 2. Secrets Management
```bash
# Use AWS Secrets Manager (for AWS)
aws secretsmanager create-secret --name e-shopping-zone/jwt-secret --secret-string "your-jwt-secret"

# Update Kubernetes to use external secrets
kubectl apply -f https://raw.githubusercontent.com/external-secrets/external-secrets/main/deploy/crds/bundle.yaml
```

### 3. RBAC Configuration
```yaml
# Create service account with limited permissions
apiVersion: v1
kind: ServiceAccount
metadata:
  name: e-shopping-zone-sa
  namespace: e-shopping-zone
```

## 🚀 CI/CD Pipeline Setup

### GitHub Actions (Automated)
1. Fork the repository
2. Add secrets in GitHub:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `DB_PASSWORD`
3. Push to main branch triggers deployment

### Manual Deployment Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "Building applications..."
cd UserService && mvn clean package -DskipTests && cd ..
cd ProductService && mvn clean package -DskipTests && cd ..

echo "Building Docker images..."
docker build -t user-service:latest UserService/
docker build -t product-service:latest ProductService/

echo "Deploying to Kubernetes..."
kubectl apply -f k8s/

echo "Waiting for deployment..."
kubectl rollout status deployment/user-service -n e-shopping-zone
kubectl rollout status deployment/api-gateway -n e-shopping-zone

echo "Deployment complete!"
kubectl get services -n e-shopping-zone
```

## 🔍 Troubleshooting

### Common Issues
```bash
# Check pod logs
kubectl logs -f pod/<pod-name> -n e-shopping-zone

# Check events
kubectl get events -n e-shopping-zone --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods -n e-shopping-zone
kubectl top nodes

# Debug networking
kubectl exec -it <pod-name> -n e-shopping-zone -- nslookup mysql-service
```

### Performance Optimization
```bash
# Scale deployments
kubectl scale deployment user-service --replicas=5 -n e-shopping-zone

# Check HPA status
kubectl get hpa -n e-shopping-zone

# Monitor resource usage
kubectl describe hpa user-service-hpa -n e-shopping-zone
```

## 💰 Cost Optimization

### AWS Cost Savings
- Use Spot Instances for non-critical workloads
- Implement cluster autoscaler
- Use RDS reserved instances
- Enable S3 lifecycle policies

### Resource Limits
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "125m"
  limits:
    memory: "512Mi"
    cpu: "250m"
```

## 📈 Scaling Strategy

### Horizontal Scaling
- HPA based on CPU/Memory
- Custom metrics scaling
- Predictive scaling

### Vertical Scaling
- VPA for automatic resource adjustment
- Node auto-provisioning

## 🔄 Backup & Recovery

### Database Backup
```bash
# Automated RDS backups (AWS)
# Point-in-time recovery enabled
# Cross-region backup replication

# Manual backup
kubectl exec mysql-pod -- mysqldump -u root -p --all-databases > backup.sql
```

### Application State
- Stateless application design
- External configuration management
- Persistent volume backups

---

## 🎯 Quick Start Commands

```bash
# 1. Setup infrastructure
cd terraform && terraform apply

# 2. Build and deploy
./deploy.sh

# 3. Access application
kubectl get svc api-gateway -n e-shopping-zone
# Use EXTERNAL-IP to access your application
```

**Estimated Deployment Time:** 30-45 minutes
**Monthly Cost (AWS):** $150-300 (depending on usage)
**Scalability:** 2-100 pods automatically