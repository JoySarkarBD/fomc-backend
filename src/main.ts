import 'reflect-metadata';

/**
 * This is the main entry point of the NestJS application. It sets up the application, applies global validation, and starts the server.
 * The application listens on a specified port (defaulting to 3000) and is ready to handle incoming requests.
 * The global validation pipe ensures that all incoming data is validated according to the defined DTOs, with strict options to prevent unexpected properties.
 * The server logs a message indicating the URL where the GraphQL endpoint is accessible once it starts successfully.
 */
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { formatValidationErrors } from './common/utils/validation.util';

async function bootstrap() {
  // Create the NestJS application instance using the root AppModule.
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({ origin: '*' });

  // Enable global validation pipe with strict options:
  // - `whitelist` removes unexpected properties
  // - `forbidNonWhitelisted` throws on unexpected properties
  // - `transform` enables DTO transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) =>
        new BadRequestException({
          message: 'Validation failed',
          errors: formatValidationErrors(errors),
        }),
    }),
  );

  // Start the server on the specified port or default to 3000.
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT ?? 3000}/graphql`,
    );
  });
}
bootstrap();
