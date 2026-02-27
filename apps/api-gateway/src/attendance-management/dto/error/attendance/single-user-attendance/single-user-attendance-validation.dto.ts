import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class SingleUserAttendanceValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/attendance/user-attendance/:userId" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "userId",
        message: "userId must be a valid UUID - query required",
      },
      {
        field: "month",
        message: "month must be a number between 1 and 12 - query required",
      },
      {
        field: "year",
        message: "year must be a number between 1900 and 2999 - query required",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
