/**
 * @fileoverview Sells shift management controller.
 *
 * Defines the REST API endpoints for managing sells shift schedules, including creating new shift entries for users. This controller is protected by JWT authentication and role-based access control, allowing only users with the SUPER ADMIN role to create sells shift management entries.
 *
 * @module api-gateway/sells-shift-management
 */

import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { UserIdDto } from "@shared/dto/mongo-id.dto";
import { GetSellsShiftDto } from "apps/workforce-service/src/sells-shift-management/dto/get-sells-shift.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiRequestDetails } from "../common/decorators/api-request.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import {
  GetUserSellsShiftForbiddenDto,
  GetUserSellsShiftInternalErrorDto,
  GetUserSellsShiftNotFoundDto,
  GetUserSellsShiftUnauthorizedDto,
  GetUserSellsShiftValidationDto,
} from "./dto/error/get-user-sells-shift/get-user-sells-shift.dto";
import { CreateSellsShiftManagementSuccessDto, GetUserSellsShiftSuccessDto } from "./dto/success/sells-shift-management-success.dto";
import { SellsShiftManagementService } from "./sells-shift-management.service";
import { CreateSellsShiftUnauthorizedDto } from "./dto/error/create-sells-shift/create-sells-shift-unauthorized.dto";
import { CreateSellsShiftForbiddenDto } from "./dto/error/create-sells-shift/create-sells-shift-forbidden.dto";
import { CreateSellsShiftNotFoundDto } from "./dto/error/create-sells-shift/create-sells-shift-not-found.dto";
import { CreateSellsShiftValidationDto } from "./dto/error/create-sells-shift/create-sells-shift-validation.dto";
import { CreateSellsShiftInternalErrorDto } from "./dto/error/create-sells-shift/create-sells-shift-internal-error.dto";
import type { AuthUser } from "@shared/interfaces";
import { GetUser } from "../common/decorators/get-user.decorator";
import { CreateSellsShiftManagementDto } from "apps/workforce-service/src/sells-shift-management/dto/create-sells-shift-management.dto";

@ApiTags("Sells Shift Management")
@Controller("sells-shift-management")
@UseGuards(JwtAuthGuard)
export class SellsShiftManagementController {
  constructor(
    private readonly sellsShiftManagementService: SellsShiftManagementService,
  ) {}

  /**
   * Creates a new sells shift management entry for a user.
   *
   * @param user - The authenticated user (SUPER ADMIN) creating the shift.
   * @param params - The parameters containing the user ID for whom the shift is being created.
   * @param data - The data for creating a new sells shift management entry.
   * @returns Result of the creation operation.
   */
  @ApiOperation({
    summary: "Create a new sells shift management entry for a user",
    description:
      "Creates a new sells shift management entry for a user. This endpoint is protected and requires the user to have the SUPER ADMIN role.",
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
        "The ID of the user for whom the sells shift management entry is being created",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: UserIdDto,
  })
  @ApiSuccessResponse(CreateSellsShiftManagementSuccessDto, 201)
  @ApiErrorResponses({
    unauthorized: CreateSellsShiftUnauthorizedDto,
    forbidden: CreateSellsShiftForbiddenDto,
    notFound: CreateSellsShiftNotFoundDto,
    validation: CreateSellsShiftValidationDto,
    internal: CreateSellsShiftInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN")
  @Post(":userId")
  async create(
    @GetUser() user: AuthUser,
    @Param() params: UserIdDto,
    @Body() data: CreateSellsShiftManagementDto,
  ) {
    return this.sellsShiftManagementService.create(
      user._id!,
      params.userId,
      data,
    );
  }

  /**
   * Retrieves sells shift management records for a specific user.
   *
   * @param params - The parameters containing the user ID whose records are being retrieved.
   * @param query - Optional query parameters for filtering records by month and year.
   * @returns List of sells shift management records for the specified user.
   */
  @ApiOperation({
    summary: "Get sells shift management records for a specific user",
    description:
      "Retrieves sells shift management records for a specific user. This endpoint is protected and requires the user to have the SUPER ADMIN role.",
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
        "The ID of the user whose sells shift management records are being retrieved",
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
    queryDto: GetSellsShiftDto,
  })
  @ApiSuccessResponse(GetUserSellsShiftSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: GetUserSellsShiftUnauthorizedDto,
    forbidden: GetUserSellsShiftForbiddenDto,
    notFound: GetUserSellsShiftNotFoundDto,
    validation: GetUserSellsShiftValidationDto,
    internal: GetUserSellsShiftInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN")
  @Get(":userId")
  async findShiftForUser(
    @Param() params: UserIdDto,
    @Query() query: GetSellsShiftDto,
  ) {
    return this.sellsShiftManagementService.findShiftForUser(
      params.userId,
      query,
    );
  }
}
