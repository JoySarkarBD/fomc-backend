/**
 * @fileoverview TCP message-pattern commands for the **DesignDesignation** domain.
 *
 * Used by the API Gateway and User microservice to communicate
 * designDesignation CRUD operations over the TCP transport.
 *
 * @module @shared/constants/designDesignation-command
 */

export const DESIGNATION_COMMANDS = {
  /** Retrieve a paginated list of designDesignations. */
  GET_DESIGNATIONS: { cmd: "get_designDesignations" },

  /** Retrieve a single designDesignation by ID (with permission & user counts). */
  GET_DESIGNATION: { cmd: "get_designDesignation" },

  /** Retrieve multiple designDesignations by their IDs. */
  GET_DESIGNATIONS_BY_IDS: { cmd: "get_designDesignations_by_ids" },

  /** Create a new designDesignation. */
  CREATE_DESIGNATION: { cmd: "create_designDesignation" },

  /** Update an existing designDesignation's name or description. */
  UPDATE_DESIGNATION: { cmd: "update_designDesignation" },

  /** Delete a designDesignation (blocked for system designDesignations or those in use). */
  DELETE_DESIGNATION: { cmd: "delete_designDesignation" },
} as const;
