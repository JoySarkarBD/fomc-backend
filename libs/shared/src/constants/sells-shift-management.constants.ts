/**
 * @fileoverview TCP message-pattern commands for the **Sells_SHIFT_MANAGEMENT** domain.
 *
 * Used by the API Gateway and Sells_SHIFT_MANAGEMENT microservice to communicate
 * sells_SHIFT_MANAGEMENT operations over the TCP transport.
 *
 * @module @shared/constants/sells_SHIFT_MANAGEMENT-command
 */

export const SELLS_SHIFT_MANAGEMENT_COMMANDS = {
  /** Create a new sells shift management. */
  CREATE_SELLS_SHIFT_MANAGEMENT: { cmd: "create_sells_shift_management" },

  /** Retrieve sells shift managements for a specific user, optionally filtered. */
  GET_USER_SELLS_SHIFT_MANAGEMENT: { cmd: "get_user_sells_shift_management" },

  /** Mark a sells shift management as read. */
};
