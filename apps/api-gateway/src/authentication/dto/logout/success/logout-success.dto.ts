import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class LogoutSuccessDto extends SuccessResponseDto<null> {
  @ApiProperty({ example: "Logout successful" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/logout" })
  declare endpoint: string;

  @ApiProperty({ example: null, nullable: true })
  declare data: null;
}
