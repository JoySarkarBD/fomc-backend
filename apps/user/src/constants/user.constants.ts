export const USER_COMMANDS = {
  GET_USERS: { cmd: 'get_users' },
  GET_USER: { cmd: 'get_user' },
  CREATE_USER: { cmd: 'create_user' },
  UPDATE_USER: { cmd: 'update_user' },
  DELETE_USER: { cmd: 'delete_user' },
} as const;

export const USER_COMMAND_NAMES = {
  GET_USERS: 'get_users',
  GET_USER: 'get_user',
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
} as const;
