/**
 * @fileoverview Sells Shift Management Controller
 *
 * Handles all sells shift management-related microservice message patterns in the Workforce service. Supports operations related to creating and retrieving sells shift management records via TCP transport.
 */
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SELLS_SHIFT_MANAGEMENT_COMMANDS } from "@shared/constants/sells-shift-management.constants";
import {
  ApprovedByDto,
  AssignedByDto,
  ExchangeIdDto,
  UserIdDto,
} from "@shared/dto/mongo-id.dto";
import { CreateSellsShiftManagementDto } from "./dto/create-sells-shift-management.dto";
import { GetSellsShiftDto } from "./dto/get-sells-shift.dto";
import { RequestShiftExchangeDto } from "./dto/request-shift-exchange.dto";
import { SellsShiftManagementService } from "./sells-shift-management.service";

/**
 * Sells Shift Management Controller
 *
 * Handles all sells shift management-related microservice message patterns.
 * Communicates through message-based transport (e.g., TCP, RMQ, Kafka).
 */
@Controller()
export class SellsShiftManagementController {
  constructor(
    private readonly sellsShiftManagementService: SellsShiftManagementService,
  ) {}

  /**
   * Create a new sells shift management record for a user.
   *
   * Message Pattern: { cmd: SELLS_SHIFT_MANAGEMENT_COMMANDS.CREATE_SELLS_SHIFT_FOR_USER }
   *
   * @param {Object} payload - The data transfer object containing the details of the sells shift management record to be created, including the assignedBy user ID, target user ID, and the createSellsShiftManagementDto with shift details.
   * @returns {Promise<any>} Newly created sells shift management record.
   */
  @MessagePattern(SELLS_SHIFT_MANAGEMENT_COMMANDS.CREATE_SELLS_SHIFT_FOR_USER)
  async create(
    @Payload()
    payload: {
      assignedBy: AssignedByDto["assignedBy"];
      userId: UserIdDto["userId"];
      createSellsShiftManagementDto: CreateSellsShiftManagementDto;
    },
  ) {
    return await this.sellsShiftManagementService.createForUser(
      payload.assignedBy,
      payload.userId,
      payload.createSellsShiftManagementDto,
    );
  }

  /**
   * Retrieve sells shift management records for a specific user.
   *
   * Message Pattern: { cmd: SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_USER_SELLS_SHIFT }
   *
   * @param {Object} payload - The payload containing the user ID and query parameters for filtering sells shift management records.
   * @returns {Promise<any>} The sells shift management records for the specified user.
   */
  @MessagePattern(SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_USER_SELLS_SHIFT)
  async findOne(
    @Payload()
    payload: {
      userId: UserIdDto["userId"];
      query: GetSellsShiftDto;
    },
  ) {
    return await this.sellsShiftManagementService.findShiftForUser(
      payload.userId,
      payload.query,
    );
  }

  /**
   * Request a shift exchange.
   *
   * Message Pattern: { cmd: SELLS_SHIFT_MANAGEMENT_COMMANDS.REQUEST_SHIFT_EXCHANGE }
   *
   * @param {Object} payload - The payload containing the user ID and the requestShiftExchangeDto with details of the shift exchange request.
   * @returns {Promise<any>} The result of the shift exchange request.
   */
  @MessagePattern(SELLS_SHIFT_MANAGEMENT_COMMANDS.REQUEST_SHIFT_EXCHANGE)
  async requestShiftExchange(
    @Payload()
    payload: {
      userId: UserIdDto["userId"];
      requestShiftExchangeDto: RequestShiftExchangeDto;
    },
  ) {
    return await this.sellsShiftManagementService.requestShiftExchange(
      payload.userId,
      payload.requestShiftExchangeDto,
    );
  }

  /**
   * Approve a shift exchange.
   *
   * Message Pattern: { cmd: SELLS_SHIFT_MANAGEMENT_COMMANDS.APPROVE_SHIFT_EXCHANGE }
   *
   * @param {Object} payload - The payload containing the exchange ID and manager ID for approving the shift exchange.
   * @returns {Promise<any>} The result of the shift exchange approval.
   */
  @MessagePattern(SELLS_SHIFT_MANAGEMENT_COMMANDS.APPROVE_SHIFT_EXCHANGE)
  async approveShiftExchange(
    @Payload()
    payload: {
      exchangeId: ExchangeIdDto["exchangeId"];
      approvedBy: ApprovedByDto["approvedBy"];
    },
  ) {
    return await this.sellsShiftManagementService.approveShiftExchange(
      payload.exchangeId,
      payload.approvedBy,
    );
  }

  /**
   * Reject a shift exchange.
   *
   * Message Pattern: { cmd: SELLS_SHIFT_MANAGEMENT_COMMANDS.REJECT_SHIFT_EXCHANGE }
   *
   * @param {Object} payload - The payload containing the exchange ID, manager ID, and optional reason for rejecting the shift exchange.
   * @returns {Promise<any>} The result of the shift exchange rejection.
   */
  @MessagePattern(SELLS_SHIFT_MANAGEMENT_COMMANDS.REJECT_SHIFT_EXCHANGE)
  async rejectShiftExchange(
    @Payload()
    payload: {
      exchangeId: ExchangeIdDto["exchangeId"];
      approvedBy: ApprovedByDto["approvedBy"];
      reason?: string;
    },
  ) {
    return await this.sellsShiftManagementService.rejectShiftExchange(
      payload.exchangeId,
      payload.approvedBy,
      payload.reason,
    );
  }

  /**
   * Get user shift exchanges.
   *
   * Message Pattern: { cmd: SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_USER_SHIFT_EXCHANGES }
   *
   * @param {Object} payload - The payload containing the user ID for retrieving shift exchanges.
   * @returns {Promise<any>} The shift exchanges associated with the specified user.
   */
  @MessagePattern(SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_USER_SHIFT_EXCHANGES)
  async getUserShiftExchanges(
    @Payload() payload: { userId: UserIdDto["userId"] },
  ) {
    return await this.sellsShiftManagementService.getUserShiftExchanges(
      payload.userId,
    );
  }

  /**
   * Get pending shift exchanges for approval.
   *
   * Message Pattern: { cmd: SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_PENDING_SHIFT_EXCHANGES }
   *
   * @returns {Promise<any>} The pending shift exchanges that require approval.
   */
  @MessagePattern(SELLS_SHIFT_MANAGEMENT_COMMANDS.GET_PENDING_SHIFT_EXCHANGES)
  async getPendingShiftExchanges() {
    return await this.sellsShiftManagementService.getPendingShiftExchanges();
  }
}
