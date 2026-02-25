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
import { USER_COMMANDS } from "@shared/constants";
import { ATTENDANCE_COMMANDS } from "@shared/constants/attendance-command.constants";
import { UserIdDto } from "@shared/dto/mongo-id.dto";
import { AuthUser } from "@shared/interfaces/auth-user.interface";
import { AttendanceByAuthorityDto } from "apps/workforce-service/src/attendance/dto/attendance-by-authority.dto";
import { GetAttendanceDto } from "apps/workforce-service/src/attendance/dto/get-attendance.dto";
import { firstValueFrom } from "rxjs";
import { WeekendSetDto } from "../../../workforce-service/src/attendance/dto/update-weekend-by-authority.dto";
import { buildResponse } from "../common/response.util";

@Injectable()
export class AttendanceService {
  constructor(
    @Inject("WORKFORCE_SERVICE") private readonly workforceClient: ClientProxy,
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
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

  /**
   * Marks out attendance for a user.
   *
   * @param user - The authenticated user for whom out attendance is being marked.
   * @return A promise that resolves to a success message if the out attendance was marked successfully, or an object containing a message and exception if there was an error (e.g., attendance record not found, invalid operation).
   */
  async outAttendance(user: AuthUser) {
    const result = await firstValueFrom(
      this.workforceClient.send(ATTENDANCE_COMMANDS.OUT_ATTENDANCE, user),
    );

    switch (result?.exception) {
      case "NotFoundException":
        throw new NotFoundException(result.message);
      case "HttpException":
        throw new HttpException(result.message, HttpStatus.FORBIDDEN);
    }

    return buildResponse("Attendance marked as out", result);
  }

  /**
   * Retrieves attendance records for a specific user based on optional month and year filters.
   *
   * @param userId - The ID of the user whose attendance records are being retrieved.
   * @param query - Optional query parameters for filtering attendance records by month and year.
   * @return A promise that resolves to an array of attendance records for the specified user matching the specified criteria, or an object containing a message and exception if there was an error during retrieval.
   */
  async getSpecificUserAttendance(
    userId: UserIdDto["userId"],
    query: GetAttendanceDto,
  ) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        ATTENDANCE_COMMANDS.GET_SPECIFIC_USER_ATTENDANCE,
        {
          userId,
          query,
        },
      ),
    );

    return buildResponse("Attendance retrieved", result);
  }

  /**
   * Sets the weekend off for a user by sending a command to the User micro-service to update the user's weekend off preferences.
   *
   * @param userId - The ID of the user whose weekend off is being set.
   * @param weekEndOff - An array of strings representing the weekend off values to be set for the user (e.g., ["SUNDAY", "SATURDAY"]).
   * @return A promise that resolves to a success message if the weekend off was set successfully, or an object containing a message and exception if there was an error during the process (e.g., user not found, invalid weekend off values).
   */
  async UpdateWeekendOff(
    userId: UserIdDto["userId"],
    weekEndOff: WeekendSetDto["weekEndOff"],
  ) {
    const result = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.UPDATE_WEEKEND_OFF, {
        userId,
        weekEndOff,
      }),
    );

    switch (result?.exception) {
      case "NotFoundException":
        throw new NotFoundException(result.message);
    }

    return buildResponse("Weekend set successfully", result);
  }

  /**
   * Marks attendance for a user by an authority (e.g., HR, Manager).
   *
   * @param userId - The ID of the user whose attendance is being marked.
   * @param attendanceDetails - The details of the attendance to be marked.
   * @return A promise that resolves to a success message if the attendance was marked successfully, or an object containing a message and exception if there was an error during the process (e.g., user not found, invalid attendance details).
   */
  async markAttendanceAsAuthority(
    userId: UserIdDto["userId"],
    attendanceDetails: AttendanceByAuthorityDto,
  ) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        ATTENDANCE_COMMANDS.MARK_ATTENDANCE_BY_AUTHORITY,
        {
          userId,
          attendanceDetails,
        },
      ),
    );

    return buildResponse("Attendance marked by authority", result);
  }
}
