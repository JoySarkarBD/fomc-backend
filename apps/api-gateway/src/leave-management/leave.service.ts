/**
 * @fileoverview Leave gateway service.
 *
 * Sends TCP commands to the Workforce micro-service (which owns
 * leaves) and normalises the response for the API layer.
 */

import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { LEAVE_COMMANDS } from "@shared/constants/leave-command.constants";
import { MongoIdDto, UserIdDto } from "@shared/dto/mongo-id.dto";
import { AuthUser } from "@shared/interfaces";
import { handleException } from "@shared/utils/handle.exception";
import { GetLeaveDto } from "apps/workforce-service/src/leave-management/dto/get-leave.dto";
import { LeaveRequestDto } from "apps/workforce-service/src/leave-management/dto/leave-request.dto";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";

@Injectable()
export class LeaveService {
  constructor(
    @Inject("WORKFORCE_SERVICE") private readonly workforceClient: ClientProxy,
  ) {}

  /**
   * Create a new leave.
   *
   * @param {CreateLeaveDto} data - The data transfer object containing the details of the leave to be created.
   * @return Promise resolving to the newly created leave.
   */
  async createLeaveRequest(userId: UserIdDto["userId"], data: LeaveRequestDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(LEAVE_COMMANDS.CREATE_LEAVE_REQUEST, {
        userId,
        leaveRequest: data,
      }),
    );

    handleException(result);

    return buildResponse("Leave request created successfully", result);
  }

  /**
   * Retrieve leave requests specific to a user based on the provided query parameters.
   *
   * @param {AuthUser} user - The authenticated user for whom to retrieve leave requests.
   * @param {GetLeaveDto} query - The query parameters for filtering leave requests (e.g., by type, approval status).
   * @returns Promise resolving to a list of leave requests matching the search criteria for the specified user.
   * @remarks This method sends a command to the Workforce micro-service to retrieve leave requests specific to the authenticated user based on the provided query parameters. It uses the `firstValueFrom` function to convert the observable response from the micro-service into a promise, and then handles any exceptions that may occur during the process. Finally, it returns a structured response containing a success message and the retrieved leave requests.
   */
  async getUserSpecificLeaves(userId: UserIdDto["userId"], query: GetLeaveDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        LEAVE_COMMANDS.GET_USER_SPECIFIC_LEAVE_REQUESTS,
        {
          userId,
          query,
        },
      ),
    );

    handleException(result);

    return buildResponse("User specific leaves retrieved successfully", result);
  }

  /**
   * Retrieve a leave request by its ID.
   *
   * @param {string} id - The ID of the leave request to be retrieved.
   * @return Promise resolving to the leave document matching the specified ID, or null if no such document exists.
   * @remarks This method sends a command to the Workforce micro-service to retrieve a leave request by its ID. It uses the `firstValueFrom` function to convert the observable response from the micro-service into a promise, and then handles any exceptions that may occur during the process. Finally, it returns the leave document matching the specified ID, or null if no such document exists.
   */
  async getLeaveRequestById(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(LEAVE_COMMANDS.GET_LEAVE_REQUEST_BY_ID, id),
    );

    handleException(result);

    return buildResponse("Leave request retrieved successfully", result);
  }

  /**
   * Approve a leave request by authority.
   *
   * @param {string} userId - The ID of the user who is approving the leave request.
   * @param {string} id - The ID of the leave request to be approved.
   * @return Promise resolving to the updated leave request document after approval.
   * @remarks This method sends a command to the Workforce micro-service to approve a leave request by authority. It uses the `firstValueFrom` function to convert the observable response from the micro-service into a promise, and then handles any exceptions that may occur during the process. Finally, it returns a structured response containing a success message and the updated leave request document after approval.
   */
  async approveLeaveRequestByAuthority(
    userId: UserIdDto["userId"],
    id: MongoIdDto["id"],
  ) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        LEAVE_COMMANDS.APPROVE_LEAVE_REQUEST_BY_AUTHORITY,
        {
          id,
          approvedBy: userId,
        },
      ),
    );

    handleException(result);

    return buildResponse("Leave request approved successfully", result);
  }

  /**
   * Reject a leave request by authority.
   *
   * @param {string} userId - The ID of the user who is rejecting the leave request.
   * @param {string} id - The ID of the leave request to be rejected.
   * @return Promise resolving to the updated leave request document after rejection.
   * @remarks This method sends a command to the Workforce micro-service to reject a leave request by authority. It uses the `firstValueFrom` function to convert the observable response from the micro-service into a promise, and then handles any exceptions that may occur during the process. Finally, it returns a structured response containing a success message and the updated leave request document after rejection.
   */
  async rejectLeaveRequestByAuthority(
    userId: UserIdDto["userId"],
    id: MongoIdDto["id"],
  ) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        LEAVE_COMMANDS.REJECT_LEAVE_REQUEST_BY_AUTHORITY,
        {
          id,
          rejectedBy: userId,
        },
      ),
    );

    handleException(result);

    return buildResponse("Leave request rejected successfully", result);
  }
}
