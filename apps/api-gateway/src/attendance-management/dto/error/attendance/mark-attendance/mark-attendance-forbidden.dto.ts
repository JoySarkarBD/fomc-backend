import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MarkAttendanceForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/attendance/present" })
  declare endpoint: string;

  @ApiProperty({
    example: "Attendance already marked for today || Forbidden details error",
  })
  declare message: string;
}
