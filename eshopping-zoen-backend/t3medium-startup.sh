#!/bin/bash

# T3.Medium Deployment Script for E-Shopping Zone
# This script optimizes deployment for 4GB RAM constraint

set -e

echo "🚀 Starting E-Shopping Zone deployment on T3.Medium..."

# Check available memory
echo "📊 System Resources:"
free -h
echo ""

# Start core infrastructure first
echo "🔧 Starting core infrastructure..."
docker-compose -f docker-compose.t3medium.yml up -d mysql redis

echo "⏳ Waiting for database to initialize..."
sleep 30

# Check if MySQL is ready
until docker exec mysql-db mysqladmin ping -h"localhost" --silent; do
    echo "Waiting for MySQL..."
    sleep 5
done

echo "✅ MySQL is ready!"

# Start service discovery
echo "🔍 Starting Eureka Server..."
docker-compose -f docker-compose.t3medium.yml up -d eureka-server

echo "⏳ Waiting for Eureka to start..."
sleep 60

# Check if Eureka is ready
until curl -f http://localhost:8761/actuator/health 2>/dev/null; do
    echo "Waiting for Eureka Server..."
    sleep 10
done

echo "✅ Eureka Server is ready!"

# Start core services
echo "🌐 Starting API Gateway and core services..."
docker-compose -f docker-compose.t3medium.yml up -d api-gateway user-service product-service

echo "⏳ Waiting for services to register..."
sleep 45

# Start frontend
echo "🎨 Starting Frontend..."
docker-compose -f docker-compose.t3medium.yml up -d frontend

echo "⏳ Final startup wait..."
sleep 15

# Check status
echo "📋 Deployment Status:"
docker-compose -f docker-compose.t3medium.yml ps

echo ""
echo "📊 Resource Usage:"
docker stats --no-stream

echo ""
echo "🎉 Deployment Complete!"
echo "🌐 Frontend: http://$(curl -s ifconfig.me)"
echo "🔧 API Gateway: http://$(curl -s ifconfig.me):8000"
echo "🔍 Eureka Dashboard: http://$(curl -s ifconfig.me):8761"

echo ""
echo "💡 To add more services (if resources allow):"
echo "docker-compose -f docker-compose.t3medium.yml --profile extended up -d cart-service"

echo ""
echo "📊 Monitor resources with: docker stats"
echo "📋 View logs with: docker-compose -f docker-compose.t3medium.yml logs -f"