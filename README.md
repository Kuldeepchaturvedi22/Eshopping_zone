🛍️ E-Shopping Zone

E-Shopping Zone is a full-stack E-Commerce web application built using a microservices architecture with Spring Boot (backend) and React + Vite (frontend).
It provides a scalable, modular, and secure shopping experience that demonstrates real-world enterprise-level design patterns such as API Gateway, Service Discovery, and JWT-based authentication.

🧩 Architecture Overview

The backend follows a Spring Boot microservices architecture consisting of 6 core services, an API Gateway, and a Eureka Server.
Each service is independently deployable, communicates via REST APIs, and has its own database schema (Database per Service pattern).

🏗️ Services
Service	Responsibility
User Service	Manages user registration, authentication, profiles, and authorization using Spring Security + JWT.
Product Service	Handles product catalog, details, and search functionalities.
Cart Service	Manages user carts and items with CRUD operations.
Order Service	Processes orders, maintains order history, and communicates with payment & cart services.
Payment Service	Handles payment logic (mock or simulated payment processing).
Notification Service	Sends transactional email notifications (e.g., order confirmation, registration success).
Eureka Server	Service Discovery Server that registers all microservices dynamically.
API Gateway	Centralized entry point for client requests, handles routing, load balancing, and token verification.
🧠 System Flow

Frontend (React + Vite) sends requests to the API Gateway.

API Gateway routes requests to respective microservices based on URI paths.

Eureka Server manages service discovery and dynamic routing.

JWT Authentication ensures secure access to protected endpoints.

Notification Service communicates asynchronously to send emails.

Each service interacts with its own MySQL database, maintaining loose coupling.

⚙️ Tech Stack
🖥️ Backend

Spring Boot 3 (Microservices)

Spring Security + JWT

Spring Cloud Netflix Eureka

Spring Cloud Gateway

Spring Data JPA

Feign Client for inter-service communication

Maven – build tool

MySQL – relational database

💻 Frontend

React + Vite – fast frontend development environment

Axios – API calls

React Router DOM – routing

Tailwind CSS or CSS modules (if used)

Responsive UI for mobile and desktop

🗄️ Database Design

Each microservice manages its own MySQL schema, ensuring:

Data isolation

Scalability and fault tolerance

Clear service boundaries

🔐 Security Implementation

Authentication handled by User Service using Spring Security

JWT tokens used for secure communication between frontend and backend

API Gateway verifies JWT before forwarding requests to microservices

🧰 Build & Run Instructions
🧩 Backend

Clone the repository:

git clone https://github.com/yourusername/eshopping-zone.git
cd eshopping-zone


Build all services:

mvn clean install -DskipTests


Start services in this order:

Eureka Server

API Gateway

Other microservices (user-service, product-service, cart-service, order-service, payment-service, notification-service)

Verify Eureka dashboard:

http://localhost:8761

💻 Frontend

Navigate to frontend folder:

cd frontend
npm install
npm run dev


Access application:

http://localhost:5173

🌐 Integration Flow

Frontend → API Gateway → Microservices

Microservices → communicate via Feign Clients

Notification Service → sends email asynchronously

🧾 Features

✅ User registration & JWT-based login
✅ Product listing & search
✅ Add/remove items from cart
✅ Place orders & view order history
✅ Email notifications for key events
✅ Service Discovery (Eureka) + API Gateway routing
✅ Modular & scalable microservices architecture

🧭 Future Enhancements

Dockerize all microservices for containerized deployment

Deploy backend on Google Cloud (GCP) and frontend via Firebase Hosting

Implement centralized configuration using Spring Cloud Config Server

Integrate CI/CD using Cloud Build or GitHub Actions

Add payment gateway integration (e.g., Razorpay/Stripe)

Improve UI UX with advanced product filters and animations

👨‍💻 Author

Kuldeep Chaturvedi
📧 Passionate Java Developer | Spring Boot | Microservices | React | MySQL
🔗 LinkedIn Profile
 | Portfolio
