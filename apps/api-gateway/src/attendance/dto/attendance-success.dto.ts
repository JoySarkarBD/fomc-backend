import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class AttendanceSuccessDto extends SuccessResponseDto<any> {
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
      user: "6996d5319754977e5498ebaf",
      checkInTime: "2026-02-23T09:05:00.000Z",
      date: "2026-02-23T00:00:00.000Z",
      inType: "PRESENT",
      shiftType: "DAY",
      isLate: false,
      _id: "6996d5319754977e5498ebc1",
      createdAt: "2026-02-23T09:05:00.000Z",
      updatedAt: "2026-02-23T09:05:00.000Z",
    },
  })
  declare data: any;
}
