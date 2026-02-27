import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RegistrationValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: "Registration validation failed" })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/auth/register" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "name", message: "Name is required" },
      { field: "employeeId", message: "Employee ID is required" },
      { field: "phoneNumber", message: "Phone number is required" },
      { field: "email", message: "Email must be a valid email address" },
      { field: "secondaryEmail", message: "Secondary email must be valid" },
      {
        field: "password",
        message: "Password must be at least 6 characters long",
      },
      { field: "role", message: "Role must be a valid MongoDB ObjectId" },
    ],
  })
  declare errors: FieldErrorDto[];
}
