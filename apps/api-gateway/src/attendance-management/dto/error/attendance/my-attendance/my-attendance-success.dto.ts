import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MyAttendanceSuccessDto extends SuccessResponseDto<any[]> {
  @ApiProperty({ example: "Attendance retrieved" })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/attendance/my-attendance" })
  declare endpoint: string;

  @ApiProperty({
    example: [
      {
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
    ],
  })
  declare data: any[];
}
