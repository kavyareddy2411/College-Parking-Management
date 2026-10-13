FROM node:22-alpine AS frontend-build
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace

COPY backend/pom.xml ./backend/pom.xml
RUN mvn -B -f backend/pom.xml dependency:go-offline

COPY backend/src ./backend/src
COPY --from=frontend-build /workspace/frontend-build ./frontend-build
RUN mvn -B -f backend/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --create-home --uid 10001 appuser
COPY --from=build /workspace/backend/target/parking-0.0.1-SNAPSHOT.jar ./app.jar
ENV SERVER_PORT=8080
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
