/**
 * @fileoverview Sells shift management controller.
 *
 * Defines the REST API endpoints for managing sells shift schedules, including creating new shift entries for users. This controller is protected by JWT authentication and role-based access control, allowing only users with the SUPER ADMIN role to create sells shift management entries.
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
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ExchangeIdDto, UserIdDto } from "@shared/dto/mongo-id.dto";
import type { AuthUser } from "@shared/interfaces";
import { CreateSellsShiftManagementDto } from "apps/workforce-service/src/sells-shift-management/dto/create-sells-shift-management.dto";
import { GetSellsShiftDto } from "apps/workforce-service/src/sells-shift-management/dto/get-sells-shift.dto";
import { RequestShiftExchangeDto } from "apps/workforce-service/src/sells-shift-management/dto/request-shift-exchange.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiRequestDetails } from "../common/decorators/api-request.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreateSellsShiftForbiddenDto } from "./dto/error/create-sells-shift/create-sells-shift-forbidden.dto";
import { CreateSellsShiftInternalErrorDto } from "./dto/error/create-sells-shift/create-sells-shift-internal-error.dto";
import { CreateSellsShiftNotFoundDto } from "./dto/error/create-sells-shift/create-sells-shift-not-found.dto";
import { CreateSellsShiftUnauthorizedDto } from "./dto/error/create-sells-shift/create-sells-shift-unauthorized.dto";
import { CreateSellsShiftValidationDto } from "./dto/error/create-sells-shift/create-sells-shift-validation.dto";
import {
  GetUserSellsShiftForbiddenDto,
  GetUserSellsShiftInternalErrorDto,
  GetUserSellsShiftNotFoundDto,
  GetUserSellsShiftUnauthorizedDto,
  GetUserSellsShiftValidationDto,
} from "./dto/error/get-user-sells-shift/get-user-sells-shift.dto";
import {
  ApproveShiftExchangeForbiddenDto,
  ApproveShiftExchangeInternalErrorDto,
  ApproveShiftExchangeNotFoundDto,
  ApproveShiftExchangeUnauthorizedDto,
  ApproveShiftExchangeValidationDto,
} from "./dto/error/shift-exchange/approve-shift-exchange";
import {
  GetMyShiftExchangesForbiddenDto,
  GetMyShiftExchangesInternalErrorDto,
  GetMyShiftExchangesNotFoundDto,
  GetMyShiftExchangesUnauthorizedDto,
} from "./dto/error/shift-exchange/get-my-shift-exchanges";
import {
  GetPendingShiftExchangesForbiddenDto,
  GetPendingShiftExchangesInternalErrorDto,
  GetPendingShiftExchangesNotFoundDto,
  GetPendingShiftExchangesUnauthorizedDto,
} from "./dto/error/shift-exchange/get-pending-shift-exchanges";
import {
  RejectShiftExchangeForbiddenDto,
  RejectShiftExchangeInternalErrorDto,
  RejectShiftExchangeNotFoundDto,
  RejectShiftExchangeUnauthorizedDto,
  RejectShiftExchangeValidationDto,
} from "./dto/error/shift-exchange/reject-shift-exchange";
import {
  RequestShiftExchangeForbiddenDto,
  RequestShiftExchangeInternalErrorDto,
  RequestShiftExchangeNotFoundDto,
  RequestShiftExchangeUnauthorizedDto,
  RequestShiftExchangeValidationDto,
} from "./dto/error/shift-exchange/request-shift-exchange";
import {
  CreateSellsShiftManagementSuccessDto,
  GetUserSellsShiftSuccessDto,
} from "./dto/success/sells-shift-management-success.dto";
import {
  ApproveShiftExchangeSuccessDto,
  GetMyShiftExchangesSuccessDto,
  GetPendingShiftExchangesSuccessDto,
  RejectShiftExchangeSuccessDto,
  ShiftExchangeRequestSuccessDto,
} from "./dto/success/shift-exchange-success.dto";
import { SellsShiftManagementService } from "./sells-shift-management.service";

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
   * This endpoint allows a user with the SUPER ADMIN role to create a new sells shift management entry for a specified user. The request must include the ID of the user for whom the shift is being created, as well as the details of the shift in the request body. The endpoint is protected by JWT authentication and role-based access control to ensure that only authorized users can create shift entries.
   *
   * @param {AuthUser} user - The authenticated user making the request, extracted from the JWT token.
   * @param {UserIdDto} params - The route parameters containing the user ID for whom the shift is being created.
   * @param {CreateSellsShiftManagementDto} data - The request body containing the details of the sells shift management entry to be created.
   * @returns {Promise<any>} A response indicating the success of the operation, along with the created sells shift management entry.
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
  @Roles("SUPER ADMIN", "PROJECT MANAGER")
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
   * Request a shift exchange (Only for Sales users).
   *
   * This endpoint allows a Sales user to request a shift exchange. The user must provide the details of the shift exchange request in the request body, including the original shift, the new shift, the date of the exchange, and an optional reason for the exchange. The endpoint is protected by JWT authentication and role-based access control to ensure that only authorized Sales users can request shift exchanges.
   *
   * @param {AuthUser} user - The authenticated user making the request, extracted from the JWT token.
   * @param {RequestShiftExchangeDto} data - The request body containing the details of the shift exchange request.
   * @returns {Promise<any>} A response indicating the success of the operation, along with the created shift exchange request.
   */
  @ApiOperation({
    summary: "Request a shift exchange",
    description: "Allows a Sales user to request a shift exchange.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(ShiftExchangeRequestSuccessDto, 201)
  @ApiErrorResponses({
    unauthorized: RequestShiftExchangeUnauthorizedDto,
    forbidden: RequestShiftExchangeForbiddenDto,
    notFound: RequestShiftExchangeNotFoundDto,
    validation: RequestShiftExchangeValidationDto,
    internal: RequestShiftExchangeInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Post("exchange/request")
  async requestShiftExchange(
    @GetUser() user: AuthUser,
    @Body() data: RequestShiftExchangeDto,
  ) {
    return this.sellsShiftManagementService.requestShiftExchange(
      user._id!,
      data,
    );
  }

  /**
   * Approve a shift exchange.
   *
   * This endpoint allows a user with the SUPER ADMIN, DIRECTOR, or PROJECT MANAGER role to approve a shift exchange request. The user must provide the ID of the shift exchange request to be approved as a route parameter. The endpoint is protected by JWT authentication and role-based access control to ensure that only authorized users can approve shift exchanges.
   *
   * @param {AuthUser} user - The authenticated user making the request, extracted from the JWT token.
   * @param {ExchangeIdDto} param - The route parameter containing the ID of the shift exchange request to be approved.
   * @param {ApprovedByDto} approvedBy - The ID of the user approving the shift exchange request, extracted from the JWT token.
   * @returns {Promise<any>} A response indicating the success of the operation, along with the updated shift exchange request.
   */
  @ApiOperation({
    summary: "Approve a shift exchange",
    description: "Required role: SUPER ADMIN, DIRECTOR, or PROJECT MANAGER",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: {
      name: "exchangeId",
      description: "The ID of the shift exchange request to approve",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123458",
    },
  })
  @ApiSuccessResponse(ApproveShiftExchangeSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: ApproveShiftExchangeUnauthorizedDto,
    forbidden: ApproveShiftExchangeForbiddenDto,
    notFound: ApproveShiftExchangeNotFoundDto,
    validation: ApproveShiftExchangeValidationDto,
    internal: ApproveShiftExchangeInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "PROJECT MANAGER")
  @Patch("exchange/approve/:exchangeId")
  async approveShiftExchange(
    @GetUser() user: AuthUser,
    @Param() param: ExchangeIdDto,
  ) {
    return this.sellsShiftManagementService.approveShiftExchange(
      param.exchangeId,
      user._id!,
    );
  }

  /**
   * Reject a shift exchange.
   *
   * This endpoint allows a user with the SUPER ADMIN, DIRECTOR, or PROJECT MANAGER role to reject a shift exchange request. The user must provide the ID of the shift exchange request to be rejected as a route parameter, as well as an optional reason for the rejection in the request body. The endpoint is protected by JWT authentication and role-based access control to ensure that only authorized users can reject shift exchanges.
   *
   * @param {AuthUser} user - The authenticated user making the request, extracted from the JWT token.
   * @param {ExchangeIdDto} param - The route parameter containing the ID of the shift exchange request to be rejected.
   * @param {ApprovedByDto} approvedBy - The ID of the user rejecting the shift exchange request, extracted from the JWT token.
   * @param {string} reason - An optional reason for rejecting the shift exchange request, provided in the request body.
   * @returns {Promise<any>} A response indicating the success of the operation, along with the updated shift exchange request.
   */
  @ApiOperation({
    summary: "Reject a shift exchange",
    description: "Required role: SUPER ADMIN, DIRECTOR, or PROJECT MANAGER",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: {
      name: "exchangeId",
      description: "The ID of the shift exchange request to reject",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123458",
    },
  })
  @ApiSuccessResponse(RejectShiftExchangeSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: RejectShiftExchangeUnauthorizedDto,
    forbidden: RejectShiftExchangeForbiddenDto,
    notFound: RejectShiftExchangeNotFoundDto,
    validation: RejectShiftExchangeValidationDto,
    internal: RejectShiftExchangeInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "PROJECT MANAGER")
  @Patch("exchange/reject/:exchangeId")
  async rejectShiftExchange(
    @GetUser() user: AuthUser,
    @Param() param: ExchangeIdDto,
    @Body("reason") reason?: string,
  ) {
    return this.sellsShiftManagementService.rejectShiftExchange(
      param.exchangeId,
      user._id!,
      reason,
    );
  }

  /**
   * Get my shift exchanges.
   *
   * This endpoint allows a user to retrieve their own shift exchange requests. The user must be authenticated and can only access their own shift exchange data. The endpoint is protected by JWT authentication to ensure that only authorized users can access their shift exchange information.
   *
   * @param {AuthUser} user - The authenticated user making the request, extracted from the JWT token.
   * @returns {Promise<any>} A response containing the list of shift exchange requests made by the authenticated user.
   */
  @ApiOperation({
    summary: "Get my shift exchanges",
    description: "Retrieves the logged-in user's shift exchange requests.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(GetMyShiftExchangesSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: GetMyShiftExchangesUnauthorizedDto,
    forbidden: GetMyShiftExchangesForbiddenDto,
    notFound: GetMyShiftExchangesNotFoundDto,
    internal: GetMyShiftExchangesInternalErrorDto,
  })
  @Get("exchange/my")
  async getMyShiftExchanges(@GetUser() user: AuthUser) {
    return this.sellsShiftManagementService.getUserShiftExchanges(user._id!);
  }

  /**
   * Get pending shift exchanges (for managers).
   *
   * This endpoint allows users with the SUPER ADMIN, DIRECTOR, or PROJECT MANAGER role to retrieve a list of pending shift exchange requests that require their approval. The endpoint is protected by JWT authentication and role-based access control to ensure that only authorized users can access the pending shift exchange data.
   *
   * @param {AuthUser} user - The authenticated user making the request, extracted from the JWT token.
   * @return {Promise<any>} A response containing the list of pending shift exchange requests that require approval from the authenticated user.
   */
  @ApiOperation({
    summary: "Get pending shift exchanges for approval",
    description: "Required role: SUPER ADMIN, DIRECTOR, or PROJECT MANAGER",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(GetPendingShiftExchangesSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: GetPendingShiftExchangesUnauthorizedDto,
    forbidden: GetPendingShiftExchangesForbiddenDto,
    notFound: GetPendingShiftExchangesNotFoundDto,
    internal: GetPendingShiftExchangesInternalErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles("SUPER ADMIN", "DIRECTOR", "PROJECT MANAGER")
  @Get("exchange/pending")
  async getPendingShiftExchanges() {
    return this.sellsShiftManagementService.getPendingShiftExchanges();
  }

  /**
   * Retrieves sells shift management records for a specific user.
   *
   * This endpoint allows a user with the SUPER ADMIN role to retrieve sells shift management records for a specified user. The request must include the ID of the user whose records are being retrieved as a route parameter, as well as the month and year for which to retrieve the records as query parameters. The endpoint is protected by JWT authentication and role-based access control to ensure that only authorized users can access the shift management records.
   *
   * @param {AuthUser} user - The authenticated user making the request, extracted from the JWT token.
   * @param {UserIdDto} params - The route parameters containing the user ID for whom the shift management records are being retrieved.
   * @param {GetSellsShiftDto} query - The query parameters containing the month and year for which to retrieve the shift management records.
   * @returns {Promise<any>} A response containing the sells shift management records for the specified user and time period.
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
