/**
 * @fileoverview Notification Microservice Bootstrap
 *
 * Entry point for the Notification microservice. Initializes a TCP-based
 * NestJS microservice for handling notification-related operations.
 */
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { NotificationServiceModule } from "./notification-service.module";

/**
 * Bootstrap function
 *
 * Initializes and starts the Notification microservice using TCP transport.
 * Configures:
 * - Environment-based host and port
 * - Global validation pipe
 * - Microservice transport layer
 */
async function bootstrap(): Promise<void> {
  /**
   * Resolve service host and port from environment variables.
   * Fallbacks are provided for local development.
   */
  const host = config.NOTIFICATION_SERVICE_HOST ?? "127.0.0.1";
  const port = Number(config.NOTIFICATION_SERVICE_PORT ?? 8083);

  /**
   * Create NestJS microservice instance.
   *
   * Transport: TCP
   * Suitable for internal service-to-service communication.
   */
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );

  /**
   * Apply global validation pipe.
   *
   * Options:
   * - whitelist: removes properties not defined in DTO
   * - transform: automatically transforms payloads to DTO instances
   * - forbidNonWhitelisted: throws error if unknown properties are sent
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * Start listening for incoming microservice messages.
   */
  await app.listen();

  console.log(
    `🚀 Notification Service is running at ${host}:${port} (TCP transport)`,
  );
}

// Call the bootstrap function to start the application.
void bootstrap();
