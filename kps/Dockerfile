# =========================
# BUILD STAGE
# =========================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests

# =========================
# RUNTIME STAGE
# =========================
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/kps-0.0.1-SNAPSHOT.jar app.jar

# Railway uses dynamic ports, but expose 8080 for documentation
EXPOSE 8080

# Start Spring Boot
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","app.jar"]
