import { ApiProperty } from "@nestjs/swagger";
import { CustomConflictDto } from "apps/api-gateway/src/common/dto/custom-conflict.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MyAttendanceConflictDto extends CustomConflictDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/attendance/my-attendance" })
  declare endpoint: string;
}
