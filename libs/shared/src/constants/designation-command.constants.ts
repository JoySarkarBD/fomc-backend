/**
 * @fileoverview TCP message-pattern commands for the **Designation** domain.
 *
 * Used by the API Gateway and User microservice to communicate
 * designation CRUD operations over the TCP transport.
 *
 * @module @shared/constants/designDesignation-command
 */

export const DESIGNATION_COMMANDS = {
  /** Retrieve a paginated list of designations. */
  GET_DESIGNATIONS: { cmd: "get_designations" },

  /** Retrieve a single designation by ID (with permission & user counts). */
  GET_DESIGNATION: { cmd: "get_designation" },

  /** Retrieve multiple designations by their IDs. */
  GET_DESIGNATIONS_BY_IDS: { cmd: "get_designations_by_ids" },

  /** Create a new designation. */
  CREATE_DESIGNATION: { cmd: "create_designation" },

  /** Update an existing designation's name or description. */
  UPDATE_DESIGNATION: { cmd: "update_designation" },

  /** Delete a designation (blocked for system designations or those in use). */
  DELETE_DESIGNATION: { cmd: "delete_designation" },
} as const;
