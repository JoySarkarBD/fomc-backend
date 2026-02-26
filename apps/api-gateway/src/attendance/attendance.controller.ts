/**
 * @fileoverview Attendance gateway controller.
 *
 * Exposes attendance-related HTTP endpoints. Currently a stub — route
 * handlers will be uncommented as the Workforce micro-service API stabilises.
 *
 * @module api-gateway/attendance
 */

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { UserIdDto } from "@shared/dto/mongo-id.dto";
import type { AuthUser } from "@shared/interfaces";
import { AttendanceByAuthorityDto } from "apps/workforce-service/src/attendance/dto/attendance-by-authority.dto";
import { GetAttendanceDto } from "apps/workforce-service/src/attendance/dto/get-attendance.dto";
import { WeekendExchangeByAuthorityDto } from "apps/workforce-service/src/attendance/dto/weekend-exchange-by-authority.dto";
import { UpdateByAuthorityWeekendSetDto } from "../../../workforce-service/src/attendance/dto/update-weekend-by-authority.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiRequestDetails } from "../common/decorators/api-request.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AttendanceService } from "./attendance.service";
import { MarkAttendanceAsAuthorityForbiddenDto } from "./dto/error/attendance/mark-as-authority/mark-as-authority-forbidden.dto";
import { MarkAttendanceAsAuthorityInternalErrorDto } from "./dto/error/attendance/mark-as-authority/mark-as-authority-internal-error.dto";
import { MarkAttendanceAsAuthorityNotFoundDtoDto } from "./dto/error/attendance/mark-as-authority/mark-as-authority-not-found.dto";
import { MarkAttendanceAsAuthorityUnauthorizedDto } from "./dto/error/attendance/mark-as-authority/mark-as-authority-unauthorized.dto";
import { MarkAttendanceAsAuthorityValidationDto } from "./dto/error/attendance/mark-as-authority/mark-as-authority-validation.dto";
import { MarkAttendanceForbiddenDto } from "./dto/error/attendance/mark-attendance/mark-attendance-forbidden.dto";
import { MarkAttendanceInternalErrorDto } from "./dto/error/attendance/mark-attendance/mark-attendance-internal-error.dto";
import { MarkAttendanceNotFoundDto } from "./dto/error/attendance/mark-attendance/mark-attendance-not-found.dto";
import { MarkAttendanceUnauthorizedDto } from "./dto/error/attendance/mark-attendance/mark-attendance-unauthorized.dto";
import { MarkOutAttendanceForbiddenDto } from "./dto/error/attendance/mark-out-attendance/mark-out-attendance-forbidden.dto";
import { MarkOutAttendanceInternalErrorDto } from "./dto/error/attendance/mark-out-attendance/mark-out-attendance-internal-error.dto";
import { MarkOutAttendanceNotFoundDto } from "./dto/error/attendance/mark-out-attendance/mark-out-attendance-not-found.dto";
import { MarkOutAttendanceUnauthorizedDto } from "./dto/error/attendance/mark-out-attendance/mark-out-attendance-unauthorized.dto";
import { MarkWeekendExchangeAsAuthorityForbiddenDto } from "./dto/error/attendance/mark-weekend-as-authority/mark-weekend-exchange-as-authority-forbidden.dto";
import { MarkWeekendExchangeAsAuthorityInternalErrorDto } from "./dto/error/attendance/mark-weekend-as-authority/mark-weekend-exchange-as-authority-internal-error.dto";
import { MarkWeekendExchangeAsAuthorityNotFoundDto } from "./dto/error/attendance/mark-weekend-as-authority/mark-weekend-exchange-as-authority-not-found.dto";
import { MarkWeekendExchangeAsAuthorityUnauthorizedDto } from "./dto/error/attendance/mark-weekend-as-authority/mark-weekend-exchange-as-authority-unauthorized.dto";
import { MarkWeekendExchangeAsAuthorityValidationDto } from "./dto/error/attendance/mark-weekend-as-authority/mark-weekend-exchange-as-validation.dto";
import { MyAttendanceForbiddenDto } from "./dto/error/attendance/my-attendance/my-attendance-forbidden.dto";
import { MyAttendanceInternalErrorDto } from "./dto/error/attendance/my-attendance/my-attendance-internal-error.dto";
import { MyAttendanceSuccessDto } from "./dto/error/attendance/my-attendance/my-attendance-success.dto";
import { MyAttendanceUnauthorizedDto } from "./dto/error/attendance/my-attendance/my-attendance-unauthorized.dto";
import { MyAttendanceValidationDto } from "./dto/error/attendance/my-attendance/my-attendance-validation.dto";
import { SingleUserAttendanceForbiddenDto } from "./dto/error/attendance/single-user-attendance/single-user-attendance-forbidden.dto";
import { SingleUserAttendanceInternalErrorDto } from "./dto/error/attendance/single-user-attendance/single-user-attendance-internal-error.dto";
import { SingleUserAttendanceNotFoundDto } from "./dto/error/attendance/single-user-attendance/single-user-attendance-not-found.dto";
import { SingleUserAttendanceUnauthorizedDto } from "./dto/error/attendance/single-user-attendance/single-user-attendance-unauthorized.dto";
import { SingleUserAttendanceValidationDto } from "./dto/error/attendance/single-user-attendance/single-user-attendance-validation.dto";
import { UpdateByAuthorityWeekendSetForbiddenDto } from "./dto/error/attendance/update-weekend/update-weekend-forbidden.dto";
import { UpdateByAuthorityWeekendSetInternalErrorDto } from "./dto/error/attendance/update-weekend/update-weekend-internal-error.dto";
import { UpdateByAuthorityWeekendSetNotFoundDto } from "./dto/error/attendance/update-weekend/update-weekend-not-found.dto";
import { UpdateByAuthorityWeekendSetUnauthorizedDto } from "./dto/error/attendance/update-weekend/update-weekend-unauthorized.dto";
import { UpdateByAuthorityWeekendSetValidationDto } from "./dto/error/attendance/update-weekend/update-weekend-validation.dto";
import {
  MarkAttendanceAsAuthoritySuccessDto,
  MarkAttendanceSuccessDto,
  MarkOutAttendanceSuccessDto,
  MarkWeekendExchangeByAuthoritySuccessDto,
  SingleUserAttendanceSuccessDto,
  UpdateByAuthorityWeekendSetSuccessDto,
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
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(MarkAttendanceSuccessDto, 201)
  @ApiErrorResponses({
    unauthorized: MarkAttendanceUnauthorizedDto,
    forbidden: MarkAttendanceForbiddenDto,
    notFound: MarkAttendanceNotFoundDto,
    internal: MarkAttendanceInternalErrorDto,
  })
  @Post("present")
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
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
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    queries: [
      {
        name: "month",
        required: true,
        type: Number,
        example: 8,
      },
      {
        name: "year",
        required: true,
        type: Number,
        example: 2026,
      },
    ],
    queryDto: GetAttendanceDto,
  })
  @ApiSuccessResponse(MyAttendanceSuccessDto, 200)
  @ApiErrorResponses({
    validation: MyAttendanceValidationDto,
    unauthorized: MyAttendanceUnauthorizedDto,
    forbidden: MyAttendanceForbiddenDto,
    internal: MyAttendanceInternalErrorDto,
  })
  @Get("my-attendance")
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
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
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(MarkOutAttendanceSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: MarkOutAttendanceUnauthorizedDto,
    forbidden: MarkOutAttendanceForbiddenDto,
    notFound: MarkOutAttendanceNotFoundDto,
    internal: MarkOutAttendanceInternalErrorDto,
  })
  @Post("out")
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  async outAttendance(@GetUser() user: AuthUser) {
    return this.attendanceService.outAttendance(user);
  }

  /**
   * Retrieves attendance records for a specific user based on optional month and year filters.
   *
   * @guards RolesGuard - Ensures that only users with specific roles can access this endpoint.
   * @param userId - The ID of the user whose attendance records are being retrieved.
   * @param query - Optional query parameters for filtering attendance records by month and year.
   * @returns The attendance records for the specified user matching the specified criteria or an error message if the retrieval fails.
   * @remarks This endpoint allows HR, Project Managers, and Team Leaders to retrieve attendance records for a specific user. It checks if the authenticated user has the necessary roles to access this information and then retrieves the attendance records based on the provided user ID and optional filters for month and year.
   */
  @ApiOperation({
    summary:
      "Get specific user attendance records - HR, PROJECT MANAGER, TEAM LEADER only",
    description: "Retrieves attendance records for a specific user.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: {
      name: "userId",
      description:
        "The ID of the user whose attendance records are being retrieved",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    queries: [
      {
        name: "month",
        required: true,
        type: Number,
        example: 8,
      },
      {
        name: "year",
        required: true,
        type: Number,
        example: 2026,
      },
    ],
    paramDto: UserIdDto,
    queryDto: GetAttendanceDto,
  })
  @ApiSuccessResponse(SingleUserAttendanceSuccessDto, 200)
  @ApiErrorResponses({
    validation: SingleUserAttendanceValidationDto,
    notFound: SingleUserAttendanceNotFoundDto,
    unauthorized: SingleUserAttendanceUnauthorizedDto,
    forbidden: SingleUserAttendanceForbiddenDto,
    internal: SingleUserAttendanceInternalErrorDto,
  })
  @Get("user-attendance/:userId")
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER")
  async getSpecificUserAttendance(
    @Param() params: UserIdDto,
    @Query() query: GetAttendanceDto,
  ) {
    return await this.attendanceService.getSpecificUserAttendance(
      params.userId,
      query,
    );
  }

  /**
   * Updates the weekend off for a specific user.
   *
   * @guards RolesGuard - Ensures that only users with specific roles can access this endpoint.
   * @param params - The parameters containing the user ID for whom the weekend off is being updated.
   * @param body - The body containing the new weekend off values to be set for the user.
   * @returns Result of the weekend off update process.
   * @remarks This endpoint allows HR, Project Managers, and Team Leaders to update the weekend off for a specific user. It checks if the authenticated user has the necessary roles to perform this action and then updates the user's weekend off based on the provided user ID and new weekend off values.
   */
  @ApiOperation({
    summary: "Update weekend by authority",
    description:
      "Allows the authenticated user to update their and others weekend off.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: {
      name: "userId",
      description:
        "The ID of the user with whom the authenticated user wants to update their weekend off",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: UserIdDto,
  })
  @ApiBody({
    description: "The weekend off values to be set for the user",
    type: UpdateByAuthorityWeekendSetDto,
  })
  @ApiSuccessResponse(UpdateByAuthorityWeekendSetSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: UpdateByAuthorityWeekendSetUnauthorizedDto,
    validation: UpdateByAuthorityWeekendSetValidationDto,
    notFound: UpdateByAuthorityWeekendSetNotFoundDto,
    forbidden: UpdateByAuthorityWeekendSetForbiddenDto,
    internal: UpdateByAuthorityWeekendSetInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER")
  @Patch("update-weekend-by-authority/:userId")
  async UpdateWeekendOff(
    @Param() params: UserIdDto,
    @Body() body: UpdateByAuthorityWeekendSetDto,
  ) {
    return await this.attendanceService.UpdateWeekendOff(
      params.userId,
      body.weekEndOff,
    );
  }

  /**
   * Marks attendance for a user on behalf of an authority (e.g., manager) by creating or updating an attendance record for a specific date with the provided attendance type and shift type.
   *
   * Message Pattern: { cmd: ATTENDANCE_COMMANDS.MARK_ATTENDANCE_BY_AUTHORITY }
   *
   * @param attendanceDetails - An object containing the details of the attendance to be marked, including the user ID for whom attendance is being marked, the attendance type (e.g., present, late, absent), optional date (defaults to today if not provided), optional shift type, and optional late status.
   * @return A promise that resolves to the created or updated attendance record if successfully marked, or an object containing a message and exception if there was an error during the marking process.
   * @remarks This endpoint allows an authority (e.g., manager) to mark attendance for a user by providing the necessary details in the request body. The service will handle the logic to create or update the attendance record based on the provided information and return the appropriate response.
   */
  @ApiOperation({
    summary: "Mark attendance by authority",
    description:
      "Allows an authority (e.g., manager) to mark attendance for a user by providing the necessary details in the request body.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiBody({
    description: "The details of the attendance to be marked",
    type: AttendanceByAuthorityDto,
  })
  @ApiRequestDetails({
    params: {
      name: "userId",
      description:
        "The ID of the user for whom the attendance is being marked by the authority",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: UserIdDto,
  })
  @ApiSuccessResponse(MarkAttendanceAsAuthoritySuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: MarkAttendanceAsAuthorityUnauthorizedDto,
    notFound: MarkAttendanceAsAuthorityNotFoundDtoDto,
    validation: MarkAttendanceAsAuthorityValidationDto,
    forbidden: MarkAttendanceAsAuthorityForbiddenDto,
    internal: MarkAttendanceAsAuthorityInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER")
  @Patch("mark-attendance-by-authority/:userId")
  async markAttendanceByAuthority(
    @Param() params: UserIdDto,
    @Body() attendanceDetails: AttendanceByAuthorityDto,
  ) {
    return await this.attendanceService.markAttendanceAsAuthority(
      params.userId,
      attendanceDetails,
    );
  }

  /**
   * Marks the weekend exchange for a user on behalf of an authority (e.g., manager) by sending a command to the Workforce micro-service to create a weekend exchange record with the provided original weekend date and new off date. Validates that the user exists and that there are no existing exchanges for the same original weekend date before creating the new exchange record.
   *
   * Message Pattern: { cmd: ATTENDANCE_COMMANDS.WEEKEND_EXCHANGE_BY_AUTHORITY }
   *
   * @param weekEndExchange - An object containing the original weekend date to be exchanged and the new off date after exchange.
   * @return A promise that resolves to a success message if the weekend exchange was marked successfully, or an object containing a message and exception if there was an error during the marking process (e.g., user not found, existing exchange for the original weekend date).
   * @remarks This endpoint allows an authority (e.g., manager) to mark the weekend exchange for a user by providing the necessary details in the request body. The service will handle the logic to create the weekend exchange record based on the provided information and return the appropriate response.
   */
  @ApiOperation({
    summary: "Weekend exchange by authority",
    description:
      "Allows an authority (e.g., manager) to mark the weekend exchange for a user by providing the original weekend date and new off date in the request body.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiBody({
    description: "The details of the weekend exchange to be marked",
    type: WeekendExchangeByAuthorityDto,
  })
  @ApiRequestDetails({
    params: {
      name: "userId",
      description:
        "The ID of the user for whom the weekend exchange is being marked by the authority",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: UserIdDto,
  })
  @ApiSuccessResponse(MarkWeekendExchangeByAuthoritySuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: MarkWeekendExchangeAsAuthorityUnauthorizedDto,
    notFound: MarkWeekendExchangeAsAuthorityNotFoundDto,
    validation: MarkWeekendExchangeAsAuthorityValidationDto,
    forbidden: MarkWeekendExchangeAsAuthorityForbiddenDto,
    internal: MarkWeekendExchangeAsAuthorityInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER")
  @Patch("weekend-exchange-by-authority/:userId")
  async weekendExchangeByAuthority(
    @Param() params: UserIdDto,
    @Body() body: WeekendExchangeByAuthorityDto,
  ) {
    return await this.attendanceService.weekendExchangeByAuthority(
      params.userId,
      body,
    );
  }
}
