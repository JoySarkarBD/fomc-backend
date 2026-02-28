/**
 * @fileoverview TCP message-pattern commands for the **Sells_SHIFT_MANAGEMENT** domain.
 *
 * Used by the API Gateway and Sells_SHIFT_MANAGEMENT microservice to communicate
 * sells_SHIFT_MANAGEMENT operations over the TCP transport.
 */

export const SELLS_SHIFT_MANAGEMENT_COMMANDS = {
  /** Create a new sells shift management. */
  CREATE_SELLS_SHIFT_FOR_USER: { cmd: "create_sells_shift_for_user" },

  /** Retrieve sells shift managements for a specific user, optionally filtered. */
  GET_USER_SELLS_SHIFT: { cmd: "get_user_sells_shift_management" },

  /** Request a shift exchange. */
  REQUEST_SHIFT_EXCHANGE: { cmd: "request_shift_exchange" },

  /** Approve a shift exchange request. */
  APPROVE_SHIFT_EXCHANGE: { cmd: "approve_shift_exchange" },

  /** Reject a shift exchange request. */
  REJECT_SHIFT_EXCHANGE: { cmd: "reject_shift_exchange" },

  /** Get all shift exchange requests for a user. */
  GET_USER_SHIFT_EXCHANGES: { cmd: "get_user_shift_exchanges" },

  /** Get all shift exchange requests for approval (for managers). */
  GET_PENDING_SHIFT_EXCHANGES: { cmd: "get_pending_shift_exchanges" },

  /** Update user weekend off based on shift exchange or manual update. */
  USER_WEEKEND_UPDATE: { cmd: "user_weekend_update" },
};
