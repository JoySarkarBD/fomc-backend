import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MyAttendanceValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/attendance/my-attendance" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        filed: "month",
        message: "month must be a number between 1 and 12 - query required",
      },
      {
        filed: "year",
        message: "year must be a number between 1900 and 2999 - query required",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
