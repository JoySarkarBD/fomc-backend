/**
 * @fileoverview Attendance Controller
 *
 * Handles attendance-related microservice message patterns in the Workforce service.
 *
 * @todo Implement message handlers for present attendance, out attendance,
 *       and weekend exchange once the service layer is finalized.
 */
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ATTENDANCE_COMMANDS } from "@shared/constants";
import type { AuthUser } from "@shared/interfaces";
import { AttendanceService } from "./attendance.service";

/**
 * Attendance Controller
 *
 * Handles all attendance-related microservice message patterns.
 * Communicates through message-based transport (e.g., TCP, RMQ, Kafka).
 */
@Controller()
export class AttendanceController {
  /**
   * Creates an instance of AttendanceController.
   *
   * @param {AttendanceService} attendanceService - Service layer responsible for attendance business logic.
   */
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * Marks attendance for a user.
   *
   * Message Pattern: { cmd: ATTENDANCE_COMMANDS.PRESENT_ATTENDANCE }
   *
   * @param {AuthUser} payload - The authenticated user for whom attendance is being marked.
   * @returns {Promise<any>} Result of the attendance marking process.
   */
  @MessagePattern(ATTENDANCE_COMMANDS.PRESENT_ATTENDANCE)
  presentAttendance(payload: AuthUser) {
    return this.attendanceService.presentAttendance(payload);
  }

  // @MessagePattern(ATTENDANCE_COMMANDS.OUT_ATTENDANCE)
  /*   outAttendance(@Payload() outAttendanceDto: OutAttendanceDto) {
    return this.attendanceService.outAttendance(outAttendanceDto);
  } */
}
