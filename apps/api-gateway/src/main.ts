import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import "dotenv/config";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/http-exception.filter";
import { ResponseInterceptor } from "./common/response.interceptor";

/**
 * Bootstrap function to initialize and start the NestJS application.
 * This function creates the application instance, applies global configurations such as route prefix, validation pipes, interceptors, and exception filters, and then starts the HTTP server on the specified port.
 * The global configurations ensure that all incoming requests are validated, responses are standardized, and exceptions are handled consistently across the application.
 * Finally, the server listens on the defined port and logs a message indicating that the API Gateway is running.
 */
async function bootstrap(): Promise<void> {
  // Create the NestJS application instance using the AppModule as the root module, which orchestrates the various feature modules and services within the API Gateway.
  const app = await NestFactory.create(AppModule);

  // Set a global prefix for all routes in the application. This means that all endpoints will be prefixed with "/api", providing a clear namespace for the API and helping to avoid route conflicts with other potential services or applications running on the same server.
  app.setGlobalPrefix("api");

  /**
   * Apply global validation pipe.
   * Used to:
   * - Validate incoming request data against defined DTOs (Data Transfer Objects)
   * - Automatically transform payloads to the expected types
   * - Strip out any properties that are not defined in the DTOs (whitelist)
   * - Forbid any properties that are not defined in the DTOs, throwing an error if such properties are present in the request
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => errors,
    }),
  );

  // Apply global response interceptor. This interceptor can be used to standardize the structure of all responses sent from the API Gateway, ensuring that clients receive consistent response formats regardless of which controller or service is handling the request. It can also be used for logging, transforming response data, or adding additional metadata to responses as needed.
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Apply global exception filter. This filter catches and handles all exceptions thrown within the application, allowing for consistent error handling and response formatting across the API Gateway. It can be used to log errors, transform exceptions into standardized error responses, and ensure that clients receive meaningful error messages when something goes wrong.
  app.useGlobalFilters(new HttpExceptionFilter());

  // Determine the port to listen on, using the PORT environment variable if defined, or defaulting to 3000 if not. This allows for flexibility in different deployment environments where the port may need to be configured dynamically.
  const port = Number(process.env.PORT ?? 3000);

  // Start the HTTP server and listen on the defined port. Once the server is running, log a message to the console indicating that the API Gateway is operational and providing the URL where it can be accessed.
  await app.listen(port, () => {
    console.log(`🚀 API Gateway is running at http://localhost:${port}/api`);
  });
}

// Call the bootstrap function to start the application.
void bootstrap();
