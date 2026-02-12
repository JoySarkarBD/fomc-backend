/**
 * Generic response envelope used for API responses.
 *
 * @template T - Type of the data payload
 */
export type ResponseEnvelope<T> = {
  /** Human-readable message describing the response */
  message: string;

  /** Actual data payload of the response */
  data: T;
};

/**
 * Helper function to build a standardized API response.
 *
 * @template T - Type of the data payload
 * @param message - Human-readable message describing the response
 * @param data - Actual data payload to return
 * @returns A response object conforming to ResponseEnvelope<T>
 */
export const buildResponse = <T>(
  message: string,
  data: T,
): ResponseEnvelope<T> => {
  return { message, data };
};
