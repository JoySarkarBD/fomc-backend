import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ServiceResponse } from './response.interface';

/**
 * HttpExceptionFilter
 *
 * Global exception filter for handling all HTTP exceptions and validation errors
 * in a consistent format according to the ServiceResponse interface.
 *
 * Features:
 * - Handles standard HTTP exceptions (e.g., 400, 404, 500)
 * - Handles class-validator validation errors and maps them to a structured errors array
 * - Provides metadata such as HTTP method, endpoint, timestamp, and status code
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Catch method is invoked when an exception is thrown.
   *
   * @param exception The exception object thrown
   * @param host ArgumentsHost containing request and response objects
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Get the HTTP request/response context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine HTTP status code
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Default response values
    let message = 'Request failed';
    let errors: Array<{ field: string; message: string }> | undefined;
    let error: string | undefined;

    // Handle validation errors returned from class-validator
    if (Array.isArray(exception)) {
      message = 'Validation failed';
      errors = exception.flatMap((err: ValidationError) => {
        const field = err.property; // preserves DTO property name
        const constraints = err.constraints
          ? Object.values(err.constraints)
          : ['Invalid value'];

        // Map all constraint messages for this field
        return constraints.map((msg) => ({ field, message: msg }));
      });
      status = HttpStatus.BAD_REQUEST;
    }
    // Handle standard HttpException
    else if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
        error = responseBody;
      } else if (responseBody && typeof responseBody === 'object') {
        const body = responseBody as any;
        message = body.message || message;
        error = body.error;
      }
    }

    // Handle 404 Not Found
    if (status === HttpStatus.NOT_FOUND) {
      message = 'Path not found';
      error = 'Path not found';
    }

    // Build the structured service response payload
    const payload: ServiceResponse = {
      success: false,
      message,
      method: request?.method,
      endpoint: request?.originalUrl || request?.url || '',
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...(errors && { errors }),
      ...(error && !errors && { error }),
    };

    // Send JSON response
    response.status(status).json(payload);
  }
}
