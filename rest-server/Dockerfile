FROM gradle:8.5-jdk17 AS build

WORKDIR /app
COPY settings.gradle.kts .
COPY gradle.properties .
COPY gradle/ gradle/
COPY rest-server/ rest-server/

RUN cd rest-server && gradle build -x test

FROM registry.access.redhat.com/ubi8/openjdk-17:latest

ENV LANGUAGE='en_US:en'

WORKDIR /deployments

COPY --from=build /app/rest-server/build/quarkus-app/lib/ /deployments/lib/
COPY --from=build /app/rest-server/build/quarkus-app/*.jar /deployments/
COPY --from=build /app/rest-server/build/quarkus-app/app/ /deployments/app/
COPY --from=build /app/rest-server/build/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
CMD ["java", "-jar", "/deployments/quarkus-run.jar"]