/**
 * @fileoverview TCP message-pattern commands for the **User** domain.
 *
 * Both the API Gateway and the User microservice import these
 * constants so that producers and consumers always agree on
 * the exact command strings.
 *
 * @module @shared/constants/user-command
 */

export const USER_COMMANDS = {
  /** Retrieve a paginated list of users. */
  GET_USERS: { cmd: "get_users" },

  /** Retrieve a single user by ID. */
  GET_USER: { cmd: "get_user" },

  /** Create a new user account. */
  CREATE_USER: { cmd: "create_user" },

  /** Update an existing user. */
  UPDATE_USER: { cmd: "update_user" },

  /** Soft-delete or remove a user. */
  DELETE_USER: { cmd: "delete_user" },

  /** Look up a user by their email address. */
  FIND_BY_EMAIL: { cmd: "find_user_by_email" },

  /** Store a password-reset OTP against a user. */
  SET_RESET_PASSWORD_OTP: { cmd: "set_reset_password_otp" },

  /** Verify OTP and reset the user's password. */
  RESET_PASSWORD: { cmd: "reset_password" },

  /** Change a user's password (requires current password). */
  CHANGE_PASSWORD: { cmd: "change_password" },

  GET_USERS_BY_DESIGNATION: { cmd: "get_users_by_designation" },

  /* Get users count by designation */
  GET_USERS_COUNT_BY_DESIGNATION: { cmd: "get_users_count_by_designation" },

  UPDATE_USER_PROFILE: { cmd: "update_user_profile" },
} as const;
