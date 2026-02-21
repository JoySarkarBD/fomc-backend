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
  app.setGlobalPrefix("api");
  app.use(helmet());
  app.use(morgan("dev"));
  const uploadsRoot = path.join(process.cwd(), "uploads");
  app.use("/uploads", express.static(uploadsRoot));
  app.use("/api/uploads", express.static(uploadsRoot));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => errors,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = Number(config.PORT ?? 3000);
  await app.listen(port, () => {
    console.log(`🚀 API Gateway is running at http://localhost:${port}/api`);
  });
}

void bootstrap();
