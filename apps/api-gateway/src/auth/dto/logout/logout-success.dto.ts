import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class LogoutSuccessDto extends SuccessResponseDto<null> {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: "Logout successful" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/logout" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: null, nullable: true })
  declare data: null;
}
