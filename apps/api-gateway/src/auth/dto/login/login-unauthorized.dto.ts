import { ApiProperty } from "@nestjs/swagger";
import { CustomUnauthorizedDto } from "apps/api-gateway/src/common/dto/custom-unauthorized.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class LoginUnauthorizedDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: "Invalid credentials" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/login" })
  declare endpoint: string;

  @ApiProperty({ example: 401 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({ example: "Invalid credentials error details" })
  declare error: string;
}
