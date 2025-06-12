
FROM maven:3.8.8-eclipse-temurin-11 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests


FROM eclipse-temurin:11-jdk-alpine
WORKDIR /app


COPY --from=build /app/target/*.jar app.jar

# אם Render מגדיר PORT אוטומטי, אפשר להשמיט; אחרת:
ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["java","-jar","app.jar"]
