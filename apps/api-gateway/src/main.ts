/**
 * @fileoverview API Gateway bootstrap.
 *
 * Starts the HTTP server that acts as the single entry-point for all
 * client requests.  Registers global middleware (Helmet, Morgan),
 * validation pipes, the response interceptor, and the HTTP exception
 * filter before listening on the configured port.
 *
 * @module api-gateway/main
 */

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import config from "@shared/config/app.config";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import * as path from "path";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/http-exception.filter";
import { ResponseInterceptor } from "./common/response.interceptor";

/**
 * Bootstraps the NestJS API Gateway application.
 *
 * 1. Creates the Nest HTTP app from {@link AppModule}.
 * 2. Sets `/api` as the global route prefix.
 * 3. Applies security headers via Helmet.
 * 4. Enables HTTP request logging via Morgan (`dev` format).
 * 5. Registers a global {@link ValidationPipe} (whitelist + transform).
 * 6. Registers the global {@link ResponseInterceptor} and {@link HttpExceptionFilter}.
 * 7. Listens on the port defined by `config.PORT` (fallback: 3000).
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Set global route prefix to "api"
  app.setGlobalPrefix("api");

  // Apply security headers
  app.use(helmet());

  // Enable HTTP request logging
  app.use(morgan("dev"));

  // Serve static files from the "uploads" directory at both "/uploads" and "/api/uploads"
  const uploadsRoot = path.join(process.cwd(), "uploads");

  // Ensure the uploads directory exists
  app.use("/uploads", express.static(uploadsRoot));

  // Also serve uploads at the API route for client access
  app.use("/api/uploads", express.static(uploadsRoot));

  // Register global validation pipe with strict options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => errors,
    }),
  );

  // Register global response interceptor and HTTP exception filter
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Register global HTTP exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle("OMS - SWAGGER API")
    .setDescription(
      "API documentation for the Order Management System (OMS) - FB International BD",
    )
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "authorization", // <- name important
    )
    .setVersion("1.0")
    .build();

  // Create document
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // ✅ Serve Swagger UI at /api
  SwaggerModule.setup("api-doc", app, document);

  // ✅ Optional: serve raw JSON at /api-json
  app.getHttpAdapter().get("/api-json", (req, res) => {
    res.json(document); // use send, not json (sometimes works better for $ref parser)
  });

  const port = Number(config.PORT ?? 3000);
  await app.listen(port, () => {
    console.log(`🚀 API Gateway is running at http://localhost:${port}/api`);
    console.log(`📖 Swagger UI available at http://localhost:${port}/api-doc`);
  });
}

void bootstrap();
