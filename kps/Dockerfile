# =========================
# BUILD STAGE
# =========================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# 1️⃣ Copy pom.xml first
COPY pom.xml .

# 2️⃣ Download dependencies (cache layer)
RUN mvn dependency:go-offline

# 3️⃣ Copy source code
COPY src ./src

# 4️⃣ Build jar
RUN mvn clean package -DskipTests

# =========================
# RUNTIME STAGE
# =========================
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/kps-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","app.jar"]
