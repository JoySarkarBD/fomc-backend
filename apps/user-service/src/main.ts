import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { UserModule } from './user.module';

/**
 * Bootstrap function
 *
 * Initializes and starts the User microservice using TCP transport.
 * Configures:
 *  - Environment-based host and port
 *  - Global validation pipe
 *  - Microservice transport layer
 */
async function bootstrap(): Promise<void> {
  /**
   * Resolve service host and port from environment variables.
   * Fallbacks are provided for local development.
   */
  const host = process.env.USER_SERVICE_HOST ?? '127.0.0.1';
  const port = Number(process.env.USER_SERVICE_PORT ?? 3001);

  /**
   * Create NestJS microservice instance.
   *
   * Transport: TCP
   * Suitable for internal service-to-service communication.
   */
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
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

  /**
   * Log successful startup message.
   */
  console.log(`User Microservice is listening on port ${port}`);
}

/**
 * Execute bootstrap function.
 * `void` prevents unhandled promise warnings.
 */
void bootstrap();
