/**
 * @fileoverview Sells shift management service.
 *
 * Sends TCP commands to the Workforce micro-service for managing sells shift schedules, including creating new shift entries for users. This service acts as an intermediary between the API layer and the Workforce micro-service, handling the communication and data transformation required for sells shift management operations.
 *
 * @module api-gateway/sells-shift-management
 */

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { SELLS_SHIFT_MANAGEMENT_COMMANDS } from "@shared/constants/sells-shift-management.constants";
import { AssignedByDto, UserIdDto } from "@shared/dto/mongo-id.dto";
import { CreateSellsShiftManagementDto } from "apps/workforce-service/src/sells-shift-management/dto/create-sells-shift-management.dto";
import { GetSellsShiftDto } from "apps/workforce-service/src/sells-shift-management/dto/get-sells-shift.dto";
import { RequestShiftExchangeDto } from "apps/workforce-service/src/sells-shift-management/dto/request-shift-exchange.dto";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";

@Injectable()
export class SellsShiftManagementService {
  constructor(
    @Inject("WORKFORCE_SERVICE") private readonly workforceClient: ClientProxy,
  ) {}

  /**
   * Creates a new sells shift management entry for a user.
   */
  async create(
    assignedBy: AssignedByDto["assignedBy"],
    userId: UserIdDto["userId"],
    data: CreateSellsShiftManagementDto,
  ) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        SELLS_SHIFT_MANAGEMENT_COMMANDS.CREATE_SELLS_SHIFT_FOR_USER,
        {
          assignedBy,
          userId,
          createSellsShiftManagementDto: data,
        },
      ),
    );

    this.handleException(result);

    return buildResponse("Sells shift created successfully", result);
  }

  /**
   * Retrieves sells shift management records for a specific user.
   */
  async findShiftForUser(userId: UserIdDto["userId"], query: GetSellsShiftDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_USER_SELLS_SHIFT,
        {
          userId,
          query,
        },
      ),
    );

    this.handleException(result);

    return buildResponse("Sells shift retrieved", result);
  }

  /**
   * Request a shift exchange.
   */
  async requestShiftExchange(userId: string, data: RequestShiftExchangeDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        SELLS_SHIFT_MANAGEMENT_COMMANDS.REQUEST_SHIFT_EXCHANGE,
        {
          userId,
          requestShiftExchangeDto: data,
        },
      ),
    );

    this.handleException(result);

    return buildResponse(
      "Shift exchange request submitted successfully",
      result,
    );
  }

  /**
   * Approve a shift exchange.
   */
  async approveShiftExchange(exchangeId: string, approvedBy: string) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        SELLS_SHIFT_MANAGEMENT_COMMANDS.APPROVE_SHIFT_EXCHANGE,
        {
          exchangeId,
          approvedBy,
        },
      ),
    );

    this.handleException(result);

    return buildResponse(
      "Shift exchange request approved successfully",
      result,
    );
  }

  /**
   * Reject a shift exchange.
   */
  async rejectShiftExchange(
    exchangeId: string,
    approvedBy: string,
    reason?: string,
  ) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        SELLS_SHIFT_MANAGEMENT_COMMANDS.REJECT_SHIFT_EXCHANGE,
        {
          exchangeId,
          approvedBy,
          reason,
        },
      ),
    );

    this.handleException(result);

    return buildResponse(
      "Shift exchange request rejected successfully",
      result,
    );
  }

  /**
   * Get user's shift exchanges.
   */
  async getUserShiftExchanges(userId: string) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_USER_SHIFT_EXCHANGES,
        {
          userId,
        },
      ),
    );

    this.handleException(result);

    return buildResponse("User shift exchanges retrieved", result);
  }

  /**
   * Get pending shift exchanges for managers.
   */
  async getPendingShiftExchanges() {
    const result = await firstValueFrom(
      this.workforceClient.send(
        SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_PENDING_SHIFT_EXCHANGES,
        {},
      ),
    );

    this.handleException(result);

    return buildResponse("Pending shift exchanges retrieved", result);
  }

  private handleException(result: any) {
    if (result?.exception) {
      switch (result.exception) {
        case "NotFoundException":
          throw new NotFoundException(result.message);
        case "HttpException":
          throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
        case "ConflictException":
          throw new HttpException(result.message, HttpStatus.CONFLICT);
        default:
          throw new HttpException(
            result.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }
}
