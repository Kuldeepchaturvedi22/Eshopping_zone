# 🎨 Frontend Containerization Guide - React + Vite

## 📋 Quick Setup Instructions

### **Step 1: Move Your Frontend**
```bash
# Move your existing React frontend folder to this project
# Your structure should look like:
E-Shopping_zone-master/
├── frontend/                 # Your React + Vite app
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── UserService/
├── ProductService/
├── ...
└── Dockerfile.frontend       # Created above
```

### **Step 2: Update Your Frontend Configuration**

#### **Environment Variables (Create `.env` in frontend folder)**
```env
# Development
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=E-Shopping Zone
VITE_RAZORPAY_KEY=your_razorpay_key

# Production (will be replaced at runtime)
VITE_API_URL=REACT_APP_API_URL_PLACEHOLDER
VITE_APP_NAME=REACT_APP_NAME_PLACEHOLDER
VITE_RAZORPAY_KEY=REACT_APP_RAZORPAY_KEY_PLACEHOLDER
```

#### **Update Vite Config (`vite.config.js`)**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  },
  preview: {
    host: true,
    port: 3000
  }
})
```

#### **API Service Configuration**
```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User APIs
  async login(credentials) {
    return this.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Product APIs
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/products?${queryString}`);
  }

  async getProduct(id) {
    return this.request(`/api/products/${id}`);
  }

  // Cart APIs
  async getCart(userId) {
    return this.request(`/api/cart/${userId}`);
  }

  async addToCart(item) {
    return this.request('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  // Order APIs
  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(userId) {
    return this.request(`/api/orders/user/${userId}`);
  }
}

export default new ApiService();
```

## 🐳 Docker Commands

### **Build Frontend Image**
```bash
# Navigate to your frontend directory
cd frontend

# Copy the Dockerfile
cp ../Dockerfile.frontend ./Dockerfile
cp ../nginx.conf ./
cp ../env.sh ./

# Build the image
docker build -t e-shopping-frontend:latest .

# Run locally for testing
docker run -p 3000:80 \
  -e API_URL=http://localhost:8000 \
  -e APP_NAME="E-Shopping Zone" \
  e-shopping-frontend:latest
```

### **Development with Docker Compose**
```yaml
# Add to your docker-compose.yml
services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - API_URL=http://api-gateway:8000
      - APP_NAME=E-Shopping Zone
      - RAZORPAY_KEY=your_razorpay_key
    depends_on:
      - api-gateway
    networks:
      - microservices-network
```

## ☁️ Cloud Deployment

### **AWS ECR Push**
```bash
# Create ECR repository
aws ecr create-repository --repository-name e-shopping-zone/frontend

# Get login token
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

# Tag and push
docker tag e-shopping-frontend:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone/frontend:latest
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone/frontend:latest
```

### **Kubernetes Deployment**
```bash
# Update image URL in k8s/frontend.yaml
sed -i 's|your-registry|<account-id>.dkr.ecr.us-west-2.amazonaws.com/e-shopping-zone|g' k8s/frontend.yaml

# Deploy to Kubernetes
kubectl apply -f k8s/frontend.yaml

# Check deployment
kubectl get pods -n e-shopping-zone
kubectl get svc frontend -n e-shopping-zone
```

## 🔧 Production Optimizations

### **Performance Features**
- ✅ **Multi-stage build** - Smaller production image
- ✅ **Nginx optimization** - Gzip, caching, security headers
- ✅ **Code splitting** - Vendor and router chunks
- ✅ **Asset caching** - 1-year cache for static assets
- ✅ **Health checks** - Kubernetes health monitoring
- ✅ **Non-root user** - Enhanced security

### **Security Features**
- ✅ **CSP headers** - Content Security Policy
- ✅ **XSS protection** - Cross-site scripting prevention
- ✅ **CORS handling** - Proper API communication
- ✅ **SSL/TLS ready** - HTTPS support with cert-manager

### **Scalability Features**
- ✅ **Horizontal scaling** - Multiple replicas
- ✅ **Load balancing** - Kubernetes service
- ✅ **Resource limits** - CPU and memory constraints
- ✅ **Auto-scaling ready** - HPA compatible

## 🚀 CI/CD Integration

### **GitHub Actions Workflow**
```yaml
# Add to .github/workflows/deploy.yml
  build-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Build application
      run: |
        cd frontend
        npm run build
    
    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        cd frontend
        docker build -t $ECR_REGISTRY/e-shopping-zone/frontend:$IMAGE_TAG .
        docker push $ECR_REGISTRY/e-shopping-zone/frontend:$IMAGE_TAG
```

## 🔍 Monitoring & Debugging

### **Health Check Endpoints**
```bash
# Check application health
curl http://localhost:3000/health

# Check API connectivity
curl http://localhost:3000/api/products

# View nginx logs
docker logs <container-id>
```

### **Performance Monitoring**
```javascript
// Add to your React app for performance monitoring
// src/utils/performance.js
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    
    // Send to monitoring service
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(end - start)
      });
    }
    
    return result;
  };
};
```

## 📱 Mobile Optimization

### **PWA Configuration**
```javascript
// vite.config.js - Add PWA plugin
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'E-Shopping Zone',
        short_name: 'E-Shop',
        description: 'Modern E-commerce Platform',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🎯 Quick Commands Summary

```bash
# 1. Setup frontend in project
mv /path/to/your/frontend ./frontend

# 2. Copy Docker files
cp Dockerfile.frontend frontend/Dockerfile
cp nginx.conf frontend/
cp env.sh frontend/

# 3. Build and test locally
cd frontend
docker build -t e-shopping-frontend .
docker run -p 3000:80 e-shopping-frontend

# 4. Deploy to cloud
kubectl apply -f k8s/frontend.yaml

# 5. Access application
kubectl get svc frontend -n e-shopping-zone
```

**Your React + Vite frontend is now production-ready and cloud-deployable!** 🚀

**Features:**
- ⚡ **Fast builds** with Vite
- 🐳 **Optimized Docker** images
- ☁️ **Cloud-ready** deployment
- 📱 **Mobile-optimized** 
- 🔒 **Security-hardened**
- 📊 **Monitoring-enabled**