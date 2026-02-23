import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class ForgotPasswordValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: "Forgot password validation failed" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/forgot-password" })
  declare endpoint: string;

  @ApiProperty({ example: 400 })
  declare statusCode: number;

  @ApiProperty({ example: "2026-02-23T12:00:00.000Z" })
  declare timestamp: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "email", message: "Email must be a valid email address" },
    ],
  })
  declare errors: FieldErrorDto[];
}
