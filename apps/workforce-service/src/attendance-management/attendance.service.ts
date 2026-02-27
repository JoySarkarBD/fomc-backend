/**
 * @fileoverview Attendance Service
 *
 * Business logic for attendance operations in the Workforce microservice.
 * Handles marking attendance (present/late), shift-based validation,
 * and interaction with the User Service via TCP.
 *
 * @todo Complete the `presentAttendance` method implementation and add
 *       out-attendance and weekend-exchange logic.
 */
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { USER_COMMANDS } from "@shared/constants/user-command.constants";
import { UserIdDto } from "@shared/dto/mongo-id.dto";
import { AuthUser } from "@shared/interfaces/auth-user.interface";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import {
  Attendance,
  AttendanceDocument,
  AttendanceInType,
  ShiftTypeForOperations,
  ShiftTypeForSales,
} from "../schemas/attendance.schema";
import {
  WeekendExchange,
  WeekendExchangeDocument,
} from "../schemas/weekend-exchange.schema";
import { SellsShiftManagementService } from "../sells-shift-management/sells-shift-management.service";
import { AttendanceByAuthorityDto } from "./dto/attendance-by-authority.dto";
import { GetAttendanceDto } from "./dto/get-attendance.dto";
import { WeekendExchangeByAuthorityDto } from "./dto/weekend-exchange-by-authority.dto";

/* 
  attendance logic:-
  for the operation department there will be one shift; day shift from 9:00 to 18:00

  for the sales department there will be three shifts; morning shift from 7:00 to 15:00, evening shift from 15:00 to 23:00 and night shift from 23:00 to 7:00

  if the user marks attendance within 15 minutes of shift timing, then it will be marked as present, otherwise it will be marked as late
*/
@Injectable()
export class AttendanceService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
    @InjectModel(WeekendExchange.name)
    private readonly weekendExchangeModel: Model<WeekendExchangeDocument>,
    private readonly sellsShiftManagementService: SellsShiftManagementService,
  ) {}

  /**
   * Marks the attendance of a user as present or late based on their check-in time and shift timings.
   *
   * @param user - The authenticated user for whom the attendance is being marked.
   * @return A promise that resolves to the attendance record if successfully marked, or an object containing a message and exception if there was an error (e.g., user not found, attendance already marked, no shift matched).
   */
  async presentAttendance(
    user: AuthUser,
  ): Promise<Attendance | { message: string; exception: string }> {
    const userId = (user.id ?? user._id) as string;

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

    // Current BD Time
    const nowUTC = new Date();
    const bdNow = new Date(
      nowUTC.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    );

    // Today's date without time
    const todayDate = new Date(bdNow);
    todayDate.setHours(0, 0, 0, 0);

    // Day of week like SATURDAY, SUNDAY...
    const todayDay = bdNow
      .toLocaleString("en-US", { timeZone: "Asia/Dhaka", weekday: "long" })
      .toUpperCase();

    // Prevent duplicate attendance
    const existingAttendance = await this.attendanceModel.findOne({
      user: new Types.ObjectId(userId),
      date: todayDate,
    });

    if (existingAttendance) {
      return {
        message: "Attendance already marked for today",
        exception: "HttpException",
      };
    }

    // Check WeekendExchange for today
    const exchangeToday = await this.weekendExchangeModel.findOne({
      user: userId,
      newOffDate: todayDate,
    });

    const exchangeOriginal = await this.weekendExchangeModel.findOne({
      user: userId,
      originalWeekendDate: todayDate,
    });

    // Determine Attendance Type
    let attendanceType: AttendanceInType;
    let shiftType: string = ShiftTypeForOperations.DAY; // default shift type
    let shiftStartMinutes = 0;

    // Case 1: Today is user's exchanged new off date → OFF_DAY
    if (exchangeToday) {
      attendanceType = AttendanceInType.WEEKEND;
    }
    // Case 2: Today is user's original weekend that was exchanged → WORKING
    else if (exchangeOriginal) {
      attendanceType = AttendanceInType.PRESENT;
      shiftType = ShiftTypeForOperations.DAY;
    }
    // Case 3: Today is normal weekend → WEEKEND_OFF
    else if (userExist.weekendOff?.includes(todayDay)) {
      attendanceType = AttendanceInType.WEEKEND;
    }
    // Case 4: Normal working day → calculate shift & late
    else {
      const currentMinutes = bdNow.getHours() * 60 + bdNow.getMinutes();

      if (user.role === "HR") {
        shiftType = ShiftTypeForOperations.DAY;
        shiftStartMinutes = 9 * 60;
      } else {
        switch (user.department) {
          case "OPERATIONS":
            shiftType = ShiftTypeForOperations.DAY;
            shiftStartMinutes = 9 * 60;
            break;

          case "SALES": {
            // Use the microservice (service method) to get the user shift details
            const assignedShift =
              await this.sellsShiftManagementService.getShiftForDate(
                userId,
                todayDate,
              );

            if (!assignedShift) {
              return {
                message:
                  "No shift assigned for this week. Please contact admin.",
                exception: "HttpException",
              };
            }

            shiftType = assignedShift.shiftType;

            const morningStart = 7 * 60;
            const eveningStart = 15 * 60;
            const nightStart = 23 * 60;

            if (shiftType === ShiftTypeForSales.MORNING) {
              shiftStartMinutes = morningStart;
            } else if (shiftType === ShiftTypeForSales.EVENING) {
              shiftStartMinutes = eveningStart;
            } else if (shiftType === ShiftTypeForSales.NIGHT) {
              shiftStartMinutes = nightStart;
            } else {
              return {
                message: "Invalid shift assigned",
                exception: "HttpException",
              };
            }

            // Check if user is trying to mark attendance for a shift that hasn't started or is too late
            // Allow marking attendance within a window (e.g., 4 hours before shift starts)
            const windowMinutes = 4 * 60;
            let diff = currentMinutes - shiftStartMinutes;

            // Handle cross-day for night shift (23:00)
            if (
              shiftType === ShiftTypeForSales.NIGHT &&
              currentMinutes < 12 * 60
            ) {
              // It's after midnight (e.g. 01:00 AM)
              diff = 24 * 60 + currentMinutes - nightStart;
            } else if (
              shiftType === ShiftTypeForSales.NIGHT &&
              currentMinutes >= 12 * 60
            ) {
              // It's before midnight (e.g. 22:00 PM)
              diff = currentMinutes - nightStart;
            }

            // If current time is more than 4 hours before shift start or after shift start, prevent marking
            if (diff < -windowMinutes || diff > 4 * 60) {
              return {
                message: `It is not your shift time. Your shift starts at ${Math.floor(
                  shiftStartMinutes / 60,
                )}:00`,
                exception: "HttpException",
              };
            }
            break;
          }

          default:
            return {
              message: "Department not found",
              exception: "HttpException",
            };
        }
      }

      const graceLimit = shiftStartMinutes + 15; // 15 min grace
      let isLate = false;

      if (shiftType === ShiftTypeForSales.NIGHT) {
        // Night shift cross-day logic
        const adjustedCurrent =
          currentMinutes < 12 * 60 ? 24 * 60 + currentMinutes : currentMinutes;
        isLate = adjustedCurrent > shiftStartMinutes + 15;
      } else {
        isLate = currentMinutes > graceLimit;
      }

      attendanceType = isLate
        ? AttendanceInType.LATE
        : AttendanceInType.PRESENT;
    }

    // Save Attendance
    const attendance = await this.attendanceModel.create({
      user: new Types.ObjectId(userId),
      checkInTime: bdNow,
      date: todayDate,
      inType: attendanceType,
      shiftType,
      isLate: attendanceType === AttendanceInType.LATE,
    });

    return attendance;
  }

  /**
   * Marks the attendance of a user as out by setting the check-out time for today's attendance record.
   * Checks if an attendance record exists for today and if the check-out time has already been set to prevent duplicate out markings.
   *
   * @param user - The authenticated user for whom the attendance is being marked as out.
   * @return A promise that resolves to the updated attendance record if successfully marked as out, or an object containing a message and exception if there was an error (e.g., no attendance record found for today, attendance already marked as out).
   */
  async outAttendance(user: AuthUser) {
    const userId = (user.id ?? user._id) as string;

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

    // Current BD Time
    const nowUTC = new Date();
    const bdNow = new Date(
      nowUTC.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    );

    // Today's date (without time)
    const todayDate = new Date(bdNow);
    todayDate.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceModel.findOne({
      user: new Types.ObjectId(userId),
      date: todayDate,
    });

    if (attendance && attendance.inType === AttendanceInType.WEEKEND) {
      return {
        message: "Cannot mark out attendance for weekend off",
        exception: "HttpException",
      };
    }

    if (!attendance) {
      return {
        message: "No attendance record found for today",
        exception: "HttpException",
      };
    }

    if (attendance.checkOutTime) {
      return {
        message: "Attendance already marked as out for today",
        exception: "HttpException",
      };
    }

    attendance.checkOutTime = bdNow;
    return await attendance.save();
  }

  /**
   * Retrieves the attendance records for the authenticated user based on optional month and year filters.
   *
   * @param user - The authenticated user whose attendance records are being retrieved.
   * @param query - Optional query parameters for filtering attendance records by month and year.
   * @return A promise that resolves to an array of attendance records matching the specified criteria, or an object containing a message and exception if there was an error during retrieval.
   */
  async getMyAttendance(
    user: AuthUser,
    query: GetAttendanceDto,
  ): Promise<Attendance[]> {
    const userId = (user.id ?? user._id) as string;

    const { month /* 1-12 */, year /* 1900999*/ } = query;

    const filter: any = {
      user: new Types.ObjectId(userId),
    };

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    // Filter by month only
    else if (month) {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    // Filter by year only
    else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    return await this.attendanceModel.find(filter).sort({ date: 1 });
  }

  /**
   * Retrieves the attendance records for a specific user based on optional month and year filters.
   *
   * @param userId - The unique identifier of the user whose attendance records are being retrieved.
   * @param query - Optional query parameters for filtering attendance records by month and year.
   * @return A promise that resolves to an array of attendance records matching the specified criteria for the given user, or an object containing a message and exception if there was an error during retrieval.
   */
  async getSpecificUserAttendance(
    userId: UserIdDto["userId"],
    query: GetAttendanceDto,
  ) {
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

    const { month /* 1-12 */, year /* 1900999*/ } = query;

    const filter: any = {
      user: new Types.ObjectId(userId),
    };

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    // Filter by month only
    else if (month) {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    // Filter by year only
    else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    return await this.attendanceModel.find(filter).sort({ date: 1 });
  }

  /**
   * Marks the attendance of a user on behalf of an authority (e.g., manager) by creating or updating an attendance record for a specific date with the provided attendance type and shift type.
   *
   * @param userId - The unique identifier of the user for whom attendance is being marked.
   * @param attendanceDetails - An object containing the details of the attendance to be marked, including the attendance type (e.g., present, late, absent), optional date (defaults to today if not provided), optional shift type, and optional late status.
   * @return A promise that resolves to the created or updated attendance record if successfully marked, or an object containing a message and exception if there was an error during the marking process.
   */
  async markAttendanceAsAuthority(
    userId: UserIdDto["userId"],
    attendanceDetails: AttendanceByAuthorityDto,
  ) {
    const { inType, date, shiftType, isLate, checkInTime, checkOutTime } =
      attendanceDetails;

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

    // Current BD Time
    const nowUTC = new Date();
    const bdNow = new Date(
      nowUTC.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    );

    // If date is not provided, use today's date
    const attendanceDate = date
      ? new Date(date)
      : new Date(bdNow.getFullYear(), bdNow.getMonth(), bdNow.getDate());

    // Check if attendance already exists for the given date
    const existingAttendance = await this.attendanceModel.findOne({
      user: new Types.ObjectId(userId),
      date: attendanceDate,
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.inType = inType;
      existingAttendance.shiftType = shiftType;
      existingAttendance.isLate = isLate;
      if (checkInTime) {
        existingAttendance.checkInTime = checkInTime;
      }
      if (checkOutTime) {
        existingAttendance.checkOutTime = checkOutTime;
      }
      return await existingAttendance.save();
    }

    // Create new attendance record
    const attendance = new this.attendanceModel({
      user: new Types.ObjectId(userId),
      date: attendanceDate,
      inType,
      shiftType,
      isLate,
      checkInTime: checkInTime ?? bdNow,
      checkOutTime: checkOutTime ?? null,
    });

    return await attendance.save();
  }

  /**
   * Marks the weekend exchange for a user on behalf of an authority (e.g., manager) by creating a weekend exchange record with the provided original weekend date and new off date. Validates that the user exists and that there are no existing exchanges for the same original weekend date before creating the new exchange record.
   *
   * @param userId - The unique identifier of the user for whom the weekend exchange is being marked.
   * @param weekEndExchange - An object containing the original weekend date to be exchanged and the new off date after exchange.
   * @return A promise that resolves to the created weekend exchange record if successfully marked, or an object containing a message and exception if there was an error during the marking process (e.g., user not found, existing exchange for the original weekend date).
   */
  async weekendExchangeByAuthority(
    userId: UserIdDto["userId"],
    weekEndExchange: WeekendExchangeByAuthorityDto,
  ) {
    const { originalWeekendDate, newOffDate } = weekEndExchange;

    // Check if user exists
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

    // Check if an exchange already exists for the original weekend date
    const existingExchange = await this.weekendExchangeModel.findOne({
      user: new Types.ObjectId(userId),
      originalWeekendDate,
    });

    if (existingExchange) {
      return {
        message: "An exchange already exists for the original weekend date",
        exception: "HttpException",
      };
    }

    // Create new weekend exchange record
    const exchange = new this.weekendExchangeModel({
      user: new Types.ObjectId(userId),
      originalWeekendDate,
      newOffDate,
      exchangedBy: new Types.ObjectId(userId), // Assuming the manager is performing the exchange on behalf of the user
    });

    return await exchange.save();
  }
}
