import { ApiProperty } from "@nestjs/swagger";
import { CustomTooManyRequestsDto } from "apps/api-gateway/src/common/dto/custom-throttler.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ResetPasswordThrottlerDto extends CustomTooManyRequestsDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/auth/reset-password" })
  declare endpoint: string;
}
