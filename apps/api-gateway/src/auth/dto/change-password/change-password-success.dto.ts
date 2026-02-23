import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "apps/api-gateway/src/common/dto/success-response.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ChangePasswordSuccessDto extends SuccessResponseDto<null> {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: "Password changed successfully" })
  declare message: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/auth/change-password" })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: null, nullable: true })
  declare data: null;
}
