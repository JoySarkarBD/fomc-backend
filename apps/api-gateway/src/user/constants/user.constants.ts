/**
 * User-related command constants for the API Gateway.
 * These constants define the command names used for communication with the User Service via the message broker (e.g., RabbitMQ).
 * By centralizing these command names in a single file, it promotes better maintainability and consistency across the API Gateway when sending messages to the User Service for various user-related operations such as creating, updating, retrieving, and deleting users, as well as handling password reset functionality.
 * Each command is defined as a constant object with a `cmd` property, which represents the actual command name that will be used in the message payload when sending requests to the User Service. This approach helps to avoid hardcoding command names throughout the codebase and reduces the likelihood of typos or inconsistencies when referencing these commands in different parts of the API Gateway.
 * Developers can import these constants wherever they need to send messages to the User Service, ensuring that all references to user-related commands are consistent and easily manageable from a single location.
 */
export const USER_COMMANDS = {
  GET_USERS: { cmd: "get_users" },
  GET_USER: { cmd: "get_user" },
  CREATE_USER: { cmd: "create_user" },
  UPDATE_USER: { cmd: "update_user" },
  DELETE_USER: { cmd: "delete_user" },
  FIND_BY_EMAIL: { cmd: "find_user_by_email" },
  SET_RESET_PASSWORD_OTP: { cmd: "set_reset_password_otp" },
  RESET_PASSWORD: { cmd: "reset_password" },
  CHANGE_PASSWORD: { cmd: "change_password" },
} as const;

/**
 * USER_COMMAND_NAMES is a simplified version of USER_COMMANDS that maps each command to its string name directly.
 * This can be useful in scenarios where only the command name is needed without the additional structure of an object.
 * It provides a straightforward way to reference command names as simple string constants throughout the codebase, improving readability and reducing verbosity when only the command name is required.
 */
export const USER_COMMAND_NAMES = {
  GET_USERS: "get_users",
  GET_USER: "get_user",
  CREATE_USER: "create_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",
  FIND_BY_EMAIL: "find_user_by_email",
  SET_RESET_PASSWORD_OTP: "set_reset_password_otp",
  RESET_PASSWORD: "reset_password",
  CHANGE_PASSWORD: "change_password",
} as const;
