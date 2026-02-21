/**
 * @fileoverview Attendance gateway controller.
 *
 * Exposes attendance-related HTTP endpoints. Currently a stub — route
 * handlers will be uncommented as the Workforce micro-service API stabilises.
 *
 * @module api-gateway/attendance
 */

import { Controller, Post, UseGuards } from "@nestjs/common";
import type { AuthUser } from "@shared/interfaces";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AttendanceService } from "./attendance.service";

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
  @Post("present")
  @UseGuards(RolesGuard)
  @Roles("HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE", "INTERN")
  async presentAttendance(@GetUser() user: AuthUser) {
    return this.attendanceService.presentAttendance(user);
  }
}
