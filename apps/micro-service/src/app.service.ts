import { Injectable } from '@nestjs/common';

/**
 * AppService
 *
 * Provides basic application-level functionality
 * for the API Gateway.
 */
@Injectable()
export class AppService {
  /**
   * Returns a simple health/check message.
   *
   * Typically used to verify that the API Gateway
   * is running successfully.
   *
   * @returns {string} Status message of the API Gateway.
   */
  getHello(): string {
    return 'API Gateway - Microservices are running!';
  }
}
