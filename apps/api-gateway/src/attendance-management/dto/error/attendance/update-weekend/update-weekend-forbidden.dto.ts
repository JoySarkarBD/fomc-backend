import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class UpdateByAuthorityWeekendSetForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/attendance/update-weekend/:userId" })
  declare endpoint: string;

  @ApiProperty({
    example: "Forbidden details error",
  })
  declare message: string;
}
