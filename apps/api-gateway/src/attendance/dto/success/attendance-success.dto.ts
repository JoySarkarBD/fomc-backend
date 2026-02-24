import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MarkAttendanceSuccessDto extends SuccessResponseDto<any> {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: "Attendance marked" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/attendance/present" })
  declare endpoint: string;

  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

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
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: "Attendance marked as out" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/attendance/out" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

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
