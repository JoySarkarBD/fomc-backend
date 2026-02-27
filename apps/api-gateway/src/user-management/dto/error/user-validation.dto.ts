import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";

export class UsersValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user" })
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

      {
        field: "role",
        message: "Role must be valid MongoDB ObjectIds array - optional",
      },
      {
        field: "department",
        message: "Department must be valid MongoDB ObjectIds array - optional",
      },
      {
        field: "designation",
        message: "Designation must be valid MongoDB ObjectIds array - optional",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class UserValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/user/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "id",
        message: "ID must be a valid MongoDB ObjectId",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class UserProfileUpdateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/user/profile/me" })
  declare endpoint: string;

  @ApiProperty({ example: 400 })
  declare statusCode: number;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      {
        field: "name",
        message: "Name must be a string between 2 and 50 characters - optional",
      },
      {
        field: "avatar",
        message:
          "Avatar must be a valid image file (jpg, jpeg, png) and less than 2MB - optional",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
