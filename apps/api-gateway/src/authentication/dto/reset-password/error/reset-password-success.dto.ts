import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ResetPasswordSuccessDto extends SuccessResponseDto<null> {
  @ApiProperty({ example: "Password reset successful" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/auth/reset-password" })
  declare endpoint: string;

  @ApiProperty({ example: null, nullable: true })
  declare data: null;
}
