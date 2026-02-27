import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MarkAttendanceSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Attendance marked" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/attendance/present" })
  declare endpoint: string;

  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({
    example: {
      user: "698ffc1ef75d367cc3e9d955",
      checkInTime: "2026-02-14T12:07:00.000Z",
      date: "2026-02-13T18:00:00.000Z",
      inType: "LATE",
      shiftType: "DAY",
      isLate: true,
      _id: "699065646c98dffa195f7d7e",
      createdAt: "2026-02-14T12:07:00.986Z",
      updatedAt: "2026-02-14T12:07:00.986Z",
    },
  })
  declare data: any;
}

export class MarkOutAttendanceSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Attendance marked as out" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/attendance/out" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      user: "698ffc1ef75d367cc3e9d955",
      checkInTime: "2026-02-14T12:07:00.000Z",
      checkOutTime: "2026-02-14T18:00:00.000Z",
      date: "2026-02-13T18:00:00.000Z",
      inType: "LATE",
      shiftType: "DAY",
      isLate: true,
      _id: "699065646c98dffa195f7d7e",
      createdAt: "2026-02-14T12:07:00.986Z",
      updatedAt: "2026-02-14T18:00:00.123Z",
    },
  })
  declare data: any;
}

export class SingleUserAttendanceSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Attendance retrieved" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/attendance/user-attendance" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        user: "6996d5319754977e5498ebaf",
        checkInTime: "2026-02-23T09:05:00.000Z",
        checkOutTime: "2026-02-23T17:00:00.000Z",
        date: "2026-02-23T00:00:00.000Z",
        inType: "PRESENT",
        shiftType: "DAY",
        isLate: false,
        _id: "6996d5319754977e5498ebc1",
        createdAt: "2026-02-23T09:05:00.000Z",
        updatedAt: "2026-02-23T17:00:00.000Z",
      },
    ],
  })
  declare data: any[];
}

export class UpdateByAuthorityWeekendSetSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Weekend updated successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/attendance/update-weekend-off/:userId" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "69991038cc699292d0d91d99",
      name: "Jhon Doe",
      employeeId: "OP 1072",
      phoneNumber: "+1234567890",
      email: "john@example.com",
      secondaryEmail: null,
      role: "EMPLOYEE",
      department: "OPERATIONS",
      designation: "FULL STACK DEVELOPER",
      isBlocked: false,
      employmentStatus: true,
      resignedDates: [],
      reJoiningDates: [],
      createdAt: "2026-02-21T01:54:00.517Z",
      updatedAt: "2026-02-24T08:50:55.114Z",
      avatar: "uploads/avatars/1771659362765-393732606.webp",
      weekEndOff: ["SUNDAY", "SATURDAY"],
    },
  })
  declare data: any;
}

export class WeekendExchangeSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Weekend exchange successful" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/attendance/weekend-exchange/:userId" })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "69991038cc699292d0d91d99",
      name: "Jhon Doe",
      employeeId: "OP 1072",
      phoneNumber: "+1234567890",
      email: "john@example.com",
      secondaryEmail: null,
      role: "EMPLOYEE",
      department: "OPERATIONS",
      designation: "FULL STACK DEVELOPER",
      isBlocked: false,
      employmentStatus: true,
      resignedDates: [],
      reJoiningDates: [],
      createdAt: "2026-02-21T01:54:00.517Z",
      updatedAt: "2026-02-24T08:50:55.114Z",
      avatar: "uploads/avatars/1771659362765-393732606.webp",
      weekEndOff: ["SUNDAY", "SATURDAY"],
    },
  })
  declare data: any;
}

export class MarkAttendanceAsAuthoritySuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Attendance marked by authority" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    example: "api/attendance/mark-attendance-by-authority/:userId",
  })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
        user: "6996d5319754977e5498ebaf",
        checkInTime: "2026-02-23T09:05:00.000Z",
        checkOutTime: "2026-02-23T17:00:00.000Z",
        date: "2026-02-23T00:00:00.000Z",
        inType: "PRESENT",
        shiftType: "DAY",
        isLate: false,
        _id: "6996d5319754977e5498ebc1",
        createdAt: "2026-02-23T09:05:00.000Z",
        updatedAt: "2026-02-23T17:00:00.000Z",
      },
    ],
  })
  declare data: any[];
}

export class MarkWeekendExchangeByAuthoritySuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: "Weekend exchange marked by authority" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    example: "api/attendance/weekend-exchange-by-authority/:userId",
  })
  declare endpoint: string;

  @ApiProperty({
    example: {
      _id: "69991038cc699292d0d91d99",
      user: "6996d5319754977e5498ebaf",
      originalWeekend: "2026-02-28T00:00:00.000Z",
      newWeekend: "2026-02-27T00:00:00.000Z",
      createdAt: "2026-02-24T10:00:00.000Z",
      updatedAt: "2026-02-24T10:00:00.000Z",
    },
  })
  declare data: any;
}
