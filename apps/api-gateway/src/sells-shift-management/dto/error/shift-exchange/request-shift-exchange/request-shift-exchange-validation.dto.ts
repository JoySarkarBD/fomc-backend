import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";
import { ShiftTypeForSales } from "apps/workforce-service/src/schemas/attendance.schema";

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
        message: `originalShift must be one of the following values ${Object.values(ShiftTypeForSales).join(", ")}`,
      },
      {
        field: "newShift",
        message: `newShift must be one of the following values ${Object.values(ShiftTypeForSales).join(", ")}`,
      },
      {
        field: "reason",
        message: "reason must be a string",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
