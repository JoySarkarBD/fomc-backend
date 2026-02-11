import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * AppController
 *
 * Root controller of the API Gateway.
 * Handles base route requests.
 */
@Controller()
export class AppController {
  /**
   * Creates an instance of AppController.
   *
   * @param {AppService} appService - Application-level service provider.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Root endpoint handler.
   *
   * Route: GET /
   *
   * Used as a basic health-check endpoint to verify
   * that the API Gateway is running.
   *
   * @returns {string} Status message from AppService.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
