/**
 * ServiceResponse
 *
 * Standard structure for API responses across the application.
 * Used by ResponseInterceptor and HttpExceptionFilter to ensure consistent
 * formatting for both successful and failed requests.
 *
 * @template T - Optional type of the `data` payload.
 */
export interface ServiceResponse<T = any> {
  /** Indicates if the request was successful (true for 2xx HTTP status) */
  success: boolean;

  /** A descriptive message about the request outcome */
  message: string;

  /** HTTP method of the request (GET, POST, etc.) */
  method?: string;

  /** Endpoint or URL path of the request */
  endpoint?: string;

  /** Timestamp when the response was generated (ISO string) */
  timestamp: string;

  /** HTTP status code of the response */
  statusCode: number;

  /** Optional payload of the response */
  data?: T;

  /** Optional error message for single error scenarios */
  error?: string;

  /** Optional array of validation errors or field-specific errors */
  errors?: Array<{
    /** Name of the property/field that caused the error (matches DTO) */
    field: string;

    /** Human-readable error message for the field */
    message: string;
  }>;
}
