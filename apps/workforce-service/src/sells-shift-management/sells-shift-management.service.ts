/**
 * @fileoverview Sells Shift Management Service
 *
 * Provides business logic for managing sells shift management records in the Workforce service. This includes creating new records for users and retrieving existing records based on user ID.
 * The SellsShiftManagementService is designed to be used by the SellsShiftManagementController to handle incoming requests related to sells shift management operations, ensuring that the necessary business logic is applied when creating or retrieving sells shift management records in the system.
 * The service methods are currently implemented with placeholder logic and should be updated to interact with the database or other data sources as needed to manage sells shift management records effectively.
 */
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { NOTIFICATION_COMMANDS } from "@shared/constants";
import { USER_COMMANDS } from "@shared/constants/user-command.constants";
import { convertToBDDate } from "@shared/utils/convert-to-db-date";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { NotificationType } from "../../../notification-service/src/schema/notification.schema";
import { Department, DepartmentDocument } from "../schemas/department.schema";
import {
  SalesShiftAssignment,
  SalesShiftAssignmentDocument,
} from "../schemas/sales-shift-assignment.schema";
import {
  ShiftExchange,
  ShiftExchangeDocument,
  ShiftExchangeStatus,
} from "../schemas/shift-exchange.schema";
import {
  ApprovedByDto,
  AssignedByDto,
  ExchangeIdDto,
  UserIdDto,
} from "./../../../../libs/shared/src/dto/mongo-id.dto";
import { CreateSellsShiftManagementDto } from "./dto/create-sells-shift-management.dto";
import { GetSellsShiftDto } from "./dto/get-sells-shift.dto";
import { RequestShiftExchangeDto } from "./dto/request-shift-exchange.dto";

@Injectable()
export class SellsShiftManagementService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    @Inject("NOTIFICATION_SERVICE")
    private readonly notificationClient: ClientProxy,
    @InjectModel(SalesShiftAssignment.name)
    private readonly salesShiftAssignmentModel: Model<SalesShiftAssignmentDocument>,
    @InjectModel(ShiftExchange.name)
    private readonly shiftExchangeModel: Model<ShiftExchangeDocument>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  /**
   * Creates a new sells shift management record for a user.
   *
   * @param {AssignedByDto["assignedBy"]} assignedBy - The ID of the user who is assigning the shift.
   * @param {UserIdDto["userId"]} userId - The ID of the user for whom the shift is being assigned.
   * @param {CreateSellsShiftManagementDto} createSellsShiftManagementDto - The data transfer object containing the details of the shift to be assigned, including week start and end dates, shift type, and any additional notes.
   * @returns {Promise<any>} The newly created sells shift management record, or an error message if the user does not exist or if a shift is already assigned for the same week.
   * @remarks This method first checks if the user exists by communicating with the user service. It then checks if there is already an existing shift assignment for the same week to prevent duplicate assignments. If both checks pass, it creates a new shift assignment record in the database and returns it.
   */
  async createForUser(
    assignedBy: AssignedByDto["assignedBy"],
    userId: UserIdDto["userId"],
    createSellsShiftManagementDto: CreateSellsShiftManagementDto,
  ) {
    const userExist = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, { id: userId }),
    );

    if (userExist?.exception) {
      return {
        message: userExist.message,
        exception: userExist.exception,
      };
    }

    // Convert to BD Time
    const utcStart = convertToBDDate(
      createSellsShiftManagementDto.weekStartDate,
    );
    const utcEnd = convertToBDDate(createSellsShiftManagementDto.weekEndDate);

    console.log("IN-COMING PAYLOAD:", createSellsShiftManagementDto);

    console.log("CONVERTED PAYLOAD:", {
      weekStartDate: utcStart,
      weekEndDate: utcEnd,
    });

    if (utcStart >= utcEnd) {
      return {
        message: "weekStartDate must be before weekEndDate",
        exception: "HttpException",
      };
    }

    // Utc start should have to be SUNDAY and utc end should have to be SATURDAY
    if (utcStart.getUTCDay() !== 0 || utcEnd.getUTCDay() !== 6) {
      return {
        message:
          "weekStartDate must be a Sunday and weekEndDate must be a Saturday",
        exception: "HttpException",
      };
    }

    // Check if the shift assignment covers exactly 7 days
    const diffInDays = Math.round(
      (utcEnd.getTime() - utcStart.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays !== 6) {
      return {
        message: "Shift assignment must cover exactly 7 days",
        exception: "HttpException",
      };
    }

    const existingShift = await this.salesShiftAssignmentModel.findOne({
      user: new Types.ObjectId(userId),
      $or: [
        {
          weekStartDate: { $lte: utcEnd },
          weekEndDate: { $gte: utcStart },
        },
      ],
    });

    if (existingShift) {
      return {
        message: "Shift overlaps with an existing assignment",
        exception: "ConflictException",
      };
    }

    const result = await this.salesShiftAssignmentModel.create({
      user: new Types.ObjectId(userId),
      weekStartDate: utcStart,
      weekEndDate: utcEnd,
      shiftType: createSellsShiftManagementDto.shiftType,
      assignedBy: new Types.ObjectId(assignedBy),
      note: createSellsShiftManagementDto.note,
    });

    return result;
  }

  /**
   * Retrieves sells shift management records for a specific user.
   *
   * @param {UserIdDto["userId"]} userId - The ID of the user for whom to retrieve the shift management records.
   * @param {GetSellsShiftDto} query - The query parameters for filtering the shift management records, including the year and month to specify the time range for the records.
   * @returns {Promise<any>} The sells shift management records for the specified user and time range, or an error message if the user does not exist.
   * @remarks This method first checks if the user exists by communicating with the user service. If the user exists, it retrieves all shift management records for that user within the specified month and year from the database and returns them.
   */
  async findShiftForUser(userId: UserIdDto["userId"], query: GetSellsShiftDto) {
    // Fetch user from user-service
    const userExist = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, {
        id: userId,
      }),
    );

    if (userExist.exception) {
      return {
        message: userExist.message,
        exception: userExist.exception,
      };
    }

    const result = await this.salesShiftAssignmentModel.find({
      user: new Types.ObjectId(userId),
      weekStartDate: {
        $gte: new Date(query.year, query.month - 1, 1),
        $lte: new Date(query.year, query.month, 0, 23, 59, 59, 999),
      },
    });

    return result;
  }

  /**
   * Retrieves the sells shift management record for a specific user on a specific date.
   *
   * @param {string} userId - The ID of the user for whom to retrieve the shift management record.
   * @param {Date} date - The specific date for which to retrieve the shift management record.
   * @returns {Promise<any>} The sells shift management record for the specified user and date, or null if no record exists for that date.
   * @remarks This method retrieves the shift management record for the specified user where the provided date falls within the week start and end dates of the record. It returns the record if found, or null if no matching record exists.
   */
  async getShiftForDate(userId: UserIdDto["userId"], date: Date) {
    const todayDate = new Date(date);
    todayDate.setHours(0, 0, 0, 0);

    return await this.salesShiftAssignmentModel.findOne({
      user: new Types.ObjectId(userId),
      weekStartDate: { $lte: todayDate },
      weekEndDate: { $gte: todayDate },
    });
  }

  /**
   * Request a shift exchange (Only for Sales users).
   *
   * @param {string} userId - The ID of the user requesting the shift exchange.
   * @param {RequestShiftExchangeDto} data - The data transfer object containing the details of the shift exchange request, including the exchange date, original shift type, new shift type, and reason for the exchange.
   * @returns {Promise<any>} The result of the shift exchange request, which may include the created shift exchange record or an error message if the user is not eligible for shift exchange or if they do not have the specified original shift on the exchange date.
   * @remarks This method first checks if the user exists and belongs to the Sales department. It then verifies if the user has the specified original shift on the requested exchange date. If both checks pass, it creates
   */
  async requestShiftExchange(
    userId: UserIdDto["userId"],
    data: RequestShiftExchangeDto,
  ): Promise<any> {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, { id: userId }),
    );

    if (user?.exception) {
      return user;
    }

    if (user.department !== "Sales") {
      return {
        message: "Shift exchange is only available for Sales users",
        exception: "HttpException",
      };
    }

    // Verify if the user has the original shift on that date
    const exchangeDate = new Date(data.exchangeDate);
    const existingShift = await this.getShiftForDate(userId, exchangeDate);

    if (!existingShift || existingShift.shiftType !== data.originalShift) {
      return {
        message: "You do not have the specified original shift on this date",
        exception: "HttpException",
      };
    }

    const shiftExchange = await this.shiftExchangeModel.create({
      user: new Types.ObjectId(userId),
      exchangeDate: data.exchangeDate,
      originalShift: data.originalShift,
      newShift: data.newShift,
      reason: data.reason,
      status: ShiftExchangeStatus.PENDING,
    });

    // Find Sales department ID
    const salesDept = await this.departmentModel.findOne({ name: "Sales" });
    const userIds: string[] = [];

    if (salesDept) {
      // Find users in Sales department
      const usersRes = await firstValueFrom(
        this.userClient.send(USER_COMMANDS.GET_USERS, {
          department: [salesDept._id.toString()],
          pageNo: 1,
          pageSize: 100,
        }),
      );

      // Assuming that the user service returns a list of users in the "users" property of the response
      if (usersRes && Array.isArray(usersRes.users)) {
        const users = usersRes.users.filter(
          (u: any) => u.role === "SUPER ADMIN",
        );
        users.forEach((m: any) => userIds.push(m._id.toString()));
      }
    }

    if (userIds.length > 0) {
      await firstValueFrom(
        this.notificationClient.send(
          NOTIFICATION_COMMANDS.CREATE_NOTIFICATION,
          {
            receiver: userIds.map((id) => new Types.ObjectId(id)),
            sender: new Types.ObjectId(userId),
            title: "Shift Exchange Request",
            message: `${user.name} has requested a shift exchange on ${exchangeDate.toDateString()}.`,
            type: NotificationType.SHIFT_EXCHANGE_REQUEST,
            referenceModel: "ShiftExchange",
            referenceId: new Types.ObjectId(shiftExchange._id),
          },
        ),
      );
    }

    return shiftExchange;
  }

  /**
   * Approve a shift exchange request.
   *
   * @param {string} exchangeId - The ID of the shift exchange request to be approved.
   * @param {string} approvedBy - The ID of the user approving the shift exchange request.
   * @return {Promise<any>} The result of the shift exchange approval, which may include the updated shift exchange record or an error message if the exchange request is not found or if it has already been processed.
   */
  async approveShiftExchange(
    exchangeId: ExchangeIdDto["exchangeId"],
    approvedBy: ApprovedByDto["approvedBy"],
  ) {
    const exchange = await this.shiftExchangeModel.findById(exchangeId);
    if (!exchange) {
      return {
        message: "Exchange request not found",
        exception: "NotFoundException",
      };
    }

    if (exchange.status !== ShiftExchangeStatus.PENDING) {
      return {
        message: "Exchange request is already processed",
        exception: "HttpException",
      };
    }

    exchange.status = ShiftExchangeStatus.APPROVED;
    exchange.approvedBy = new Types.ObjectId(approvedBy);
    await exchange.save();

    // Update the actual shift assignment
    const assignment = await this.getShiftForDate(
      exchange.user.toString(),
      exchange.exchangeDate,
    );
    if (assignment) {
      assignment.shiftType = exchange.newShift;
      await assignment.save();
    }

    // Notify user
    await firstValueFrom(
      this.notificationClient.send(NOTIFICATION_COMMANDS.CREATE_NOTIFICATION, {
        receiver: [new Types.ObjectId(exchange.user)],
        sender: new Types.ObjectId(approvedBy),
        title: "Shift Exchange Approved",
        message: `Your shift exchange request for ${exchange.exchangeDate.toDateString()} has been approved.`,
        type: NotificationType.SHIFT_EXCHANGE_APPROVED,
        referenceModel: "ShiftExchange",
        referenceId: new Types.ObjectId(exchange._id),
      }),
    );

    return exchange;
  }

  /**
   * Reject a shift exchange request.
   *
   * @param {string} exchangeId - The ID of the shift exchange request to be rejected.
   * @param {string} approvedBy - The ID of the user rejecting the shift exchange request.
   * @param {string} [reason] - Optional reason for rejecting the shift exchange request.
   * @return {Promise<any>} The result of the shift exchange rejection, which may include the updated shift exchange record or an error message if the exchange request is not found or if it has already been processed.
   */
  async rejectShiftExchange(
    exchangeId: ExchangeIdDto["exchangeId"],
    approvedBy: ApprovedByDto["approvedBy"],
    reason?: string,
  ) {
    const exchange = await this.shiftExchangeModel.findById(exchangeId);
    if (!exchange) {
      return {
        message: "Exchange request not found",
        exception: "NotFoundException",
      };
    }

    if (exchange.status !== ShiftExchangeStatus.PENDING) {
      return {
        message: "Exchange request is already processed",
        exception: "HttpException",
      };
    }

    exchange.status = ShiftExchangeStatus.REJECTED;
    exchange.approvedBy = new Types.ObjectId(approvedBy);
    if (reason)
      exchange.reason = `Rejected: ${reason}. Original reason: ${exchange.reason}`;
    await exchange.save();

    // Notify user
    await firstValueFrom(
      this.notificationClient.send(NOTIFICATION_COMMANDS.CREATE_NOTIFICATION, {
        receiver: [new Types.ObjectId(exchange.user)],
        sender: new Types.ObjectId(approvedBy),
        title: "Shift Exchange Rejected",
        message: `Your shift exchange request for ${exchange.exchangeDate.toDateString()} has been rejected.`,
        type: NotificationType.SHIFT_EXCHANGE_REJECTED,
        referenceModel: "ShiftExchange",
        referenceId: new Types.ObjectId(exchange._id),
      }),
    );

    return exchange;
  }

  /**
   * Get all shift exchange requests for a user.
   *
   * @param {string} userId - The ID of the user for whom to retrieve shift exchange requests.
   * @return {Promise<any>} The shift exchange requests associated with the specified user, or an error message if the user does not exist.
   * @remarks This method first checks if the user exists by communicating with the user service. If the user exists, it retrieves all shift exchange requests for that user from the database and returns them.
   */
  async getUserShiftExchanges(userId: UserIdDto["userId"]) {
    return await this.shiftExchangeModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ exchangeDate: -1 });
  }

  /**
   * Get all pending shift exchange requests (for managers).
   */
  async getPendingShiftExchanges() {
    return await this.shiftExchangeModel
      .find({ status: ShiftExchangeStatus.PENDING })
      .populate("user", "name employeeId")
      .sort({ createdAt: -1 });
  }
}
