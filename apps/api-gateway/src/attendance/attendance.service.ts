/**
 * @fileoverview Attendance gateway service.
 *
 * Sends TCP commands to the Workforce micro-service for attendance
 * operations and normalises the response for the API layer.
 *
 * @module api-gateway/attendance
 */

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ATTENDANCE_COMMANDS } from "@shared/constants/attendance-command.constants";
import { AuthUser } from "@shared/interfaces/auth-user.interface";
import { GetAttendanceDto } from "apps/workforce-service/src/attendance/dto/get-attendance.dto";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";

@Injectable()
export class AttendanceService {
  constructor(
    @Inject("WORKFORCE_SERVICE") private readonly workforceClient: ClientProxy,
  ) {}

  /**
   * Marks the attendance of a user as present or late based on their check-in time and shift timings.
   *
   * @param user - The authenticated user for whom the attendance is being marked.
   * @return A promise that resolves to the attendance record if successfully marked, or an object containing a message and exception if there was an error (e.g., user not found, attendance already marked, no shift matched).
   */
  async presentAttendance(user: AuthUser) {
    const result = await firstValueFrom(
      this.workforceClient.send(ATTENDANCE_COMMANDS.PRESENT_ATTENDANCE, user),
    );

    switch (result?.exception) {
      case "NotFoundException":
        throw new NotFoundException(result.message);
      case "HttpException":
        throw new HttpException(result.message, HttpStatus.FORBIDDEN);
    }
    return buildResponse("Attendance marked", result);
  }

  /**
   * Retrieves the attendance records for the authenticated user based on optional month and year filters.
   *
   * @param user - The authenticated user whose attendance records are being retrieved.
   * @param query - Optional query parameters for filtering attendance records by month and year.
   * @return A promise that resolves to an array of attendance records matching the specified criteria, or an object containing a message and exception if there was an error during retrieval.
   */
  async getMyAttendance(user: AuthUser, query: GetAttendanceDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(ATTENDANCE_COMMANDS.GET_MY_ATTENDANCE, {
        user,
        query,
      }),
    );

    return buildResponse("Attendance retrieved", result);
  }
}
