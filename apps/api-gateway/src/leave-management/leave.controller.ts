/**
 * @fileoverview Attendance gateway controller.
 *
 * Exposes attendance-related HTTP endpoints. Currently a stub — route
 * handlers will be uncommented as the Workforce micro-service API stabilises.
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
import { ApiTags } from "@nestjs/swagger";
import { MongoIdDto, UserIdDto } from "@shared/dto";
import type { AuthUser } from "@shared/interfaces";
import { GetLeaveDto } from "apps/workforce-service/src/leave-management/dto/get-leave.dto";
import { LeaveRequestDto } from "apps/workforce-service/src/leave-management/dto/leave-request.dto";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { LeaveService } from "./leave.service";

@ApiTags("Leave Management")
@Controller("leave")
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Post("request")
  async createLeaveRequest(
    @GetUser() user: AuthUser,
    @Body() data: LeaveRequestDto,
  ) {
    return await this.leaveService.createLeaveRequest(
      (user._id ?? user.id) as UserIdDto["userId"],
      data,
    );
  }

  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Get("my-leaves")
  async getMyLeaves(@GetUser() user: AuthUser, @Query() query: GetLeaveDto) {
    return await this.leaveService.getUserSpecificLeaves(
      (user._id ?? user.id) as UserIdDto["userId"],
      query,
    );
  }

  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Get("user-specific/:userId")
  async getUserSpecificLeaves(
    @Param() params: UserIdDto,
    @Query() query: GetLeaveDto,
  ) {
    return await this.leaveService.getUserSpecificLeaves(params.userId, query);
  }

  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Get(":id")
  async getLeaveById(@Param() params: MongoIdDto) {
    return await this.leaveService.getLeaveById(params.id);
  }

  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Patch("approve/:id")
  async approveLeaveRequest(
    @Param() params: MongoIdDto,
    @GetUser() user: AuthUser,
  ) {
    return await this.leaveService.approveLeaveRequestByAuthority(
      (user._id ?? user.id) as UserIdDto["userId"],
      params.id,
    );
  }

  @Roles("SUPER ADMIN", "HR", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Patch("reject/:id")
  async rejectLeaveRequest(
    @Param() params: MongoIdDto,
    @GetUser() user: AuthUser,
  ) {
    return await this.leaveService.rejectLeaveRequestByAuthority(
      (user._id ?? user.id) as UserIdDto["userId"],
      params.id,
    );
  }
}
