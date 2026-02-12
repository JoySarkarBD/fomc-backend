import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

/**
 * AppController is the main controller for the API Gateway application.
 * It defines the root endpoint and handles basic requests to the API Gateway.
 * The controller uses the AppService to provide responses for incoming requests.
 * Currently, it has a single endpoint that returns a status message, which can be used as a health check to verify that the API Gateway is running properly.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root endpoint ("/") and returns a simple status message indicating that the API Gateway is running.
   * This endpoint can be used as a health check to verify that the API Gateway is operational and responding to requests.
   * @returns A string message indicating that the API Gateway is running.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
