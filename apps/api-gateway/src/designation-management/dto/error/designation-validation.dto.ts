import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";

import { ApiProperty } from "@nestjs/swagger";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class DesignationCreateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "name", message: "Designation name is required" },
      {
        field: "description",
        message: "Designation description must be a string - optional",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class DesignationsValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/designation" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "pageNo",
        message: "Page number must be a positive integer",
      },

      {
        field: "pageSize",
        message: "Page size must be a positive integer between 1 and 100",
      },
      {
        field: "searchKey",
        message: "Search key must be a string",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class DesignationGetByIdValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "id",
        message: "ID must be a valid MongoDB ObjectId Parameter",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class DesignationUpdateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "id",
        message: "ID must be a valid MongoDB ObjectId Parameter - required",
      },
      {
        field: "name",
        message: "Designation name must be a string - optional",
      },
      {
        field: "description",
        message: "Designation description must be a string - optional",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class DesignationDeleteValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: "api/designation/:id" })
  declare endpoint: string;

  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "id", message: "ID must be a valid MongoDB ObjectId Parameter" },
    ],
  })
  declare errors: FieldErrorDto[];
}
