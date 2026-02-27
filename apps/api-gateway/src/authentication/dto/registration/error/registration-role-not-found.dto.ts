import { ApiProperty } from "@nestjs/swagger";
import { CustomNotFoundDto } from "apps/api-gateway/src/common/dto/custom-not-found.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RegistrationRoleNotFoundDto extends CustomNotFoundDto {
  @ApiProperty({ example: "Role not found" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/register" })
  declare endpoint: string;

  @ApiProperty({ example: "Role not found error details" })
  declare error: string;
}
