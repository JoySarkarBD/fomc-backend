/**
 * @fileoverview Attendance gateway controller.
 *
 * Exposes attendance-related HTTP endpoints. Currently a stub — route
 * handlers will be uncommented as the Workforce micro-service API stabilises.
 *
 * @module api-gateway/attendance
 */

import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { AuthUser } from "@shared/interfaces";
import { GetAttendanceDto } from "apps/workforce-service/src/attendance/dto/get-attendance.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AttendanceService } from "./attendance.service";
import { MarkAttendanceForbiddenDto } from "./dto/error/attendance/mark-attendance/mark-attendance-forbidden.dto";
import { MarkAttendanceInternalErrorDto } from "./dto/error/attendance/mark-attendance/mark-attendance-internal-error.dto";
import { MarkAttendanceNotFoundDto } from "./dto/error/attendance/mark-attendance/mark-attendance-not-found.dto";
import { MarkAttendanceUnauthorizedDto } from "./dto/error/attendance/mark-attendance/mark-attendance-unauthorized.dto";
import { MarkOutAttendanceForbiddenDto } from "./dto/error/attendance/mark-out-attendance/mark-out-attendance-forbidden.dto";
import { MarkOutAttendanceInternalErrorDto } from "./dto/error/attendance/mark-out-attendance/mark-out-attendance-internal-error.dto";
import { MarkOutAttendanceNotFoundDto } from "./dto/error/attendance/mark-out-attendance/mark-out-attendance-not-found.dto";
import { MarkOutAttendanceUnauthorizedDto } from "./dto/error/attendance/mark-out-attendance/mark-out-attendance-unauthorized.dto";
import { MyAttendanceForbiddenDto } from "./dto/error/attendance/my-attendance/my-attendance-forbidden.dto";
import { MyAttendanceInternalErrorDto } from "./dto/error/attendance/my-attendance/my-attendance-internal-error.dto";
import { MyAttendanceSuccessDto } from "./dto/error/attendance/my-attendance/my-attendance-success.dto";
import { MyAttendanceUnauthorizedDto } from "./dto/error/attendance/my-attendance/my-attendance-unauthorized.dto";
import { MyAttendanceValidationDto } from "./dto/error/attendance/my-attendance/my-attendance-validation.dto";
import {
  MarkAttendanceSuccessDto,
  MarkOutAttendanceSuccessDto,
} from "./dto/success/attendance-success.dto";

@ApiTags("Attendance")
@Controller("attendance")
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * Marks attendance for a user.
   *
   * @guards RolesGuard - Ensures that only users with specific roles can access this endpoint.
   * @param user - The authenticated user for whom attendance is being marked.
   * @returns Result of the attendance marking process.
   */
  @ApiOperation({
    summary: "Mark attendance",
    description: "Marks the authenticated user as present.",
  })
  @ApiBearerAuth("authorization")
  @ApiSuccessResponse(MarkAttendanceSuccessDto, 201)
  @ApiErrorResponses({
    unauthorized: MarkAttendanceUnauthorizedDto,
    forbidden: MarkAttendanceForbiddenDto,
    notFound: MarkAttendanceNotFoundDto,
    internal: MarkAttendanceInternalErrorDto,
  })
  @Post("present")
  @UseGuards(RolesGuard)
  @Roles("HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  async presentAttendance(@GetUser() user: AuthUser) {
    return this.attendanceService.presentAttendance(user);
  }

  /**
   * Retrieves the attendance records for the authenticated user based on optional month and year filters.
   *
   * @guards RolesGuard - Ensures that only users with specific roles can access this endpoint.
   * @param user - The authenticated user whose attendance records are being retrieved.
   * @param query - Optional query parameters for filtering attendance records by month and year.
   * @returns The attendance records matching the specified criteria or an error message if the retrieval fails.
   */
  @ApiOperation({
    summary: "Get my attendance",
    description: "Retrieves attendance records for the authenticated user.",
  })
  @ApiBearerAuth("authorization")
  @ApiSuccessResponse(MyAttendanceSuccessDto, 200)
  @ApiErrorResponses({
    validation: MyAttendanceValidationDto,
    unauthorized: MyAttendanceUnauthorizedDto,
    forbidden: MyAttendanceForbiddenDto,
    internal: MyAttendanceInternalErrorDto,
  })
  @Get("my-attendance")
  @UseGuards(RolesGuard)
  @Roles("HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  async getMyAttendance(
    @GetUser() user: AuthUser,
    @Query() query: GetAttendanceDto,
  ) {
    return await this.attendanceService.getMyAttendance(user, query);
  }

  /**
   * Marks out attendance for a user.
   *
   * @guards RolesGuard - Ensures that only users with specific roles can access this endpoint.
   * @param user - The authenticated user for whom out attendance is being marked.
   * @returns Result of the out attendance marking process.
   * @remarks This endpoint allows users to mark their attendance as "out" at the end of the day. It checks if the user has already marked "present" for the day and if they have already marked "out". If the checks pass, it updates the attendance record with the check-out time.
   */
  @ApiOperation({
    summary: "Mark out attendance",
    description: "Marks the authenticated user as out for the day.",
  })
  @ApiBearerAuth("authorization")
  @ApiSuccessResponse(MarkOutAttendanceSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: MarkOutAttendanceUnauthorizedDto,
    forbidden: MarkOutAttendanceForbiddenDto,
    notFound: MarkOutAttendanceNotFoundDto,
    internal: MarkOutAttendanceInternalErrorDto,
  })
  @Post("out")
  @UseGuards(RolesGuard)
  @Roles("HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  async outAttendance(@GetUser() user: AuthUser) {
    return this.attendanceService.outAttendance(user);
  }

  // @ApiOperation({
  //   summary: "Get team attendance list",
  //   description: "Retrieves attendance records for team members.",
  // })
  // @ApiBearerAuth("authorization")
  // @ApiSuccessResponse(AttendanceListSuccessDto, 200, true)
  // @ApiErrorResponses({
  //   unauthorized: AttendanceListUnauthorizedDto,
  //   forbidden: AttendanceListForbiddenDto,
  //   validation: AttendanceListValidationDto,
  //   internal: AttendanceListInternalErrorDto,
  // })
  // @Get()
  // @UseGuards(RolesGuard)
  // @Roles("HR", "PROJECT MANAGER")
  // async getAttendanceList(
  //   @GetUser() user: AuthUser,
  //   @Query() query: GetAttendanceDto,
  // ) {
  //   return this.attendanceService.getAttendanceList(user, query);
  // }
}
