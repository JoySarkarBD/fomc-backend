import { ApiProperty } from "@nestjs/swagger";
import { CustomForbiddenDto } from "apps/api-gateway/src/common/dto/custom-forbidden.dto";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class GetMyShiftForbiddenDto extends CustomForbiddenDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/sells-shift-management/my-shifts" })
  declare endpoint: string;
}

export class GetMyShiftInternalErrorDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/sells-shift-management/my-shifts" })
  declare endpoint: string;
}

export class GetMyShiftNotFoundDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/sells-shift-management/my-shifts" })
  declare endpoint: string;

  @ApiProperty({ example: "User not found" })
  declare message: string;
}

export class GetMyShiftUnauthorizedDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/sells-shift-management/my-shifts" })
  declare endpoint: string;
}

export class GetMyShiftValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/sells-shift-management/my-shifts" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
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
