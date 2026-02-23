import { ApiProperty } from "@nestjs/swagger";
import { CustomConflictDto } from "apps/api-gateway/src/common/dto/custom-conflict.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RegistrationEmailConflictDto extends CustomConflictDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: "Email already in use" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/register" })
  declare endpoint: string;

  @ApiProperty({ example: 409 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-22T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: "Email already in use error details" })
  declare error: string;
}
