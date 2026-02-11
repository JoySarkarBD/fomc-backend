import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ServiceResponse } from './response.interface';

/**
 * Global exception filter to catch all unhandled exceptions and format the response
 * according to the ServiceResponse structure.
 * This ensures that even in error cases, the response format remains consistent.
 * It captures the HTTP status code, error message, request method, and endpoint,
 * and includes any additional error details if available.
 * This filter is applied globally in the main.ts file, so it will handle exceptions from all controllers and services.
 * It is especially useful for catching unexpected errors and ensuring that clients receive a well-structured error response.
 * The filter checks if the exception is an instance of HttpException to determine the appropriate status code and message.
 * If the exception is not an HttpException, it defaults to a 500 Internal Server Error status code and a generic error message.
 * The response includes a timestamp to indicate when the error occurred, which can be helpful for debugging and logging purposes.
 * Overall, this filter enhances the robustness of the application by providing a consistent error handling mechanism across all endpoints.
 * For more specific error handling, you can create additional filters that extend this base filter or handle specific exception types.
 *
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Extract the HTTP context from the ArgumentsHost
    const ctx = host.switchToHttp();
    // Get the response and request objects from the context
    const response = ctx.getResponse();
    // Get the request object to extract method and URL information
    const request = ctx.getRequest();
    // Determine the HTTP status code based on the type of exception
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // Initialize a default error message and an optional data object to hold additional error details
    let message = 'Request failed';
    let data: Record<string, unknown> | null = null;
    // If the exception is an instance of HttpException, extract the response body to determine the error message and any additional details
    if (exception instanceof HttpException) {
      // The response body can be a string or an object. If it's a string, use it directly as the message. If it's an object, check for 'message' and 'error' properties to construct the response.
      const responseBody = exception.getResponse();
      // If the response body is a string, use it as the message. If it's an object, check for 'message' and 'error' properties to construct the response. If 'message' is an array (e.g., validation errors), set a generic validation failed message and include the array in the data. If there's an 'error' property, include it in the data as well.
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (responseBody && typeof responseBody === 'object') {
        const body = responseBody as {
          message?: string | string[];
          error?: string;
        };
        if (Array.isArray(body.message)) {
          message = 'Validation failed';
          data = { errors: body.message };
        } else if (body.message) {
          message = body.message;
        }
        if (body.error) {
          data = { ...(data ?? {}), error: body.error };
        }
      }
    }

    if (status === HttpStatus.NOT_FOUND) {
      message = 'Path not found';
      data = null;
    }
    // Construct the response payload according to the ServiceResponse structure, including success status, message, method, endpoint, status code, timestamp, and any additional error data
    const payload: ServiceResponse = {
      success: false,
      message,
      method: request?.method,
      endpoint: request?.originalUrl || request?.url || '',
      statusCode: status,
      timestamp: new Date().toISOString(),
      data: data ?? undefined,
    };
    // Send the formatted error response back to the client with the appropriate HTTP status code
    response.status(status).json(payload);
  }
}
