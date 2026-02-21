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
import { AuthUser } from "@shared/interfaces/auth-user.interface";
import { Model } from "mongoose";
import { firstValueFrom } from "rxjs";
import {
  Attendance,
  AttendanceDocument,
  AttendanceInType,
  ShiftTypeForOperations,
  ShiftTypeForSales,
} from "../schemas/attendance.schema";

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
  ) {}

  /**
   * Marks the attendance of a user as present or late based on their check-in time and shift timings.
   *
   * @param user - The authenticated user for whom the attendance is being marked.
   * @return A promise that resolves to the attendance record if successfully marked, or an object containing a message and exception if there was an error (e.g., user not found, attendance already marked, no shift matched).
   */
  async presentAttendance(
    user: AuthUser,
  ) /* : Promise<Attendance | { message: string; exception: string }> */ {
    const userId = (user.id ?? user._id) as string;

    // Check user existence from user-service
    const userExist = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, {
        id: userId,
        myRole: user.role,
        myId: userId,
        myDepartment: user.department,
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

    // Today start and end
    const todayStart = new Date(bdNow);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(bdNow);
    todayEnd.setHours(23, 59, 59, 999);

    // Prevent duplicate attendance
    const existingAttendance = await this.attendanceModel.findOne({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingAttendance) {
      return {
        message: "Attendance already marked for today",
        exception: "HttpException",
      };
    }

    const currentMinutes = bdNow.getHours() * 60 + bdNow.getMinutes();

    let shiftType: string;
    let shiftStartMinutes = 0;

    console.log(user);

    // Fixed shift for HR
    if (user.role === "HR") {
      shiftType = ShiftTypeForOperations.DAY; // 09:00 → 18:00
      shiftStartMinutes = 9 * 60; // 09:00 AM
    } else {
      // SWITCH BASED ON DEPARTMENT
      switch (user.department) {
        case "OPERATIONS":
          shiftType = ShiftTypeForOperations.DAY;
          shiftStartMinutes = 9 * 60;
          break;
        case "SALES": {
          const morningStart = 7 * 60;
          const morningEnd = 15 * 60;
          const eveningStart = 15 * 60;
          const eveningEnd = 23 * 60;
          const nightStart = 23 * 60;
          const nightEnd = 7 * 60;

          if (currentMinutes >= morningStart && currentMinutes < morningEnd) {
            shiftType = ShiftTypeForSales.MORNING;
            shiftStartMinutes = morningStart;
          } else if (
            currentMinutes >= eveningStart &&
            currentMinutes < eveningEnd
          ) {
            shiftType = ShiftTypeForSales.EVENING;
            shiftStartMinutes = eveningStart;
          } else {
            shiftType = ShiftTypeForSales.NIGHT;
            shiftStartMinutes = nightStart;
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

    const graceLimit = shiftStartMinutes + 15;
    let isLate = currentMinutes > graceLimit;

    const attendanceType = isLate
      ? AttendanceInType.LATE
      : AttendanceInType.PRESENT;

    // Save Attendance
    const attendance = await this.attendanceModel.create({
      user: userId,
      checkInTime: bdNow,
      date: todayStart,
      inType: attendanceType,
      shiftType,
      isLate,
    });

    return attendance;
  }
}
