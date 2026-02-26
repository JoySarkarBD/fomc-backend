import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class RejectShiftExchangeValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    example: "api/sells-shift-management/exchange/reject/:exchangeId",
  })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "exchangeId",
        message: "exchangeId must be a valid UUID - query required",
      },
      {
        field: "reason",
        message: "reason must be a non-empty string",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
