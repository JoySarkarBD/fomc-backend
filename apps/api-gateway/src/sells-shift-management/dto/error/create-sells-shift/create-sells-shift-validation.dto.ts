import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class CreateSellsShiftValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/sells-shift-management/:userId" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "weekStartDate",
        message: "Date must be a valid UTC date string",
      },
      {
        field: "weekEndDate",
        message: "Date must be a valid UTC date string",
      },
      {
        field: "shiftType",
        message: "shiftType must be a valid ShiftTypeForSales",
      },
    ],
  })
  declare errors: any;
}
