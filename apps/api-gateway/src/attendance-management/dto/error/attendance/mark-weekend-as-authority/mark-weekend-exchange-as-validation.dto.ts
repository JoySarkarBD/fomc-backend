import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class MarkWeekendExchangeAsAuthorityValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    example: "api/attendance/weekend-exchange-by-authority/:userId",
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
        field: "originalWeekendDate",
        message:
          "Original weekend date is required and must be a valid date string",
      },
      {
        field: "newOffDate",
        message: "New off date is required and must be a valid date string",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
