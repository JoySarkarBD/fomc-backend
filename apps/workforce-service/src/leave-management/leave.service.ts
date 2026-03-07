import { convertToBDDate } from "./../../../../libs/shared/src/utils/convert-to-db-date";
/**
 * @fileoverview Leave Service
 *
 * Business logic for leave management CRUD operations in the Workforce microservice.
 * Provides methods to create, retrieve (paginated), find by ID, update, and
 * delete leave requests with safety checks for system leaves and associations.
 */
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { USER_COMMANDS } from "@shared/constants/user-command.constants";
import {
  ApprovedByDto,
  MongoIdDto,
  RejectedByDto,
  UserIdDto,
} from "@shared/dto/mongo-id.dto";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { Leave } from "../schemas/leave.schema";
import { GetLeaveDto } from "./dto/get-leave.dto";
import { LeaveRequestDto } from "./dto/leave-request.dto";

// TODO: Notification to user when leave request is approved or rejected by authority
// TODO: Notification to authority when user requests for leave and this will send to the SUPER ADMIN AND PROJECT MANGER of the user.
@Injectable()
export class LeaveService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    @Inject("NOTIFICATION_SERVICE")
    private readonly notificationClient: ClientProxy,
    @InjectModel(Leave.name) private readonly leaveModel: Model<Leave>,
  ) {}

  /**
   * Creates a new leave request for the authenticated user based on the provided leave request data.
   *
   * @param user - The authenticated user making the leave request, containing user details such as ID and other relevant information.
   * @param leaveRequestDto - The data transfer object containing the details of the leave request, including type, start date, end date, and reason for the leave.
   * @returns A promise that resolves to the created leave document if successful, or an error message if the user has already approved 28 days of leaves or if there was an issue fetching user details.
   * @remarks This method performs several checks before creating a leave request:
   * - It first retrieves the user details from the User Service using the provided user ID.
   * - If the user has already approved 28 days of leaves, it returns a message indicating that they cannot request more leaves.
   * - If the user details are successfully retrieved and the leave request is valid, it creates a new leave document in the database and saves it.
   * - The method handles potential exceptions that may arise during the process, such as issues with fetching user details or database operations, and returns appropriate error messages.
   */
  async createLeaveRequest(
    userId: UserIdDto["userId"],
    leaveRequestDto: LeaveRequestDto,
  ) {
    // Fetch user details
    const userDoc = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, { id: userId }),
    );

    if (userDoc.exception) {
      return {
        message: userDoc.message,
        exception: userDoc.exception,
      };
    }

    // If user has total approve leaves 28 days, then reject the leave request
    const approveLeaves = await this.leaveModel.countDocuments({
      user: new Types.ObjectId(userId),
      startDate: {
        $gte: convertToBDDate(new Date(new Date().getFullYear(), 0, 1)),
      }, // Start of the current year
      endDate: {
        $lte: convertToBDDate(new Date(new Date().getFullYear(), 11, 31)),
      }, // End of the current year
      isApproved: true,
    });

    if (approveLeaves >= 28) {
      return {
        message:
          "You have already approved 28 days of leaves. You cannot request more leaves.",
        exception: "BadRequestException",
      };
    }

    // Check the overlap of the leave request with existing approved leaves for the user
    const overlappingLeaves = await this.leaveModel.countDocuments({
      user: new Types.ObjectId(userId),
      isApproved: true,
      $or: [
        {
          startDate: {
            $lte: convertToBDDate(leaveRequestDto.endDate),
          },
          endDate: {
            $gte: convertToBDDate(leaveRequestDto.startDate),
          },
        },
      ],
    });

    if (overlappingLeaves > 0) {
      return {
        message:
          "The requested leave period overlaps with an existing approved leave.",
        exception: "BadRequestException",
      };
    }

    // Create new leave request
    const newLeave = new this.leaveModel({
      user: new Types.ObjectId(userId),
      type: leaveRequestDto.type,
      startDate: convertToBDDate(leaveRequestDto.startDate),
      endDate: convertToBDDate(leaveRequestDto.endDate),
      reason: leaveRequestDto.reason,
    });

    //

    return await newLeave.save();
  }

  /**
   * Retrieves all pending leave requests that require approval from authorities.
   *
   * @returns A promise that resolves to an array of leave documents that are pending approval, or an empty array if there are no pending leave requests.
   * @remarks This method performs a database query to find all leave documents where the `isApproved` field is set to false, indicating that they are pending approval. The method returns the retrieved leave documents as a promise, allowing the caller to handle the results asynchronously. If there are no pending leave requests, it will return an empty array.
   */
  async getPendingLeaveRequestsForAuthority() {
    return await this.leaveModel
      .find({
        isApproved: false,
      })
      .exec();
  }

  /**
   * Retrieves leave requests for a specific user based on the provided user ID and optional query parameters for filtering by year.
   *
   * @param userId - The ID of the user for whom to retrieve leave requests.
   * @param query - An object containing optional query parameters for filtering leave requests, such as year.
   * @returns A promise that resolves to an array of leave documents matching the specified criteria, or an error message if there was an issue fetching user details.
   * @remarks This method performs the following steps:
   * - It first retrieves the user details from the User Service using the provided user ID.
   * - If there was an issue fetching user details, it returns an error message with the exception information.
   * - If the user details are successfully retrieved, it constructs a filter object based on the provided query parameters (e.g., filtering by year) and retrieves the matching leave documents from the database.
   * - The method returns the retrieved leave documents or an appropriate error message if there was an issue during the retrieval process.
   */
  async getUserSpecificLeaves(userId: UserIdDto["userId"], query: GetLeaveDto) {
    // Fetch user details
    const userDoc = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, { id: userId }),
    );

    if (userDoc.exception) {
      return {
        message: userDoc.message,
        exception: userDoc.exception,
      };
    }

    const filter: any = { user: new Types.ObjectId(userId) };
    if (query.year !== undefined) {
      filter.startDate = {
        $gte: convertToBDDate(new Date(query.year, 0, 1)), // January 1st of the specified year
        $lte: convertToBDDate(new Date(query.year, 11, 31)), // December 31st of the specified year
      };

      filter.endDate = {
        $gte: convertToBDDate(new Date(query.year, 0, 1)), // January 1st of the specified year
        $lte: convertToBDDate(new Date(query.year, 11, 31)), // December 31st of the specified year
      };
    }

    return await this.leaveModel.find(filter).exec();
  }

  /**
   * Retrieves a specific leave request by its ID.
   *
   * @param id - The ID of the leave request to retrieve.
   * @return A promise that resolves to the leave document matching the specified ID, or null if no such document exists.
   * @remarks This method performs a simple database query to find a leave document by its ID. It uses the Mongoose `findById` method to retrieve the document and returns it as a promise. If no document with the specified ID exists, it will return null.
   */
  async getLeaveRequestById(id: MongoIdDto["id"]) {
    return await this.leaveModel.findById(id).exec();
  }

  /**
   * Approves a specific leave request by its ID, marking it as approved and associating it with the user who approved it.
   *
   * @param id - The ID of the leave request to approve.
   * @param approvedBy - The ID of the user who is approving the leave request.
   * @return A promise that resolves to the updated leave document if the approval was successful, or an error message if there was an issue fetching user details, if the leave request was not found, or if the leave request is already approved.
   * @remarks This method performs several checks before approving a leave request:
   * - It first retrieves the user details of the approver from the User Service using the provided approvedBy ID.
   * - If there was an issue fetching user details, it returns an error message with the exception information.
   * - If the user details are successfully retrieved, it attempts to find the leave request by its ID.
   * - If the leave request is not found, it returns an error message indicating that the leave request was not found.
   * - If the leave request is already approved, it returns an error message indicating that the leave request is already approved.
   * - If the leave request is found and is not already approved, it updates the leave document to mark it as approved and associates it with the approver's ID, then saves the updated document and returns it.
   */
  async approveLeaveRequestByAuthority(
    id: MongoIdDto["id"],
    approvedBy: ApprovedByDto["approvedBy"],
  ) {
    // Fetch user details
    const userDoc = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, { id: approvedBy }),
    );

    if (userDoc.exception) {
      return {
        message: userDoc.message,
        exception: userDoc.exception,
      };
    }

    const leave = await this.leaveModel.findById(id).exec();

    if (!leave) {
      return {
        message: "Leave request not found",
        exception: "NotFoundException",
      };
    }

    if (leave.isRejected) {
      return {
        message: "Leave request is already rejected and cannot be approved",
        exception: "BadRequestException",
      };
    }

    if (leave.isApproved) {
      return {
        message: "Leave request is already approved",
        exception: "BadRequestException",
      };
    }

    leave.isApproved = true;
    leave.approvedBy = new Types.ObjectId(approvedBy);
    return await leave.save();
  }

  /**
   * Rejects a specific leave request by its ID, marking it as rejected.
   *
   * @param id - The ID of the leave request to reject.
   * @param rejectedBy - The ID of the user who is rejecting the leave request.
   * @return A promise that resolves to the updated leave document if the rejection was successful, or an error message if the leave request was not found or if the leave request is already approved.
   * @remarks This method performs several checks before rejecting a leave request:
   * - It first attempts to find the leave request by its ID.
   * - If the leave request is not found, it returns an error message indicating that the leave request was not found.
   * - If the leave request is already approved, it returns an error message indicating that the leave request cannot be rejected because it is already approved.
   * - If the leave request is found and is not already approved, it updates the leave document to mark it as rejected, associating it with the rejectedBy ID, then saves the updated document and returns it.
   */
  async rejectLeaveRequestByAuthority(
    id: MongoIdDto["id"],
    rejectedBy: RejectedByDto["rejectedBy"],
  ) {
    // Fetch user details
    const userDoc = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, { id: rejectedBy }),
    );

    if (userDoc.exception) {
      return {
        message: userDoc.message,
        exception: userDoc.exception,
      };
    }

    const leave = await this.leaveModel.findById(id).exec();

    if (!leave) {
      return {
        message: "Leave request not found",
        exception: "NotFoundException",
      };
    }

    if (leave.isRejected) {
      return {
        message: "Leave request is already rejected",
        exception: "BadRequestException",
      };
    }

    if (leave.isApproved) {
      return {
        message: "Leave request is already approved and cannot be rejected",
        exception: "BadRequestException",
      };
    }

    // Mark the leave request as rejected
    leave.isRejected = true;
    leave.rejectedBy = new Types.ObjectId(rejectedBy);
    return await leave.save();
  }
}
