const { Catch, HttpException, HttpStatus } = require("@nestjs/common");
const { STATUS_CODES } = require("http");

/**
 * HttpExceptionFilter
 *
 * Global exception filter for handling HTTP exceptions and validation errors
 * in a consistent format.
 *
 * Features:
 * - Handles standard HTTP exceptions (400, 404, 500, etc.)
 * - Handles validation errors from class-validator
 * - Returns structured JSON with metadata: method, endpoint, timestamp, status code
 */
@Catch()
export class HttpExceptionFilter {
  /**
   * Catch method invoked when an exception occurs
   *
   * @param {unknown} exception The thrown exception
   * @param {import('@nestjs/common').ArgumentsHost} host Execution context
   */
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Default HTTP status
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Request failed";
    let errors;
    let error;

    // Handle validation errors (from class-validator)
    if (Array.isArray(exception)) {
      status = HttpStatus.BAD_REQUEST;
      message = "Validation failed";

      errors = exception.flatMap((err) => {
        const field = err.property;
        const constraints = err.constraints
          ? Object.values(err.constraints)
          : ["Invalid value"];
        return constraints.map((msg) => ({ field, message: msg }));
      });
    }
    // Handle standard HTTP exceptions
    else if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      let isRouteNotFound = false;

      if (typeof responseBody === "string") {
        message = responseBody;
        error = responseBody;
        isRouteNotFound = responseBody.startsWith("Cannot ");
      } else if (responseBody && typeof responseBody === "object") {
        message = responseBody.message || message;
        error = responseBody.error;
        isRouteNotFound =
          typeof responseBody.message === "string" &&
          responseBody.message.startsWith("Cannot ");
      }

      if (status === HttpStatus.NOT_FOUND && isRouteNotFound) {
        message = "Path not found";
        error = "Path not found";
      }
    }

    // Build response payload
    const payload = {
      success: false,
      message,
      method: request?.method,
      endpoint: request?.originalUrl || request?.url || "",
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...(errors && { errors }),
      ...(error && !errors && { error }),
    };

    // Send JSON response
    response.status(status).json(payload);
  }
}
