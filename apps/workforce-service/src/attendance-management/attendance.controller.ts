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
import { UserIdDto } from "@shared/dto/mongo-id.dto";
import type { AuthUser } from "@shared/interfaces";
import { AttendanceService } from "./attendance.service";
import { AttendanceByAuthorityDto } from "./dto/attendance-by-authority.dto";
import { GetAttendanceDto } from "./dto/get-attendance.dto";
import { WeekendExchangeByAuthorityDto } from "./dto/weekend-exchange-by-authority.dto";

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

  /**
   * Retrieves the attendance records for a specific user based on optional month and year filters.
   *
   * Message Pattern: { cmd: ATTENDANCE_COMMANDS.GET_SPECIFIC_USER_ATTENDANCE }
   *
   * @param {Object} payload - The payload containing the userId and query parameters.
   * @param {string} payload.userId - The unique identifier of the user whose attendance records are being retrieved.
   * @param {GetAttendanceDto} payload.query - Optional query parameters for filtering attendance records by month and year.
   * @returns {Promise<any>} A promise that resolves to an array of attendance records matching the specified criteria for the given user, or an object containing a message and exception if there was an error during retrieval.
   */
  @MessagePattern(ATTENDANCE_COMMANDS.GET_SPECIFIC_USER_ATTENDANCE)
  async getSpecificUserAttendance(payload: {
    userId: UserIdDto["userId"];
    query: GetAttendanceDto;
  }) {
    return await this.attendanceService.getSpecificUserAttendance(
      payload.userId,
      payload.query,
    );
  }

  /**
   * Marks attendance for a user on behalf of an authority (e.g., manager) by creating or updating an attendance record for a specific date with the provided attendance type and shift type.
   *
   * Message Pattern: { cmd: ATTENDANCE_COMMANDS.MARK_ATTENDANCE_BY_AUTHORITY }
   *
   * @param {Object} payload - The payload containing the userId and attendance details.
   * @param {string} userId - The unique identifier of the user for whom attendance is being marked.
   * @param {AttendanceByAuthorityDto} payload - An object containing the details of the attendance to be marked, including the attendance type (e.g., present, late, absent), optional date (defaults to today if not provided), optional shift type, and optional late status.
   * @return {Promise<any>} A promise that resolves to the created or updated attendance record if successfully marked, or an object containing a message and exception if there was an error during the marking process.
   */
  @MessagePattern(ATTENDANCE_COMMANDS.MARK_ATTENDANCE_BY_AUTHORITY)
  async markAttendanceAsAuthority(payload: {
    userId: UserIdDto["userId"];
    attendanceDetails: AttendanceByAuthorityDto;
  }) {
    return await this.attendanceService.markAttendanceAsAuthority(
      payload.userId,
      payload.attendanceDetails,
    );
  }

  /**
   * Swaps a weekend day with a working day on behalf of an authority (e.g., manager) by updating the user's weekend off days to the specified values.
   *
   * Message Pattern: { cmd: ATTENDANCE_COMMANDS.WEEKEND_EXCHANGE_BY_AUTHORITY }
   *
   * @param {Object} payload - The payload containing the userId and new weekend off days.
   * @param {string} payload.userId - The unique identifier of the user whose weekend off days are being updated.
   * @param {string[]} payload.weekEndExchange - An array of strings representing the new weekend off days to be set for the user (e.g., ["Saturday", "Sunday"]).
   * @returns {Promise<any>} A promise that resolves to the updated user record with the new weekend off days if the update is successful, or an object containing a message and exception if there was an error during the update process.
   */
  @MessagePattern(ATTENDANCE_COMMANDS.WEEKEND_EXCHANGE_BY_AUTHORITY)
  async weekendExchangeByAuthority(payload: {
    userId: UserIdDto["userId"];
    weekEndExchange: WeekendExchangeByAuthorityDto;
  }) {
    return await this.attendanceService.weekendExchangeByAuthority(
      payload.userId,
      payload.weekEndExchange,
    );
  }
}
