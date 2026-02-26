import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RequestShiftExchangeValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/sells-shift-management/exchange/request" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "exchangeDate",
        message: "exchangeDate must be a valid UTC date string",
      },
      {
        field: "originalShift",
        message:
          "originalShift must be one of the following values: MORNING, EVENING, NIGHT",
      },
      {
        field: "newShift",
        message:
          "newShift must be one of the following values: MORNING, EVENING, NIGHT",
      },
      {
        field: "reason",
        message: "reason must be a string",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
