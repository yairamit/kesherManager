# 1️⃣ build Maven + JDK 17
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/kesherManager-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=10000
EXPOSE 10000
ENTRYPOINT ["java","-jar","app.jar"]
