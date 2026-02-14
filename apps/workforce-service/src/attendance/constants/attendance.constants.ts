export const ATTENDANCE_COMMANDS = {
  PRESENT_ATTENDANCE: "present_attendance",
  OUT_ATTENDANCE: "out_attendance",
  WEEKEND_EXCHANGE: "weekend_exchange",
} as const;

export const ATTENDANCE_COMMAND_NAMES = {
  PRESENT_ATTENDANCE: "present_attendance",
  OUT_ATTENDANCE: "out_attendance",
  WEEKEND_EXCHANGE: "weekend_exchange",
} as const;

/* 
  attendance logic:-
  for the sales department er jonno 3 ta shifting

  shift-timing er sathe 15 min er modhye attendance mark korte hobe, otherwise late mark hobe
*/
export const ATTENDANCE_SALES_SHIFT_TIMINGS = {
  MORNING_SHIFT: { start: "07:00", end: "15:00" },
  EVENING_SHIFT: { start: "15:00", end: "23:00" },
  NIGHT_SHIFT: { start: "23:00", end: "07:00" },
} as const;

/**
 * attendance logic:-
 * operation department er jonno ekta shifting
 * shift-timing er sathe 15 min er modhye attendance mark korte hobe, otherwise late mark hobe
 *
 * in future shifting multiple hote pare
 */
export const ATTENDANCE_OPERATION_SHIFT_TIMINGS = {
  DAY_SHIFT: { start: "09:00", end: "18:00" },
  NIGHT_SHIFT: { start: "18:00", end: "03:00" },
} as const;
