import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ResponseInterceptor } from './common/response.interceptor';

/**
 * Bootstrap function
 *
 * Initializes and starts the HTTP API Gateway.
 * Configures:
 *  - Global API prefix
 *  - Validation pipe
 *  - Global response interceptor
 *  - Global exception filter
 */
async function bootstrap(): Promise<void> {
  /**
   * Create NestJS HTTP application instance.
   */
  const app = await NestFactory.create(AppModule);

  /**
   * Set global API route prefix.
   * Example: http://localhost:3000/api/*
   */
  app.setGlobalPrefix('api');

  /**
   * Apply global validation pipe.
   *
   * Options:
   * - whitelist: strips properties not defined in DTO
   * - transform: converts payloads to DTO instances
   * - forbidNonWhitelisted: throws error for unexpected properties
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => errors,
    }),
  );

  /**
   * Apply global response interceptor.
   *
   * Used to:
   * - Standardize API responses
   * - Wrap success responses
   * - Modify outgoing data structure
   */
  app.useGlobalInterceptors(new ResponseInterceptor());

  /**
   * Apply global HTTP exception filter.
   *
   * Used to:
   * - Standardize error responses
   * - Handle unhandled exceptions
   * - Provide consistent error structure
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * Resolve application port from environment variable.
   * Defaults to 3000 for local development.
   */
  const port = Number(process.env.PORT ?? 3000);

  /**
   * Start HTTP server.
   */
  await app.listen(port, () => {
    console.log(`🚀 API Gateway is running at http://localhost:${port}/api`);
  });
}

/**
 * Execute bootstrap function.
 * `void` prevents unhandled promise warnings.
 */
void bootstrap();
