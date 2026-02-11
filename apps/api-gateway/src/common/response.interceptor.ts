import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceResponse } from './response.interface';

/**
 * ResponseInterceptor
 *
 * Intercepts all HTTP responses and wraps them into a consistent
 * structure defined by the ServiceResponse interface.
 *
 * Features:
 * - Adds metadata: method, endpoint, statusCode, timestamp
 * - Ensures every response has a `success` boolean
 * - Optionally passes through data under the `data` key
 * - Skips wrapping for the root API path (`/api` or `/api/`)
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * Intercept outgoing responses and map them into ServiceResponse format.
   *
   * @param context Execution context providing request/response objects
   * @param next CallHandler for the next action in the request pipeline
   * @returns Observable<ServiceResponse> - formatted response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const httpRes = context.switchToHttp().getResponse();

    const method = req?.method;
    const url: string = req?.originalUrl || req?.url || '';

    // Skip response wrapping for the root API path
    if (url === '/api' || url === '/api/') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If response is already a ServiceResponse, return as-is
        if (data?.success !== undefined && data?.timestamp) {
          return data;
        }

        const statusCode = httpRes?.statusCode ?? 200;

        // Construct the standardized service response
        const response: ServiceResponse = {
          success: statusCode >= 200 && statusCode < 300,
          message: data?.message || 'Request successful',
          method,
          endpoint: url,
          statusCode,
          timestamp: new Date().toISOString(),
          data: data?.data !== undefined ? data.data : data, // wrap actual payload
        };

        return response;
      }),
    );
  }
}
