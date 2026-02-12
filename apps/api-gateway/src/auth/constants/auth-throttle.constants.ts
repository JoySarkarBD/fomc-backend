/**
 * Constants related to authentication throttling.
 * Defines throttle names, limits, and time-to-live (TTL) for password-related throttling.
 * Used to prevent brute-force attacks by limiting the number of authentication attempts.
 */
export const PASSWORD_THROTTLER_NAME = "password";
export const PASSWORD_THROTTLE_LIMIT = 1;
export const PASSWORD_THROTTLE_TTL_MS = 2 * 60 * 1000;

/**
 * Configuration object for password throttling.
 * Contains the name, limit, and TTL for the password throttler.
 */
export const PASSWORD_THROTTLER = {
  name: PASSWORD_THROTTLER_NAME,
  limit: PASSWORD_THROTTLE_LIMIT,
  ttl: PASSWORD_THROTTLE_TTL_MS,
};

/**
 * Throttling configuration for password-related operations.
 * Specifies the limit and TTL for the password throttler.
 */
export const PASSWORD_THROTTLE = {
  [PASSWORD_THROTTLER_NAME]: {
    limit: PASSWORD_THROTTLE_LIMIT,
    ttl: PASSWORD_THROTTLE_TTL_MS,
  },
};
