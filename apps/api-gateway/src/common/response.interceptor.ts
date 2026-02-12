import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ServiceResponse } from "./response.interface";

/**
 * ResponseInterceptor is a NestJS interceptor that transforms outgoing responses into a standardized ServiceResponse format.
 * This interceptor intercepts the response from route handlers and maps it to a consistent structure that includes metadata such as success status, message, HTTP method, endpoint, status code, timestamp, and the actual data payload.
 * The interceptor checks if the response is already in the ServiceResponse format and returns it as-is if so. Otherwise, it constructs a new ServiceResponse object based on the original response data and the HTTP status code.
 * This interceptor can be applied globally or to specific controllers/routes to ensure that all responses from the API Gateway adhere to a consistent format, improving the client experience and making it easier to handle responses on the frontend.
 * The intercept method uses the RxJS map operator to transform the response data before it is sent back to the client, allowing for flexible response formatting and ensuring that all necessary metadata is included in the response payload.
 * By using this interceptor, developers can ensure that all responses from the API Gateway are structured in a predictable way, making it easier for clients to consume and handle responses effectively while also providing useful information about the request and response context.
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
    const url: string = req?.originalUrl || req?.url || "";

    // Skip response wrapping for the root API path
    if (url === "/api" || url === "/api/") {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If response is already a ServiceResponse, return as-is
        if (data?.success !== undefined && data?.timestamp) {
          if (typeof data.statusCode !== "number") {
            const currentStatus = httpRes?.statusCode ?? 200;
            return { ...data, statusCode: currentStatus };
          }
          return data;
        }

        // Determine the appropriate status code for the response
        const statusCode =
          typeof data?.statusCode === "number"
            ? data.statusCode
            : (httpRes?.statusCode ?? 200);
        if (httpRes?.statusCode !== statusCode) {
          httpRes?.status(statusCode);
        }

        // Check if the original data is already an envelope with message and data properties
        const isEnvelope =
          data &&
          typeof data === "object" &&
          (Object.prototype.hasOwnProperty.call(data, "message") ||
            Object.prototype.hasOwnProperty.call(data, "data"));
        const responseMessage =
          isEnvelope && Object.prototype.hasOwnProperty.call(data, "message")
            ? data.message
            : "Request successful";
        const responseData =
          isEnvelope && Object.prototype.hasOwnProperty.call(data, "data")
            ? data.data
            : data;

        // Construct the standardized service response
        const response: ServiceResponse = {
          success: statusCode >= 200 && statusCode < 300,
          message: responseMessage,
          method,
          endpoint: url,
          statusCode,
          timestamp: new Date().toISOString(),
          data: responseData, // wrap actual payload
        };

        return response;
      }),
    );
  }
}
