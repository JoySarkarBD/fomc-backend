import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class SingleUserAttendanceForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/attendance/user-attendance/:userId" })
  declare endpoint: string;

  @ApiProperty({
    example: "Forbidden details error",
  })
  declare message: string;
}
