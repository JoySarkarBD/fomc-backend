/**
 * @fileoverview TCP message-pattern commands for the **Project** domain.
 *
 * Used by the API Gateway and Workforce microservice to communicate
 * project CRUD operations over the TCP transport.
 */

export const PROJECT_COMMANDS = {
  /** Retrieve all projects. */
  GET_PROJECTS: { cmd: "get_projects" },

  /** Retrieve a single project by ID. */
  GET_PROJECT: { cmd: "get_project" },

  /** Create a new project. */
  CREATE_PROJECT: { cmd: "create_project" },

  /** Update an existing project. */
  UPDATE_PROJECT: { cmd: "update_project" },

  /** Delete a project. */
  DELETE_PROJECT: { cmd: "delete_project" },

  /** Create a new client. */
  CREATE_CLIENT: { cmd: "create_client" },

  /** Retrieve all clients. */
  GET_CLIENTS: { cmd: "get_clients" },

  /** Update an existing client. */
  UPDATE_CLIENT: { cmd: "update_client" },

  /** Delete a client. */
  DELETE_CLIENT: { cmd: "delete_client" },

  /** Create a new profile. */
  CREATE_PROFILE: { cmd: "create_profile" },

  /** Retrieve all profiles. */
  GET_PROFILES: { cmd: "get_profiles" },

  /** Update an existing profile. */
  UPDATE_PROFILE: { cmd: "update_profile" },

  /** Delete a profile. */
  DELETE_PROFILE: { cmd: "delete_profile" },
} as const;
