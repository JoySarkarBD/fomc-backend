import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";
import { LeaveType } from "apps/workforce-service/src/schemas/leave.schema";

export class LeaveRequestValidationErrorDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/leave/request" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "type",
        message: `type must be a valid enum ${Object.values(LeaveType).join(", ")}`,
      },
      {
        field: "startDate",
        message: "startDate must be a valid UTC date string - required",
      },
      {
        field: "endDate",
        message: "endDate must be a valid UTC date string - required",
      },
      {
        field: "reason",
        message: "reason must be a string - required",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class MyLeaveValidationErrorDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/leave/my-leaves" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "year",
        message: "year must be a positive integer - query param",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class UserSpecificLeaveValidationErrorDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/leave/user-specific/:userId" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "userId",
        message: "userId must be a valid UUID - path param",
      },
      {
        field: "year",
        message: "year must be a positive integer - query param",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class SpecificLeaveRequestValidationErrorDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/leave/specific/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "id",
        message: "id must be a valid UUID - path param",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class LeaveRequestApprovalValidationErrorDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/leave/approve/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "id",
        message: "id must be a valid UUID - path param",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class LeaveRequestRejectionValidationErrorDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/leave/reject/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "id",
        message: "id must be a valid UUID - path param",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
