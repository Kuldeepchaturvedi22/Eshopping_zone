# 🚀 T3.Medium Deployment Guide

## 📊 T3.Medium Specifications
- **vCPUs**: 2
- **Memory**: 4 GB RAM
- **Network**: Up to 5 Gbps
- **Storage**: EBS-optimized
- **Cost**: ~$30/month

## ⚠️ Resource Optimization for T3.Medium

### **Recommended Architecture for T3.Medium**
```
Single EC2 Instance (t3.medium)
├── Docker Compose Stack
│   ├── Frontend (React) - 256MB
│   ├── API Gateway - 512MB
│   ├── Eureka Server - 512MB
│   ├── User Service - 512MB
│   ├── Product Service - 512MB
│   ├── MySQL Database - 1GB
│   └── Redis Cache - 256MB
└── Total: ~3.5GB (leaving 0.5GB for OS)
```

## 🐳 Optimized Docker Compose for T3.Medium

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: mysql-db
    environment:
      MYSQL_ROOT_PASSWORD: Admin@12345678
      MYSQL_DATABASE: ecommerce
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
    command: --default-authentication-plugin=mysql_native_password --innodb-buffer-pool-size=256M

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis-cache
    ports:
      - "6379:6379"
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    command: redis-server --maxmemory 200mb --maxmemory-policy allkeys-lru

  # Eureka Server
  eureka-server:
    build: ./EurekaServer
    container_name: eureka-server
    ports:
      - "8761:8761"
    environment:
      - SPRING_PROFILES_ACTIVE=t3medium
      - JAVA_OPTS=-Xms256m -Xmx512m -XX:+UseG1GC
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  # API Gateway
  api-gateway:
    build: ./APIGateway
    container_name: api-gateway
    ports:
      - "8000:8000"
    environment:
      - SPRING_PROFILES_ACTIVE=t3medium
      - JAVA_OPTS=-Xms256m -Xmx512m -XX:+UseG1GC
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/
    depends_on:
      - eureka-server
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  # User Service
  user-service:
    build: ./UserService
    container_name: user-service
    ports:
      - "8001:8001"
    environment:
      - SPRING_PROFILES_ACTIVE=t3medium
      - JAVA_OPTS=-Xms256m -Xmx512m -XX:+UseG1GC
      - DB_URL=jdbc:mysql://mysql:3306/userservice?createDatabaseIfNotExist=true
      - DB_USERNAME=root
      - DB_PASSWORD=Admin@12345678
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/
    depends_on:
      - mysql
      - eureka-server
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  # Product Service
  product-service:
    build: ./ProductService
    container_name: product-service
    ports:
      - "8002:8002"
    environment:
      - SPRING_PROFILES_ACTIVE=t3medium
      - JAVA_OPTS=-Xms256m -Xmx512m -XX:+UseG1GC
      - DB_URL=jdbc:mysql://mysql:3306/productservice?createDatabaseIfNotExist=true
      - DB_USERNAME=root
      - DB_PASSWORD=Admin@12345678
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/
    depends_on:
      - mysql
      - eureka-server
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  # Frontend
  frontend:
    build: ./eshopping-zone
    container_name: frontend
    ports:
      - "80:80"
    environment:
      - API_URL=http://localhost:8000
      - APP_NAME=E-Shopping Zone
    depends_on:
      - api-gateway
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M

volumes:
  mysql_data:

networks:
  default:
    driver: bridge
```

## 🛠️ EC2 Setup Commands

### **1. Launch T3.Medium Instance**
```bash
# Launch EC2 instance with Ubuntu 22.04 LTS
# Instance Type: t3.medium
# Storage: 20GB gp3 SSD
# Security Group: Allow ports 22, 80, 8000-8010
```

### **2. Install Dependencies**
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git and other tools
sudo apt install git htop curl -y

# Logout and login again for docker group
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### **3. Deploy Application**
```bash
# Clone repository
git clone https://github.com/your-username/e-shopping-zone.git
cd e-shopping-zone

# Create optimized docker-compose for t3.medium
cp docker-compose.yml docker-compose.t3medium.yml
# Edit with the optimized configuration above

# Start services gradually
docker-compose -f docker-compose.t3medium.yml up -d mysql redis
sleep 30

docker-compose -f docker-compose.t3medium.yml up -d eureka-server
sleep 60

docker-compose -f docker-compose.t3medium.yml up -d api-gateway user-service product-service
sleep 30

docker-compose -f docker-compose.t3medium.yml up -d frontend

# Check status
docker-compose -f docker-compose.t3medium.yml ps
```

## ⚡ Performance Optimizations

### **JVM Optimization for Limited Memory**
```bash
# Add to each service's Dockerfile
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+UseStringDeduplication"
```

### **MySQL Optimization**
```sql
# Add to MySQL configuration
[mysqld]
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
max_connections = 50
query_cache_size = 32M
```

### **Application Properties for T3.Medium**
```properties
# application-t3medium.properties
server.tomcat.max-threads=50
server.tomcat.min-spare-threads=10
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.org.springframework=WARN
```

## 📊 Monitoring Commands

### **Resource Monitoring**
```bash
# Monitor system resources
htop

# Monitor Docker containers
docker stats

# Check memory usage
free -h

# Check disk usage
df -h

# Monitor logs
docker-compose -f docker-compose.t3medium.yml logs -f --tail=50
```

### **Performance Tuning**
```bash
# Optimize swap (if needed)
sudo swapon --show
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to /etc/fstab for persistence
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 🔧 Scaling Strategy for T3.Medium

### **Phase 1: Core Services Only**
```bash
# Start with essential services
docker-compose up -d mysql redis eureka-server api-gateway user-service frontend
```

### **Phase 2: Add Services Gradually**
```bash
# Add more services as needed
docker-compose up -d product-service
# Monitor resources before adding more
```

### **Phase 3: Optimize Based on Usage**
```bash
# Scale down unused services
docker-compose stop notification-service
docker-compose stop payment-service  # If not using payments yet
```

## 💰 Cost Optimization

### **T3.Medium Pricing**
- **On-Demand**: ~$0.0416/hour (~$30/month)
- **Reserved (1 year)**: ~$0.0277/hour (~$20/month)
- **Spot Instance**: ~$0.0125/hour (~$9/month)

### **Additional Costs**
- **EBS Storage (20GB)**: ~$2/month
- **Data Transfer**: ~$1-5/month
- **Total**: ~$22-37/month

## 🚨 Limitations & Considerations

### **What Works Well**
- ✅ Frontend + 2-3 microservices
- ✅ Development and testing
- ✅ Small to medium traffic (100-500 concurrent users)
- ✅ Proof of concept deployments

### **Limitations**
- ⚠️ Limited to 3-4 microservices simultaneously
- ⚠️ No high availability (single instance)
- ⚠️ Memory constraints under heavy load
- ⚠️ Not suitable for production with high traffic

### **When to Upgrade**
- **t3.large (2 vCPU, 8GB RAM)**: For all microservices
- **t3.xlarge (4 vCPU, 16GB RAM)**: For production workloads
- **EKS/ECS**: For true production scalability

## 🎯 Quick Deployment Commands

```bash
# 1. Launch t3.medium EC2 instance
# 2. SSH and install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# 3. Clone and deploy
git clone <your-repo>
cd e-shopping-zone
docker-compose -f docker-compose.t3medium.yml up -d

# 4. Access application
# http://your-ec2-public-ip
```

**Yes, T3.Medium can run your E-Shopping Zone, but with optimized resource allocation for 3-4 core services!** 🚀