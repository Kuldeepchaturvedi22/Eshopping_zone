# 🚀 Frontend Docker Commands - Quick Reference

## 🐳 Docker Commands for eshopping-zone Frontend

### **Build and Run Locally**
```bash
# Navigate to frontend directory
cd eshopping-zone

# Build Docker image
docker build -t eshopping-frontend:latest .

# Run container locally
docker run -p 3000:80 \
  -e API_URL=http://localhost:8000 \
  -e APP_NAME="E-Shopping Zone" \
  -e RAZORPAY_KEY=your_razorpay_key \
  eshopping-frontend:latest

# Access application
# http://localhost:3000
```

### **Using Docker Compose (Recommended)**
```bash
# Start entire application stack
docker-compose up -d

# Start only frontend with dependencies
docker-compose up -d mysql redis eureka-server api-gateway frontend

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### **Production Build Commands**
```bash
# Build optimized production image
docker build -t eshopping-frontend:prod \
  --target production \
  ./eshopping-zone

# Run with production settings
docker run -d \
  --name eshopping-frontend \
  -p 80:80 \
  -e API_URL=https://your-api-domain.com \
  -e APP_NAME="E-Shopping Zone" \
  -e RAZORPAY_KEY=rzp_live_your_key \
  eshopping-frontend:prod
```

## ☁️ Cloud Deployment Commands

### **AWS ECR Push**
```bash
# Create ECR repository
aws ecr create-repository --repository-name e-shopping-zone/frontend

# Get login token
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin \
  <account-id>.dkr.ecr.us-west-2.amazonaws.com

# Tag and push
docker tag eshopping-frontend:latest \
  <account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone/frontend:latest

docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone/frontend:latest
```

### **Kubernetes Deployment**
```bash
# Update image URL in k8s/frontend.yaml
sed -i 's|your-registry|<account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone|g' k8s/frontend.yaml

# Deploy to Kubernetes
kubectl apply -f k8s/frontend.yaml

# Check status
kubectl get pods -n e-shopping-zone | grep frontend
kubectl get svc frontend -n e-shopping-zone
```

## 🔧 Development Commands

### **Development with Hot Reload**
```bash
# For development, run React dev server directly
cd eshopping-zone
npm install
npm run dev

# Or use Docker with volume mounting
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  node:18-alpine \
  sh -c "cd /app && npm install && npm run dev"
```

### **Environment Configuration**
```bash
# Create .env file in eshopping-zone folder
cat > eshopping-zone/.env << EOF
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=E-Shopping Zone
VITE_RAZORPAY_KEY=rzp_test_your_key
EOF

# For production, use placeholders that will be replaced at runtime
cat > eshopping-zone/.env.production << EOF
VITE_API_URL=VITE_API_URL_PLACEHOLDER
VITE_APP_NAME=VITE_APP_NAME_PLACEHOLDER
VITE_RAZORPAY_KEY=VITE_RAZORPAY_KEY_PLACEHOLDER
EOF
```

## 🔍 Debugging Commands

### **Container Debugging**
```bash
# Check container logs
docker logs eshopping-frontend

# Execute shell in running container
docker exec -it eshopping-frontend sh

# Check nginx configuration
docker exec eshopping-frontend cat /etc/nginx/nginx.conf

# Test health endpoint
curl http://localhost:3000/health
```

### **Network Testing**
```bash
# Test API connectivity from container
docker exec eshopping-frontend curl http://api-gateway:8000/api/products

# Check container network
docker network ls
docker network inspect e-shopping_zone-master_microservices-network
```

## 📊 Monitoring Commands

### **Performance Monitoring**
```bash
# Check container resource usage
docker stats eshopping-frontend

# Monitor nginx access logs
docker exec eshopping-frontend tail -f /var/log/nginx/access.log

# Check application metrics (if implemented)
curl http://localhost:3000/metrics
```

## 🚀 CI/CD Integration

### **GitHub Actions Build**
```yaml
# Add to .github/workflows/deploy.yml
build-frontend:
  runs-on: ubuntu-latest
  steps:
  - uses: actions/checkout@v4
  - name: Build Frontend
    run: |
      cd eshopping-zone
      docker build -t frontend:${{ github.sha }} .
      docker tag frontend:${{ github.sha }} $ECR_REGISTRY/frontend:${{ github.sha }}
      docker push $ECR_REGISTRY/frontend:${{ github.sha }}
```

### **Automated Deployment Script**
```bash
#!/bin/bash
# deploy-frontend.sh

set -e

echo "Building frontend..."
cd eshopping-zone
docker build -t eshopping-frontend:latest .

echo "Pushing to registry..."
docker tag eshopping-frontend:latest $REGISTRY/frontend:latest
docker push $REGISTRY/frontend:latest

echo "Deploying to Kubernetes..."
kubectl set image deployment/frontend frontend=$REGISTRY/frontend:latest -n e-shopping-zone
kubectl rollout status deployment/frontend -n e-shopping-zone

echo "Frontend deployed successfully!"
```

## 🎯 Quick Start Summary

```bash
# 1. Build and run with Docker Compose
docker-compose up -d frontend

# 2. Access application
open http://localhost:3000

# 3. View logs
docker-compose logs -f frontend

# 4. Stop when done
docker-compose down
```

## 📱 Mobile Testing

```bash
# Run on all network interfaces for mobile testing
docker run -p 0.0.0.0:3000:80 \
  -e API_URL=http://your-local-ip:8000 \
  eshopping-frontend:latest

# Access from mobile device
# http://your-local-ip:3000
```

**Your React + Vite frontend is now fully containerized and ready to deploy anywhere!** 🚀