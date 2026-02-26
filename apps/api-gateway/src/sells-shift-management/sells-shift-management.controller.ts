/**
 * @fileoverview Sells shift management controller.
 *
 * Defines the REST API endpoints for managing sells shift schedules, including creating new shift entries for users. This controller is protected by JWT authentication and role-based access control, allowing only users with the SUPER ADMIN role to create sells shift management entries.
 *
 * @module api-gateway/sells-shift-management
 */

import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation } from "@nestjs/swagger";
import { CreateSellsShiftManagementDto } from "apps/workforce-service/src/sells-shift-management/dto/create-sells-shift-management.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { SellsShiftManagementService } from "./sells-shift-management.service";

@Controller("sells-shift-management")
@UseGuards(JwtAuthGuard)
export class SellsShiftManagementController {
  constructor(
    private readonly sellsShiftManagementService: SellsShiftManagementService,
  ) {}

  /**
   * Creates a new sells shift management entry for a user. This endpoint is protected and requires the user to have the SUPER ADMIN role.
   *
   * The request body must include the week start date, week end date, shift type, and an optional note for the sells shift management entry. The endpoint validates the input data using the CreateSellsShiftManagementDto and returns the result of the creation operation.
   *
   * @param data - The data for creating a new sells shift management entry, including week start date, week end date, shift type, and an optional note.
   * @return The result of the creation operation, which may include the created sells shift management entry or an error message if the creation failed due to validation errors or insufficient permissions.
   */
  @ApiOperation({
    summary: "Create a new sells shift management entry for a user",
    description:
      "Creates a new sells shift management entry for a user. This endpoint is protected and requires the user to have the SUPER ADMIN role.",
  })
  @ApiBearerAuth("authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN")
  @Post(":userId")
  async create(@Body() data: CreateSellsShiftManagementDto) {
    return this.sellsShiftManagementService.create(data);
  }
}
