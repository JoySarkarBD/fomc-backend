/**
 * @fileoverview Notification Microservice Bootstrap
 *
 * Entry point for the Notification microservice. Initializes a RabbitMQ-based
 * NestJS microservice for handling notification-related operations.
 */
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import config from "@shared/config/app.config";
import { NotificationServiceModule } from "./notification.module";

/**
 * Bootstrap function
 *
 * Initializes and starts the Notification microservice using RabbitMQ transport.
 * Configures:
 * - RabbitMQ connection URL and queue
 * - Global validation pipe
 * - Microservice transport layer
 */
async function bootstrap(): Promise<void> {
  /**
   * Create NestJS microservice instance.
   *
   * Transport: RMQ (RabbitMQ)
   * Suitable for asynchronous, decoupled service-to-service communication.
   */
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.RABBITMQ_URL],
        queue: config.NOTIFICATION_QUEUE,
        queueOptions: {
          durable: false,
        },
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
   * Start listening for incoming RabbitMQ messages.
   */
  await app.listen();

  console.log(`🚀 Notification Service is running with RabbitMQ transport`);
}

// Call the bootstrap function to start the application.
void bootstrap();
