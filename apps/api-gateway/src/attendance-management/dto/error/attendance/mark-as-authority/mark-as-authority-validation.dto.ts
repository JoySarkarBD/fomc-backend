import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MarkAttendanceAsAuthorityValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    example: "api/attendance/mark-attendance-by-authority/:userId",
  })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "userId",
        message: "userId must be a valid MongoDB ObjectId - param required",
      },
      {
        field: "checkInTime",
        message: "checkInTime must be a valid UTC date string",
      },
      {
        field: "checkOutTime",
        message: "checkOutTime must be a valid UTC date string",
      },
      {
        field: "date",
        message: "date must be a valid UTC date string",
      },
      {
        field: "inType",
        message: "inType must be a valid inType value",
      },
      {
        field: "shiftType",
        message: "shiftType must be a valid shiftType value",
      },
      {
        field: "isLate",
        message: "isLate must be a boolean value",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
