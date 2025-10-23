FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/ProductService-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8002

ENTRYPOINT ["java", "-jar", "app.jar"]