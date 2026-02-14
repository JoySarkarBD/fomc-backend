export const ATTENDANCE_COMMANDS = {
  GET_ATTENDANCES: { cmd: "get_attendances" },
  GET_ATTENDANCE: { cmd: "get_attendance" },
  CREATE_ATTENDANCE: { cmd: "create_attendance" },
  UPDATE_ATTENDANCE: { cmd: "update_attendance" },
  DELETE_ATTENDANCE: { cmd: "delete_attendance" },
} as const;

export const ATTENDANCE_COMMAND_NAMES = {
  GET_ATTENDANCES: "get_attendances",
  GET_ATTENDANCE: "get_attendance",
  CREATE_ATTENDANCE: "create_attendance",
  UPDATE_ATTENDANCE: "update_attendance",
  DELETE_ATTENDANCE: "delete_attendance",
} as const;
