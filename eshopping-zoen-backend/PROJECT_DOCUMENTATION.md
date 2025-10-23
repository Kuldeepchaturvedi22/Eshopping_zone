# 🛒 E-Shopping Zone - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Microservices Details](#microservices-details)
4. [Technology Stack](#technology-stack)
5. [Database Design](#database-design)
6. [API Documentation](#api-documentation)
7. [Security Implementation](#security-implementation)
8. [Development Setup](#development-setup)
9. [Cloud Deployment](#cloud-deployment)
10. [Monitoring & Observability](#monitoring--observability)
11. [Testing Strategy](#testing-strategy)
12. [Performance Optimization](#performance-optimization)
13. [Troubleshooting](#troubleshooting)
14. [Contributing Guidelines](#contributing-guidelines)

---

## 🎯 Project Overview

### **What is E-Shopping Zone?**
E-Shopping Zone is a comprehensive microservices-based e-commerce platform built with Spring Boot and Spring Cloud. It provides a scalable, cloud-ready solution for online retail operations with modern architecture patterns.

### **Key Features**
- 🛍️ **Product Management**: Catalog, inventory, pricing
- 👥 **User Management**: Registration, authentication, profiles
- 🛒 **Shopping Cart**: Add, remove, modify items
- 📦 **Order Processing**: Order creation, tracking, fulfillment
- 💳 **Payment Integration**: Razorpay payment gateway
- 📧 **Notifications**: Email, SMS notifications
- 🔐 **Security**: JWT-based authentication, OAuth2
- 📊 **Monitoring**: Prometheus, Grafana dashboards
- ☁️ **Cloud Ready**: Kubernetes, Docker, CI/CD

### **Business Capabilities**
- Multi-tenant architecture support
- Real-time inventory management
- Automated order processing
- Payment gateway integration
- Customer notification system
- Admin dashboard and analytics
- Mobile-responsive design

---

## 🏗️ Architecture

### **Microservices Architecture Pattern**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile App     │    │  Admin Panel    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      API Gateway          │
                    │    (Spring Cloud)         │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
    ┌─────┴─────┐         ┌─────┴─────┐         ┌─────┴─────┐
    │  Eureka   │         │   Config  │         │   Auth    │
    │  Server   │         │  Server   │         │  Service  │
    └───────────┘         └───────────┘         └───────────┘
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    │                             │                             │
┌───┴────┐  ┌────────┐  ┌────────┐  ┌─────────┐  ┌──────────┐
│ User   │  │Product │  │ Cart   │  │ Order   │  │ Payment  │
│Service │  │Service │  │Service │  │ Service │  │ Service  │
└────────┘  └────────┘  └────────┘  └─────────┘  └──────────┘
    │           │           │           │           │
┌───┴────┐  ┌───┴────┐  ┌───┴────┐  ┌───┴────┐  ┌───┴────┐
│ MySQL  │  │ MySQL  │  │ Redis  │  │ MySQL  │  │ MySQL  │
│   DB   │  │   DB   │  │ Cache  │  │   DB   │  │   DB   │
└────────┘  └────────┘  └────────┘  └────────┘  └────────┘
```

### **Service Communication**
- **Synchronous**: REST APIs via Feign Client
- **Asynchronous**: Message queues (RabbitMQ/Kafka)
- **Service Discovery**: Netflix Eureka
- **Load Balancing**: Spring Cloud LoadBalancer
- **Circuit Breaker**: Resilience4j (planned)

### **Data Management**
- **Database per Service**: Each microservice owns its data
- **Event Sourcing**: For order and payment events
- **CQRS**: Command Query Responsibility Segregation
- **Distributed Transactions**: Saga pattern implementation

---

## 🔧 Microservices Details

### **1. Eureka Server (Service Discovery)**
```yaml
Port: 8761
Purpose: Service registration and discovery
Technology: Spring Cloud Netflix Eureka
Dependencies: None (standalone)
```

**Key Features:**
- Service registration and health monitoring
- Load balancing support
- Failover capabilities
- Dashboard for service monitoring

**Configuration:**
```properties
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

### **2. API Gateway**
```yaml
Port: 8000
Purpose: Single entry point, routing, cross-cutting concerns
Technology: Spring Cloud Gateway
Dependencies: Eureka Server
```

**Key Features:**
- Request routing to microservices
- Load balancing
- Rate limiting
- CORS handling
- Authentication/Authorization
- Request/Response transformation

**Routes Configuration:**
```yaml
spring.cloud.gateway.routes:
  - id: user-service
    uri: lb://USERSERVICE
    predicates:
      - Path=/api/users/**
  - id: product-service
    uri: lb://PRODUCTSERVICE
    predicates:
      - Path=/api/products/**
```

### **3. User Service**
```yaml
Port: 8001
Purpose: User management, authentication
Technology: Spring Boot, Spring Security, JWT
Database: MySQL (userservice)
```

**Entities:**
```java
@Entity
public class User {
    private Long id;
    private String username;
    private String email;
    private String password; // BCrypt encrypted
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Set<Role> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
}

@Entity
public class Role {
    private Long id;
    private String name; // ADMIN, USER, SELLER
    private String description;
}
```

**Key APIs:**
```http
POST /api/users/register     # User registration
POST /api/users/login        # User authentication
GET  /api/users/profile      # Get user profile
PUT  /api/users/profile      # Update profile
POST /api/users/forgot-password
POST /api/users/reset-password
```

**Security Features:**
- JWT token-based authentication
- Password encryption (BCrypt)
- Role-based access control (RBAC)
- Account lockout mechanism
- Password policy enforcement

### **4. Product Service**
```yaml
Port: 8002
Purpose: Product catalog management
Technology: Spring Boot, Spring Data JPA
Database: MySQL (productservice)
```

**Entities:**
```java
@Entity
public class Product {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String category;
    private String brand;
    private String imageUrl;
    private String sku;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Entity
public class Category {
    private Long id;
    private String name;
    private String description;
    private String parentCategory;
}
```

**Key APIs:**
```http
GET    /api/products              # Get all products
GET    /api/products/{id}         # Get product by ID
POST   /api/products              # Create product (Admin)
PUT    /api/products/{id}         # Update product (Admin)
DELETE /api/products/{id}         # Delete product (Admin)
GET    /api/products/search       # Search products
GET    /api/products/category/{category}
```

**Features:**
- Product catalog management
- Category-based organization
- Search and filtering
- Inventory tracking
- Image management
- Price management

### **5. Cart Service**
```yaml
Port: 8003
Purpose: Shopping cart management
Technology: Spring Boot, Redis (caching)
Database: MySQL + Redis Cache
```

**Entities:**
```java
@Entity
public class Cart {
    private Long id;
    private Long userId;
    private List<CartItem> items;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Entity
public class CartItem {
    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}
```

**Key APIs:**
```http
GET    /api/cart/{userId}         # Get user cart
POST   /api/cart/add              # Add item to cart
PUT    /api/cart/update           # Update cart item
DELETE /api/cart/remove/{itemId}  # Remove item
DELETE /api/cart/clear/{userId}   # Clear cart
```

**Features:**
- Session-based cart management
- Redis caching for performance
- Real-time price updates
- Quantity management
- Cart persistence

### **6. Order Service**
```yaml
Port: 8004
Purpose: Order processing and management
Technology: Spring Boot, Spring Data JPA
Database: MySQL (orderservice)
```

**Entities:**
```java
@Entity
public class Order {
    private Long id;
    private String orderNumber;
    private Long userId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String shippingAddress;
    private String billingAddress;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
}

@Entity
public class OrderItem {
    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}

public enum OrderStatus {
    PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}
```

**Key APIs:**
```http
POST   /api/orders               # Create order
GET    /api/orders/{id}          # Get order details
GET    /api/orders/user/{userId} # Get user orders
PUT    /api/orders/{id}/status   # Update order status
GET    /api/orders/track/{orderNumber}
```

**Features:**
- Order creation and processing
- Order status tracking
- Order history
- Inventory reservation
- Integration with payment service

### **7. Payment Service**
```yaml
Port: 8005
Purpose: Payment processing
Technology: Spring Boot, Razorpay Integration
Database: MySQL (paymentservice)
```

**Entities:**
```java
@Entity
public class Payment {
    private Long id;
    private String paymentId;
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String paymentMethod;
    private String transactionId;
    private LocalDateTime paymentDate;
    private String razorpayOrderId;
    private String razorpayPaymentId;
}

public enum PaymentStatus {
    PENDING, SUCCESS, FAILED, REFUNDED
}
```

**Key APIs:**
```http
POST   /api/payments/create      # Create payment order
POST   /api/payments/verify      # Verify payment
GET    /api/payments/{id}        # Get payment details
POST   /api/payments/refund      # Process refund
```

**Features:**
- Razorpay integration
- Payment verification
- Refund processing
- Payment history
- Webhook handling

### **8. Notification Service**
```yaml
Port: 8006
Purpose: Email and SMS notifications
Technology: Spring Boot, JavaMailSender
Dependencies: SMTP Server, SMS Gateway
```

**Key APIs:**
```http
POST /api/notifications/email    # Send email
POST /api/notifications/sms      # Send SMS
GET  /api/notifications/history  # Notification history
```

**Features:**
- Email notifications (order confirmation, shipping updates)
- SMS notifications
- Template-based messaging
- Notification history
- Retry mechanism

---

## 💻 Technology Stack

### **Backend Technologies**
```yaml
Framework: Spring Boot 3.4.4
Language: Java 17
Build Tool: Maven 3.9+
Service Discovery: Netflix Eureka
API Gateway: Spring Cloud Gateway
Security: Spring Security + JWT
Database: MySQL 8.0
Caching: Redis 7.0
Message Queue: RabbitMQ (planned)
```

### **Cloud & DevOps**
```yaml
Containerization: Docker
Orchestration: Kubernetes
Cloud Providers: AWS EKS, Google GKE, Azure AKS
Infrastructure: Terraform
CI/CD: GitHub Actions
Monitoring: Prometheus + Grafana
Logging: ELK Stack (planned)
```

### **Development Tools**
```yaml
IDE: IntelliJ IDEA / VS Code
API Testing: Postman / Swagger UI
Database: MySQL Workbench
Version Control: Git
Code Quality: SonarQube (planned)
```

### **Dependencies Overview**
```xml
<!-- Core Spring Boot -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Cloud -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>

<!-- Database -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>

<!-- Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
</dependency>

<!-- Monitoring -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

---

## 🗄️ Database Design

### **Database Strategy**
- **Database per Service**: Each microservice has its own database
- **Data Consistency**: Eventual consistency with event-driven architecture
- **Transactions**: Saga pattern for distributed transactions

### **User Service Database**
```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- User roles mapping
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

### **Product Service Database**
```sql
-- Categories table
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id BIGINT,
    brand VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
```

### **Order Service Database**
```sql
-- Orders table
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'),
    shipping_address TEXT,
    billing_address TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP NULL
);

-- Order items table
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

---

## 📚 API Documentation

### **Authentication APIs**
```http
# User Registration
POST /api/users/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
}

Response: 201 Created
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z"
}

# User Login
POST /api/users/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "SecurePass123!"
}

Response: 200 OK
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "expiresIn": 86400,
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
    }
}
```

### **Product APIs**
```http
# Get All Products
GET /api/products?page=0&size=10&sort=name,asc
Authorization: Bearer {token}

Response: 200 OK
{
    "content": [
        {
            "id": 1,
            "name": "iPhone 15 Pro",
            "description": "Latest iPhone with advanced features",
            "price": 999.99,
            "stockQuantity": 50,
            "category": "Electronics",
            "brand": "Apple",
            "imageUrl": "https://example.com/iphone15.jpg",
            "sku": "IPH15PRO001"
        }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 0
}

# Create Product (Admin only)
POST /api/products
Authorization: Bearer {admin-token}
Content-Type: application/json

{
    "name": "Samsung Galaxy S24",
    "description": "Latest Samsung flagship phone",
    "price": 899.99,
    "stockQuantity": 30,
    "categoryId": 1,
    "brand": "Samsung",
    "sku": "SGS24001"
}
```

### **Cart APIs**
```http
# Add Item to Cart
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
    "productId": 1,
    "quantity": 2
}

Response: 200 OK
{
    "id": 1,
    "userId": 1,
    "items": [
        {
            "id": 1,
            "productId": 1,
            "productName": "iPhone 15 Pro",
            "price": 999.99,
            "quantity": 2,
            "subtotal": 1999.98
        }
    ],
    "totalAmount": 1999.98
}

# Get User Cart
GET /api/cart/{userId}
Authorization: Bearer {token}

Response: 200 OK
{
    "id": 1,
    "userId": 1,
    "items": [...],
    "totalAmount": 1999.98,
    "itemCount": 2
}
```

### **Order APIs**
```http
# Create Order
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
    "items": [
        {
            "productId": 1,
            "quantity": 2,
            "price": 999.99
        }
    ],
    "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
    },
    "paymentMethod": "RAZORPAY"
}

Response: 201 Created
{
    "id": 1,
    "orderNumber": "ORD-2024-001",
    "userId": 1,
    "totalAmount": 1999.98,
    "status": "PENDING",
    "orderDate": "2024-01-15T10:30:00Z",
    "items": [...]
}
```

### **Payment APIs**
```http
# Create Payment Order
POST /api/payments/create
Authorization: Bearer {token}
Content-Type: application/json

{
    "orderId": 1,
    "amount": 1999.98,
    "currency": "INR"
}

Response: 200 OK
{
    "razorpayOrderId": "order_xyz123",
    "amount": 199998,
    "currency": "INR",
    "keyId": "rzp_test_xyz"
}

# Verify Payment
POST /api/payments/verify
Authorization: Bearer {token}
Content-Type: application/json

{
    "razorpayOrderId": "order_xyz123",
    "razorpayPaymentId": "pay_abc456",
    "razorpaySignature": "signature_hash"
}
```

---

## 🔐 Security Implementation

### **Authentication & Authorization**
```java
// JWT Token Configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                .requestMatchers("/api/cart/**").hasRole("USER")
                .requestMatchers("/api/orders/**").hasRole("USER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}

// JWT Token Service
@Service
public class JwtTokenService {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400}")
    private int jwtExpirationInSeconds;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInSeconds * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}
```

### **Password Security**
```java
@Configuration
public class PasswordConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
    
    @Bean
    public PasswordValidator passwordValidator() {
        return new PasswordValidator(Arrays.asList(
            new LengthRule(8, 30),
            new CharacterRule(EnglishCharacterData.UpperCase, 1),
            new CharacterRule(EnglishCharacterData.LowerCase, 1),
            new CharacterRule(EnglishCharacterData.Digit, 1),
            new CharacterRule(EnglishCharacterData.Special, 1),
            new WhitespaceRule()
        ));
    }
}
```

### **API Security Headers**
```java
@Component
public class SecurityHeadersFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Security headers
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        httpResponse.setHeader("X-Frame-Options", "DENY");
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        httpResponse.setHeader("Strict-Transport-Security", 
            "max-age=31536000; includeSubDomains");
        httpResponse.setHeader("Content-Security-Policy", 
            "default-src 'self'; script-src 'self' 'unsafe-inline'");
        
        chain.doFilter(request, response);
    }
}
```

---

## 🚀 Development Setup

### **Prerequisites**
```bash
# Required Software
Java 17+
Maven 3.9+
MySQL 8.0+
Redis 7.0+
Docker & Docker Compose
Git
IDE (IntelliJ IDEA/VS Code)
```

### **Local Development Setup**
```bash
# 1. Clone Repository
git clone https://github.com/your-username/e-shopping-zone.git
cd e-shopping-zone

# 2. Start Infrastructure Services
docker-compose up -d mysql redis

# 3. Create Databases
mysql -u root -p
CREATE DATABASE userservice;
CREATE DATABASE productservice;
CREATE DATABASE cartservice;
CREATE DATABASE orderservice;
CREATE DATABASE paymentservice;

# 4. Start Eureka Server
cd EurekaServer
mvn spring-boot:run

# 5. Start API Gateway
cd ../APIGateway
mvn spring-boot:run

# 6. Start Microservices (in separate terminals)
cd ../UserService && mvn spring-boot:run
cd ../ProductService && mvn spring-boot:run
cd ../CartService && mvn spring-boot:run
cd ../OrderService && mvn spring-boot:run
cd ../PaymentService && mvn spring-boot:run
cd ../NotificationService && mvn spring-boot:run
```

### **Environment Configuration**
```properties
# application-dev.properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/userservice
spring.datasource.username=root
spring.datasource.password=your-password

# Redis Configuration
spring.redis.host=localhost
spring.redis.port=6379

# JWT Configuration
jwt.secret=your-jwt-secret-key
jwt.expiration=86400

# Razorpay Configuration
razorpay.key.id=your-razorpay-key
razorpay.key.secret=your-razorpay-secret

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### **IDE Configuration**
```xml
<!-- Maven settings.xml -->
<settings>
    <profiles>
        <profile>
            <id>dev</id>
            <properties>
                <spring.profiles.active>dev</spring.profiles.active>
            </properties>
        </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>dev</activeProfile>
    </activeProfiles>
</settings>
```

---

## ☁️ Cloud Deployment

### **Kubernetes Deployment**
```yaml
# Complete deployment command
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/eureka-server.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/product-service.yaml
kubectl apply -f k8s/cart-service.yaml
kubectl apply -f k8s/order-service.yaml
kubectl apply -f k8s/payment-service.yaml
kubectl apply -f k8s/notification-service.yaml
kubectl apply -f k8s/hpa.yaml
```

### **AWS EKS Deployment**
```bash
# 1. Setup Infrastructure
cd terraform
terraform init
terraform apply -var="db_password=YourSecurePassword123!"

# 2. Configure kubectl
aws eks update-kubeconfig --region us-west-2 --name e-shopping-zone

# 3. Build and Push Images
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

# Build all services
./build-all-services.sh

# 4. Deploy to EKS
kubectl apply -f k8s/

# 5. Get Load Balancer URL
kubectl get svc api-gateway -n e-shopping-zone
```

### **CI/CD Pipeline (GitHub Actions)**
```yaml
# Automatic deployment on push to main branch
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Build and Test
        run: |
          mvn clean test
          mvn package -DskipTests
      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --name e-shopping-zone
          kubectl apply -f k8s/
```

### **Monitoring Setup**
```bash
# Install Prometheus and Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Access Grafana Dashboard
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
# Username: admin, Password: prom-operator
```

---

## 📊 Monitoring & Observability

### **Metrics Collection**
```java
// Custom metrics in services
@RestController
public class UserController {
    
    private final MeterRegistry meterRegistry;
    private final Counter userRegistrationCounter;
    private final Timer loginTimer;
    
    public UserController(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.userRegistrationCounter = Counter.builder("user.registrations")
            .description("Number of user registrations")
            .register(meterRegistry);
        this.loginTimer = Timer.builder("user.login.duration")
            .description("User login duration")
            .register(meterRegistry);
    }
    
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRegistrationRequest request) {
        userRegistrationCounter.increment();
        // Registration logic
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return loginTimer.recordCallable(() -> {
            // Login logic
            return ResponseEntity.ok(loginResponse);
        });
    }
}
```

### **Health Checks**
```java
// Custom health indicators
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                return Health.up()
                    .withDetail("database", "MySQL")
                    .withDetail("status", "Connected")
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("database", "MySQL")
                .withDetail("error", e.getMessage())
                .build();
        }
        return Health.down().build();
    }
}
```

### **Logging Configuration**
```xml
<!-- logback-spring.xml -->
<configuration>
    <springProfile name="!k8s">
        <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
            <encoder>
                <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
    </springProfile>
    
    <springProfile name="k8s">
        <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <timestamp/>
                    <logLevel/>
                    <loggerName/>
                    <message/>
                    <mdc/>
                    <stackTrace/>
                </providers>
            </encoder>
        </appender>
    </springProfile>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```

### **Distributed Tracing**
```java
// Tracing configuration
@Configuration
public class TracingConfig {
    
    @Bean
    public Sender sender() {
        return OkHttpSender.create("http://jaeger-collector:14268/api/traces");
    }
    
    @Bean
    public AsyncReporter<Span> spanReporter() {
        return AsyncReporter.create(sender());
    }
    
    @Bean
    public Tracing tracing() {
        return Tracing.newBuilder()
            .localServiceName("user-service")
            .spanReporter(spanReporter())
            .sampler(Sampler.create(1.0f))
            .build();
    }
}
```

---

## 🧪 Testing Strategy

### **Unit Testing**
```java
// Service layer unit tests
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void shouldCreateUserSuccessfully() {
        // Given
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("testuser");
        
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        // When
        User result = userService.createUser(request);
        
        // Then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUsername()).isEqualTo("testuser");
        verify(userRepository).save(any(User.class));
    }
}
```

### **Integration Testing**
```java
// Integration tests with TestContainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class UserServiceIntegrationTest {
    
    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldRegisterUserEndToEnd() {
        // Given
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("integrationtest");
        request.setEmail("integration@test.com");
        request.setPassword("password123");
        
        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
            "/api/users/register", request, User.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getUsername()).isEqualTo("integrationtest");
        
        // Verify in database
        Optional<User> savedUser = userRepository.findByUsername("integrationtest");
        assertThat(savedUser).isPresent();
    }
}
```

### **Contract Testing**
```java
// Consumer contract test
@ExtendWith(PactConsumerTestExt.class)
@PactTestFor(providerName = "product-service")
class ProductServiceContractTest {
    
    @Pact(consumer = "cart-service")
    public RequestResponsePact getProductById(PactDslWithProvider builder) {
        return builder
            .given("product with id 1 exists")
            .uponReceiving("a request for product with id 1")
            .path("/api/products/1")
            .method("GET")
            .willRespondWith()
            .status(200)
            .headers(Map.of("Content-Type", "application/json"))
            .body(new PactDslJsonBody()
                .numberType("id", 1)
                .stringType("name", "iPhone 15")
                .decimalType("price", 999.99))
            .toPact();
    }
    
    @Test
    @PactTestFor(pactMethod = "getProductById")
    void testGetProductById(MockServer mockServer) {
        // Test implementation
    }
}
```

### **Performance Testing**
```java
// JMeter test plan (programmatic)
@Test
void performanceTest() {
    TestPlanTree testPlanTree = TestPlan.testPlan("E-Shopping Performance Test")
        .children(
            ThreadGroup.threadGroup("User Registration Load", 100, Duration.ofMinutes(5))
                .children(
                    HttpSampler.httpSampler("Register User", "http://localhost:8000")
                        .post("/api/users/register", "application/json")
                        .body("${userRegistrationJson}")
                ),
            ThreadGroup.threadGroup("Product Search Load", 200, Duration.ofMinutes(5))
                .children(
                    HttpSampler.httpSampler("Search Products", "http://localhost:8000")
                        .get("/api/products/search?q=phone")
                )
        );
    
    // Execute test plan
    InfluxDbBackendListener influxDbListener = InfluxDbBackendListener.builder()
        .url("http://localhost:8086")
        .database("jmeter")
        .build();
    
    JMeterEngine.runTestPlan(testPlanTree, influxDbListener);
}
```

---

## ⚡ Performance Optimization

### **Database Optimization**
```java
// Connection pool configuration
@Configuration
public class DatabaseConfig {
    
    @Bean
    @ConfigurationProperties("spring.datasource.hikari")
    public HikariConfig hikariConfig() {
        HikariConfig config = new HikariConfig();
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(20000);
        config.setIdleTimeout(300000);
        config.setMaxLifetime(1200000);
        config.setLeakDetectionThreshold(60000);
        return config;
    }
}

// JPA optimization
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_category", columnList = "category_id"),
    @Index(name = "idx_product_price", columnList = "price"),
    @Index(name = "idx_product_brand", columnList = "brand")
})
public class Product {
    // Entity definition
}

// Query optimization
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    Page<Product> findByCategoryAndActive(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query(value = "SELECT * FROM products p WHERE MATCH(p.name, p.description) AGAINST(?1 IN NATURAL LANGUAGE MODE)", 
           nativeQuery = true)
    List<Product> searchProducts(String searchTerm);
}
```

### **Caching Strategy**
```java
// Redis caching configuration
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .build();
    }
}

// Service layer caching
@Service
public class ProductService {
    
    @Cacheable(value = "products", key = "#id")
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException("Product not found"));
    }
    
    @CacheEvict(value = "products", key = "#product.id")
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }
    
    @Cacheable(value = "product-search", key = "#searchTerm + '_' + #pageable.pageNumber")
    public Page<Product> searchProducts(String searchTerm, Pageable pageable) {
        return productRepository.searchProducts(searchTerm, pageable);
    }
}
```

### **Async Processing**
```java
// Async configuration
@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

// Async service methods
@Service
public class NotificationService {
    
    @Async("taskExecutor")
    public CompletableFuture<Void> sendOrderConfirmationEmail(Order order) {
        // Email sending logic
        emailService.sendOrderConfirmation(order);
        return CompletableFuture.completedFuture(null);
    }
    
    @Async("taskExecutor")
    public CompletableFuture<Void> sendSMSNotification(String phoneNumber, String message) {
        // SMS sending logic
        smsService.sendSMS(phoneNumber, message);
        return CompletableFuture.completedFuture(null);
    }
}
```

---

## 🔧 Troubleshooting

### **Common Issues & Solutions**

#### **Service Discovery Issues**
```bash
# Problem: Services not registering with Eureka
# Solution: Check Eureka configuration
kubectl logs eureka-server-pod -n e-shopping-zone

# Verify service registration
curl http://eureka-server:8761/eureka/apps

# Check network connectivity
kubectl exec -it user-service-pod -- nslookup eureka-server
```

#### **Database Connection Issues**
```bash
# Problem: Cannot connect to MySQL
# Solution: Check database connectivity
kubectl exec -it mysql-pod -- mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check connection pool
curl http://user-service:8001/actuator/health
```

#### **Memory Issues**
```bash
# Problem: OutOfMemoryError
# Solution: Adjust JVM settings in Dockerfile
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

# Monitor memory usage
kubectl top pods -n e-shopping-zone

# Check heap dump
kubectl exec -it user-service-pod -- jcmd 1 GC.run_finalization
```

#### **Performance Issues**
```bash
# Problem: Slow response times
# Solution: Check metrics
curl http://user-service:8001/actuator/prometheus | grep http_server_requests

# Check database queries
# Enable SQL logging in application.properties
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG

# Monitor connection pool
curl http://user-service:8001/actuator/metrics/hikaricp.connections.active
```

### **Debugging Commands**
```bash
# Check pod status
kubectl get pods -n e-shopping-zone

# View pod logs
kubectl logs -f deployment/user-service -n e-shopping-zone

# Execute commands in pod
kubectl exec -it user-service-pod -n e-shopping-zone -- /bin/bash

# Port forward for local access
kubectl port-forward svc/user-service 8001:8001 -n e-shopping-zone

# Check service endpoints
kubectl get endpoints -n e-shopping-zone

# Describe pod for events
kubectl describe pod user-service-pod -n e-shopping-zone

# Check resource usage
kubectl top pods -n e-shopping-zone
kubectl top nodes
```

### **Monitoring & Alerting**
```yaml
# Prometheus alerting rules
groups:
- name: e-shopping-zone-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_server_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      
  - alert: HighMemoryUsage
    expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage detected"
```

---

## 🤝 Contributing Guidelines

### **Development Workflow**
```bash
# 1. Fork the repository
git clone https://github.com/your-username/e-shopping-zone.git

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 4. Push and create PR
git push origin feature/new-feature
```

### **Code Standards**
```java
// Follow Java naming conventions
public class UserService {
    private final UserRepository userRepository;
    
    // Use constructor injection
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // Use meaningful method names
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }
}
```

### **Commit Message Format**
```
feat: add user registration endpoint
fix: resolve database connection issue
docs: update API documentation
test: add unit tests for user service
refactor: improve error handling
style: format code according to standards
```

### **Pull Request Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

---

## 📈 Roadmap & Future Enhancements

### **Phase 1: Core Features (Completed)**
- ✅ Basic microservices architecture
- ✅ User management and authentication
- ✅ Product catalog management
- ✅ Shopping cart functionality
- ✅ Order processing
- ✅ Payment integration
- ✅ Basic monitoring

### **Phase 2: Advanced Features (In Progress)**
- 🔄 Circuit breaker implementation
- 🔄 Distributed tracing
- 🔄 Event-driven architecture
- 🔄 Advanced caching strategies
- 🔄 API rate limiting
- 🔄 Comprehensive testing

### **Phase 3: Enterprise Features (Planned)**
- 📋 Multi-tenant architecture
- 📋 Advanced analytics and reporting
- 📋 Machine learning recommendations
- 📋 Real-time inventory management
- 📋 Advanced search with Elasticsearch
- 📋 Mobile app development

### **Phase 4: Scale & Optimization (Future)**
- 📋 Event sourcing implementation
- 📋 CQRS pattern adoption
- 📋 Serverless functions integration
- 📋 Advanced security features
- 📋 Performance optimization
- 📋 Global deployment strategy

---

## 📞 Support & Contact

### **Documentation**
- **API Documentation**: Available at `/docs` endpoint of each service
- **Architecture Diagrams**: Located in `/docs/architecture/`
- **Deployment Guides**: See `CLOUD_DEPLOYMENT_GUIDE.md`

### **Community**
- **GitHub Issues**: Report bugs and feature requests
- **Discussions**: Join community discussions
- **Wiki**: Comprehensive documentation and tutorials

### **Maintenance**
- **Regular Updates**: Monthly dependency updates
- **Security Patches**: Immediate security vulnerability fixes
- **Performance Monitoring**: Continuous performance optimization
- **Documentation**: Keep documentation up-to-date

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Spring Boot and Spring Cloud communities
- Netflix OSS for microservices patterns
- Kubernetes and Docker communities
- All contributors and maintainers

---

**Project Status**: ✅ Production Ready
**Last Updated**: January 2024
**Version**: 1.0.0
**Maintainer**: Kuldeep Chaturvedi