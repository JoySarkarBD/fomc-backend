import { ApiProperty } from "@nestjs/swagger";
import { CustomTooManyRequestsDto } from "apps/api-gateway/src/common/dto/custom-throttler.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ForgotPasswordThrottlerDto extends CustomTooManyRequestsDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({
    example: "Too many forgot password requests. Please try again later.",
  })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/forgot-password" })
  declare endpoint: string;

  @ApiProperty({ example: 429 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: "Throttler error details" })
  declare error: string;
}
