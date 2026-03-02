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
import { convertToBDDate } from "@shared/utils/convert-to-db-date";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import {
  Attendance,
  AttendanceDocument,
  AttendanceInType,
  ShiftTypeForOperations,
  ShiftTypeForSales,
} from "../schemas/attendance.schema";
import { SalesShiftAssignment } from "../schemas/sales-shift-assignment.schema";
import { ShiftExchangeStatus } from "../schemas/shift-exchange.schema";
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
    @InjectModel(SalesShiftAssignment.name)
    private readonly salesShiftAssignmentModel: Model<SalesShiftAssignment>,
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

    // Prepare dates (Bangladesh time)
    const nowUTC = new Date();
    const bdNow = new Date(
      nowUTC.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    );

    const today = new Date(bdNow);

    const todayDayUpper = bdNow
      .toLocaleString("en-US", { timeZone: "Asia/Dhaka", weekday: "long" })
      .toUpperCase();

    // Prevent duplicate attendance
    const existing = await this.attendanceModel.findOne({
      user: new Types.ObjectId(userId),
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      },
    });

    if (existing) {
      return {
        message: "Attendance already marked for today",
        exception: "HttpException",
      };
    }

    // Weekend & exchange checks
    const exchangeMadeTodayOff = await this.weekendExchangeModel.findOne({
      user: new Types.ObjectId(userId),
      newOffDate: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      }, // today became OFF day
    });

    const exchangeMadeTodayWorking = await this.weekendExchangeModel.findOne({
      user: new Types.ObjectId(userId),
      originalWeekendDate: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      }, // today was originally weekend → now working
    });

    const isNormallyWeekend =
      userDoc.weekEndOff?.includes(todayDayUpper) ?? false;

    const isTodayForcedOff = !!exchangeMadeTodayOff;
    const isTodayForcedWork = !!exchangeMadeTodayWorking;

    const isWorkingDay =
      !isTodayForcedOff && (!isNormallyWeekend || isTodayForcedWork);

    //  Weekend / forced OFF → mark as WEEKEND
    if (!isWorkingDay) {
      return this.attendanceModel.create({
        user: new Types.ObjectId(userId),
        date: today,
        inType: AttendanceInType.WEEKEND,
        shiftType: undefined,
        checkInTime: undefined,
        checkOutTime: undefined,
        isLate: undefined,
      });
    }

    // From here: TODAY IS A WORKING DAY - need to determine shift and check-in time
    let shiftType: string | undefined;
    let shiftStartMinutes: number;

    // SALES department
    if (user.department === "SALES") {
      // Decide which date's shift assignment to look up
      const shiftAssignmentDate = isTodayForcedWork
        ? exchangeMadeTodayWorking.originalWeekendDate // most important: use original weekend date's assignment
        : today;

      const assignment = await this.sellsShiftManagementService.getShiftForDate(
        userId,
        shiftAssignmentDate,
      );

      if (!assignment) {
        return {
          message: "No shift assigned for this period. Contact admin.",
          exception: "HttpException",
        };
      }

      // Check if this shift is still valid today (not exchanged away)
      const hasActiveExchangeToday =
        assignment.shiftExchanges?.some((ex: any) => {
          return (
            ex.status === ShiftExchangeStatus.APPROVED &&
            new Date(ex.exchangeDate).toDateString() === today.toDateString()
          );
        }) ?? false;

      let exchangedShiftToday: string | undefined;

      console.log("Has exchange today:", hasActiveExchangeToday);

      // If there's an active exchange today and today is a forced work day (originally weekend), we need to use the new shift from the exchange instead of the assigned shift
      if (hasActiveExchangeToday && isTodayForcedWork) {
        const exchangeShiftToday = assignment.shiftExchanges?.find(
          (ex: any) => {
            return (
              ex.status === ShiftExchangeStatus.APPROVED &&
              new Date(ex.exchangeDate).toDateString() === today.toDateString()
            );
          },
        ) as any;

        console.log("Has exchange today up:", exchangedShiftToday);

        if (exchangeShiftToday) {
          exchangedShiftToday = exchangeShiftToday.newShift;
          console.log("Has exchange today down:", exchangedShiftToday);
        } else {
          return {
            message: "Shift exchange data inconsistency. Contact admin.",
            exception: "HttpException",
          };
        }
      }

      // If there's an active exchange today, it overrides the assigned shift for today
      if (hasActiveExchangeToday) {
        const exchangeShiftToday = assignment.shiftExchanges?.find(
          (ex: any) => {
            return (
              ex.status === ShiftExchangeStatus.APPROVED &&
              new Date(ex.exchangeDate).toDateString() === today.toDateString()
            );
          },
        ) as any;

        shiftType = exchangeShiftToday.newShift;
      }

      // Priority for determining today's shift:
      if (isTodayForcedWork) {
        shiftType = assignment.shiftType;
      }

      const shiftStartMap: Record<ShiftTypeForSales, number> = {
        [ShiftTypeForSales.MORNING]: 7 * 60,
        [ShiftTypeForSales.EVENING]: 15 * 60,
        [ShiftTypeForSales.NIGHT]: 23 * 60,
      };

      shiftStartMinutes = shiftStartMap[shiftType as ShiftTypeForSales];

      console.log(
        "shiftType:",
        shiftType,
        "shiftStartMinutes:",
        shiftStartMinutes,
      );

      if (shiftStartMinutes === undefined) {
        return {
          message: "Invalid shift type in assignment",
          exception: "HttpException",
        };
      }
    }

    // OPERATIONS / HR
    else if (user.role === "HR" || user.department === "OPERATIONS") {
      shiftType = ShiftTypeForOperations.DAY;
      shiftStartMinutes = 9 * 60;
    }

    // Unsupported department
    else {
      return {
        message: "Department not supported for self check-in",
        exception: "HttpException",
      };
    }

    // Time-window & lateness check
    let currentMinutes = bdNow.getHours() * 60 + bdNow.getMinutes();

    // Handle night shift crossing midnight
    if (shiftType === ShiftTypeForSales.NIGHT && currentMinutes < 12 * 60) {
      currentMinutes += 24 * 60; // treat as continuation from previous day
    }

    const gracePeriodMinutes = 15;
    // Allow check-in from 4 hours before shift start to 4 hours after shift start
    const earlyAllowanceMinutes = 4 * 60; // 4 hours before shift start
    const lateAllowanceMinutes = 4 * 60; // 24 hours after shift start

    const diff = currentMinutes - shiftStartMinutes;

    if (diff < -earlyAllowanceMinutes || diff > lateAllowanceMinutes) {
      return {
        message: "Check-in time is outside the allowed window for the shift",
        exception: "HttpException",
      };
    }

    const isLate = currentMinutes > shiftStartMinutes + gracePeriodMinutes;

    const inType = isLate ? AttendanceInType.LATE : AttendanceInType.PRESENT;

    // Create attendance record
    const attendance = await this.attendanceModel.create({
      user: new Types.ObjectId(userId),
      date: today,
      inType,
      shiftType,
      checkInTime: bdNow,
      isLate,
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

    const attendance = await this.attendanceModel.findOne({
      user: new Types.ObjectId(userId),
      date: {
        $gte: new Date(todayDate.setHours(0, 0, 0, 0)),
        $lte: new Date(todayDate.setHours(23, 59, 59, 999)),
      },
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
    let { inType, date, shiftType, isLate, checkInTime, checkOutTime } =
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
    const bdNow = convertToBDDate(nowUTC);

    // Validation: For certain inTypes, check-in/check-out times should not be provided
    const noTimesAllowed = [
      AttendanceInType.ABSENT,
      AttendanceInType.ON_LEAVE,
      AttendanceInType.WEEKEND,
    ];

    // For inTypes where times are not allowed, we will upsert the record without check-in/check-out times
    if (noTimesAllowed.includes(inType)) {
      const attendance = await this.attendanceModel.findOneAndUpdate(
        {
          user: new Types.ObjectId(userId),
          date: convertToBDDate(date ? new Date(date) : bdNow),
        },
        {
          user: new Types.ObjectId(userId),
          date: convertToBDDate(date ? new Date(date) : bdNow),
          inType,
          shiftType,
          isLate,
          checkInTime: null,
          checkOutTime: null,
        },
        { upsert: true, new: true },
      );

      return attendance;
    }

    // If check-in/check-out times are provided, update the attendance record with them
    const attendance = await this.attendanceModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
        date: convertToBDDate(date ? new Date(date) : bdNow),
      },
      {
        user: new Types.ObjectId(userId),
        date: convertToBDDate(date ? new Date(date) : bdNow),
        inType,
        shiftType,
        isLate,
        checkInTime: checkInTime ? new Date(checkInTime) : bdNow,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
      },
      { upsert: true, new: true },
    );

    return attendance;
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
    let { originalWeekendDate, newOffDate } = weekEndExchange;

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
      originalWeekendDate: convertToBDDate(originalWeekendDate),
    });

    if (existingExchange) {
      return {
        message: "An exchange already exists for the original weekend date",
        exception: "HttpException",
      };
    }

    originalWeekendDate = convertToBDDate(originalWeekendDate);
    newOffDate = convertToBDDate(newOffDate);

    // Create new weekend exchange record
    const exchange = new this.weekendExchangeModel({
      user: new Types.ObjectId(userId),
      originalWeekendDate,
      newOffDate,
      exchangedBy: new Types.ObjectId(userId), // Assuming the manager is performing the exchange on behalf of the user
    });

    // Original weekend's week range
    const originalWeekStart = new Date(originalWeekendDate);
    originalWeekStart.setDate(
      originalWeekStart.getDate() - originalWeekStart.getDay(),
    ); // Sunday

    const originalWeekEnd = new Date(originalWeekStart);
    originalWeekEnd.setDate(originalWeekEnd.getDate() + 6); // Saturday

    // Find the shift which match the current week
    const shift = await this.salesShiftAssignmentModel.findOne({
      user: new Types.ObjectId(userId),
      weekStartDate: { $lte: originalWeekStart },
      weekEndDate: { $gte: originalWeekStart, $lte: originalWeekEnd },
    });

    if (shift) {
      shift.myWeekends = {
        currentWeekends: shift.myWeekends?.currentWeekends || [],
        updatedWeekends: shift.myWeekends?.updatedWeekends || [],
        exchangedWeekendDates: [
          ...(shift.myWeekends?.exchangedWeekendDates || []),
          exchange.originalWeekendDate,
        ],
      };
      await shift.save();
    }

    return await exchange.save();
  }
}
