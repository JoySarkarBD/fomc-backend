import { ApiProperty } from "@nestjs/swagger";
import { CustomTooManyRequestsDto } from "apps/api-gateway/src/common/dto/custom-throttler.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ForgotPasswordThrottlerDto extends CustomTooManyRequestsDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/forgot-password" })
  declare endpoint: string;
}
