const { Catch, HttpException, HttpStatus } = require("@nestjs/common");
const { STATUS_CODES } = require("http");

/**
 * Global HTTP Exception Filter for handling exceptions in a consistent manner across the API Gateway.
 * This filter catches all exceptions thrown within the application and formats the response to include relevant information such as the HTTP status code, error message, request method, endpoint, and timestamp.
 * It also handles validation errors from class-validator and standard HTTP exceptions, providing a structured response that can be easily consumed by clients.
 * By using this filter, developers can ensure that all errors are handled gracefully and that clients receive informative error responses, improving the overall robustness and user experience of the API Gateway.
 * To use this filter, it can be applied globally in the main application file (e.g., main.ts) using the app.useGlobalFilters(new HttpExceptionFilter()) method, ensuring that all exceptions thrown within the application are processed by this filter.
 * The filter checks if the exception is an instance of HttpException to determine the appropriate HTTP status code and message. For validation errors, it processes the array of errors to extract field-specific messages. For standard HTTP exceptions, it checks if the error message indicates a "Path not found" scenario and adjusts the response accordingly. Finally, it constructs a consistent response payload and sends it back to the client with the appropriate status code.
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
