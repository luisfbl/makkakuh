FROM gradle:8.5-jdk17 AS build

WORKDIR /app
COPY settings.gradle.kts .
COPY gradle.properties .
COPY gradle/ gradle/
COPY rest-server/ rest-server/

# Construir a aplicação Quarkus
RUN cd rest-server && gradle build -x test

FROM registry.access.redhat.com/ubi8/openjdk-17:latest

ENV LANGUAGE='en_US:en'

WORKDIR /deployments

# Copiar os arquivos construídos para o container final
COPY --from=build /app/rest-server/build/quarkus-app/lib/ /deployments/lib/
COPY --from=build /app/rest-server/build/quarkus-app/*.jar /deployments/
COPY --from=build /app/rest-server/build/quarkus-app/app/ /deployments/app/
COPY --from=build /app/rest-server/build/quarkus-app/quarkus/ /deployments/quarkus/

# Expor porta da aplicação
EXPOSE 8080

# Iniciar a aplicação
CMD ["java", "-jar", "/deployments/quarkus-run.jar"]