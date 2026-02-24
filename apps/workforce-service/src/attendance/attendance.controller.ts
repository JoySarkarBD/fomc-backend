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
import { GetAttendanceDto } from "./dto/get-attendance.dto";

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

  /**
   * Marks out attendance for a user.
   *
   * Message Pattern: { cmd: ATTENDANCE_COMMANDS.OUT_ATTENDANCE }
   *
   * @param {AuthUser} payload - The authenticated user for whom out attendance is being marked.
   * @returns {Promise<any>} Result of the out attendance marking process.
   */
  @MessagePattern(ATTENDANCE_COMMANDS.OUT_ATTENDANCE)
  async outAttendance(payload: AuthUser) {
    return await this.attendanceService.outAttendance(payload);
  }

  /**
   * Retrieves the attendance records for the authenticated user based on optional month and year filters.
   *
   * Message Pattern: { cmd: ATTENDANCE_COMMANDS.GET_MY_ATTENDANCE }
   *
   * @param {AuthUser} payload - The authenticated user whose attendance records are being retrieved.
   * @param {GetAttendanceDto} query - Optional query parameters for filtering attendance records by month and year.
   * @returns {Promise<any>} The attendance records matching the specified criteria or an error message if the retrieval fails.
   */
  @MessagePattern(ATTENDANCE_COMMANDS.GET_MY_ATTENDANCE)
  getMyAttendance(payload: { user: AuthUser; query: GetAttendanceDto }) {
    return this.attendanceService.getMyAttendance(payload.user, payload.query);
  }
}
