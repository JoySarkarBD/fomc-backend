/**
 * @fileoverview TCP message-pattern commands for the **Leave** domain.
 *
 * Used by the API Gateway and User microservice to communicate
 * leave CRUD operations over the TCP transport.
 */

export const LEAVE_COMMANDS = {
  /** Create a new leave request. */
  CREATE_LEAVE_REQUEST: { cmd: "create_leave_request" },

  GET_ALL_PENDING_LEAVE_REQUESTS_FOR_AUTHORITY: {
    cmd: "get_all_pending_leave_requests_for_authority",
  },

  /** Get leave requests specific to a user based on query parameters. */
  GET_USER_SPECIFIC_LEAVE_REQUESTS: { cmd: "get_user_specific_leave_requests" },

  /** Get a specific leave request by ID. */
  GET_LEAVE_REQUEST_BY_ID: { cmd: "get_leave_request_by_id" },

  /** Update the approval status of a leave request by authority. */
  APPROVE_LEAVE_REQUEST_BY_AUTHORITY: {
    cmd: "approve_leave_request_by_authority",
  },

  /** Reject a leave request by authority. */
  REJECT_LEAVE_REQUEST_BY_AUTHORITY: {
    cmd: "reject_leave_request_by_authority",
  },
} as const;
