import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ChangePasswordValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/auth/change-password" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "currentPassword", message: "Current password is required" },
      {
        field: "newPassword",
        message: "New password must be at least 6 characters long",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
