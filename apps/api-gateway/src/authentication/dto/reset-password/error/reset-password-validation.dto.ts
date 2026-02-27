import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ResetPasswordValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/auth/reset-password" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "otp", message: "OTP must be 6 digits" },
      {
        field: "newPassword",
        message: "Password must be at least 6 characters long",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
