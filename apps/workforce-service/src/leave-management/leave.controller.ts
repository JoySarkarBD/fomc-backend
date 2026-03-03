/**
 * @fileoverview Leave Controller
 *
 * Handles all leave-related microservice message patterns in the
 * Workforce service. Supports CRUD operations on leaves via TCP transport.
 */

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { LEAVE_COMMANDS } from "@shared/constants/leave-command.constants";
import { ApprovedByDto, MongoIdDto, UserIdDto } from "@shared/dto";
import { RejectedByDto } from "@shared/dto/mongo-id.dto";
import { GetLeaveDto } from "./dto/get-leave.dto";
import { LeaveRequestDto } from "./dto/leave-request.dto";
import { LeaveService } from "./leave.service";

/**
 * Leave Controller
 *
 * Handles all leave-related microservice message patterns.
 * Communicates through message-based transport (e.g., TCP, RMQ, Kafka).
 */
@Controller()
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  /**
   * Create a new leave request.
   *
   * Message Pattern: { cmd: LEAVE_COMMANDS.CREATE_LEAVE_REQUEST }
   *
   * @param {Object} payload - The payload containing the user ID and leave request details.
   * @param {UserIdDto["userId"]} payload.userId - The ID of the user making the leave request.
   * @param {LeaveRequestDto} payload.leaveRequest - The details of the leave request being made.
   */
  @MessagePattern(LEAVE_COMMANDS.CREATE_LEAVE_REQUEST)
  async createLeaveRequest(
    @Payload()
    payload: {
      userId: UserIdDto["userId"];
      leaveRequest: LeaveRequestDto;
    },
  ): Promise<any> {
    return await this.leaveService.createLeaveRequest(
      payload.userId,
      payload.leaveRequest,
    );
  }

  /**
   * Retrieve all pending leave requests for authorities (e.g., SUPER ADMIN, PROJECT MANAGER).
   *
   * Message Pattern: { cmd: LEAVE_COMMANDS.GET_ALL_PENDING_LEAVE_REQUESTS_FOR_AUTHORITY }
   *
   * @return {Promise<any>} A list of all pending leave requests that require authority action.
   */
  @MessagePattern(LEAVE_COMMANDS.GET_ALL_PENDING_LEAVE_REQUESTS_FOR_AUTHORITY)
  async getPendingLeaveRequestsForAuthority(): Promise<any> {
    return await this.leaveService.getPendingLeaveRequestsForAuthority();
  }

  /**
   * Retrieve leave requests specific to a user based on the provided query parameters.
   *
   * Message Pattern: { cmd: LEAVE_COMMANDS.GET_USER_SPECIFIC_LEAVE_REQUESTS }
   *
   * @param {Object} payload - The payload containing the user ID and query parameters for filtering leave requests.
   * @param {UserIdDto["userId"]} payload.userId - The ID of the user for whom to retrieve leave requests.
   * @param {GetLeaveDto} payload.query - The query parameters for filtering leave requests (e.g., by type, approval status).
   */
  @MessagePattern(LEAVE_COMMANDS.GET_USER_SPECIFIC_LEAVE_REQUESTS)
  async getUserSpecificLeaves(
    @Payload() payload: { userId: UserIdDto["userId"]; query: GetLeaveDto },
  ): Promise<any> {
    return await this.leaveService.getUserSpecificLeaves(
      payload.userId,
      payload.query,
    );
  }

  /**
   * Retrieve a specific leave request by its ID.
   *
   * Message Pattern: { cmd: LEAVE_COMMANDS.GET_LEAVE_REQUEST_BY_ID }
   *
   * @param {string} leaveId - The ID of the leave request to retrieve.
   * @return {Promise<any>} The details of the leave request with the specified ID.
   * @throws {NotFoundException} If no leave request with the specified ID is found.
   */
  @MessagePattern(LEAVE_COMMANDS.GET_LEAVE_REQUEST_BY_ID)
  async getLeaveRequestById(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return await this.leaveService.getLeaveRequestById(id);
  }

  /**
   * Approve a leave request by authority.
   *
   * Message Pattern: { cmd: LEAVE_COMMANDS.APPROVE_LEAVE_REQUEST_BY_AUTHORITY }
   *
   * @param {Object} payload - The payload containing the leave request ID and the approver's user ID.
   * @param {MongoIdDto["id"]} payload.id - The ID of the leave request to approve.
   * @param {ApprovedByDto["approvedBy"]} payload.approvedBy - The ID of the user who is approving the leave request.
   * @return {Promise<any>} The updated leave request document after approval.
   * @throws {NotFoundException} If no leave request with the specified ID is found.
   * @throws {BadRequestException} If the leave request is already approved or rejected.
   * @remarks This method checks if the leave request exists and is not already approved or rejected. If the leave request is valid for approval, it updates the document to mark it as approved and associates it with the approver's ID, then saves and returns the updated document.
   */
  @MessagePattern(LEAVE_COMMANDS.APPROVE_LEAVE_REQUEST_BY_AUTHORITY)
  async approveLeaveRequestByAuthority(
    @Payload()
    payload: {
      id: MongoIdDto["id"];
      approvedBy: ApprovedByDto["approvedBy"];
    },
  ): Promise<any> {
    return await this.leaveService.approveLeaveRequestByAuthority(
      payload.id,
      payload.approvedBy,
    );
  }

  /**
   * Reject a leave request by authority.
   *
   * Message Pattern: { cmd: LEAVE_COMMANDS.REJECT_LEAVE_REQUEST_BY_AUTHORITY }
   *
   * @param {Object} payload - The payload containing the leave request ID and the rejector's user ID.
   * @param {MongoIdDto["id"]} payload.id - The ID of the leave request to reject.
   * @param {RejectedByDto["rejectedBy"]} payload.rejectedBy - The ID of the user who is rejecting the leave request.
   * @return {Promise<any>} The updated leave request document after rejection.
   * @throws {NotFoundException} If no leave request with the specified ID is found.
   * @throws {BadRequestException} If the leave request is already approved or rejected.
   * @remarks This method checks if the leave request exists and is not already approved or rejected. If the leave request is valid for rejection, it updates the document to mark it as rejected and associates it with the rejector's ID, then saves and returns the updated document.
   */
  @MessagePattern(LEAVE_COMMANDS.REJECT_LEAVE_REQUEST_BY_AUTHORITY)
  async rejectLeaveRequestByAuthority(
    @Payload()
    payload: {
      id: MongoIdDto["id"];
      rejectedBy: RejectedByDto["rejectedBy"];
    },
  ): Promise<any> {
    return await this.leaveService.rejectLeaveRequestByAuthority(
      payload.id,
      payload.rejectedBy,
    );
  }
}
