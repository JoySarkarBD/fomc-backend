import { Injectable } from "@nestjs/common";

/**
 * AppService is the main service for the API Gateway application.
 * It provides application-level services and logic that can be used across different controllers and modules within the API Gateway.
 * Currently, it has a method that returns a simple status message, which can be used as a health check to verify that the API Gateway is running properly.
 * The AppService can be expanded in the future to include additional methods and logic as the API Gateway's functionality grows and evolves.
 */
@Injectable()
export class AppService {
  /**
   * Returns a simple status message indicating that the API Gateway is running. This method can be used as a health check to verify that the API Gateway is operational and responding to requests.
   * @returns A string message indicating that the API Gateway is running.
   */
  getHello(): string {
    return "API Gateway - Microservices are running!";
  }
}
